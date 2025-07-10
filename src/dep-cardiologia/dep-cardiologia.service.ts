import { BadRequestException, ConflictException, ForbiddenException, forwardRef, Inject, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateCardiologoDto, CreateCitaDto, CreatePrescripcion_Medicamentos, UpdateHistorialDto } from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Agendas, Cardiologos, Citas, Prescripciones, Prescripciones_Medicamentos } from './entities';
import { Repository } from 'typeorm';
import { EmpleadosService } from 'src/empleados/empleados.service';
import { AuthService } from 'src/auth/auth.service';
import { createAgendaDto } from './dto/createAgenda.dto';
import { PacientesService } from 'src/pacientes/pacientes.service';
import { Actualiza } from './entities/actualiza.entity';
import { FarmaciasService } from 'src/farmacias/farmacias.service';
import { Medicamentos } from 'src/farmacias/entities';
import { isUUID } from 'class-validator';

@Injectable()
export class DepcardiologiaService {
    private logger = new Logger('DepartCardiologia')

    constructor(
        @InjectRepository(Cardiologos, 'cardiologiConnection')
        private readonly cardiologoRepository: Repository<Cardiologos>,

        @InjectRepository(Agendas, 'cardiologiConnection')
        private readonly agendaRepository: Repository<Agendas>,

        @InjectRepository(Citas, 'cardiologiConnection')
        private readonly citaRepositoty: Repository<Citas>,

        @InjectRepository(Actualiza, 'cardiologiConnection')
        private readonly historialActRepository: Repository<Actualiza>,

        @InjectRepository(Prescripciones, 'cardiologiConnection')
        private readonly prescripcionRepository: Repository<Prescripciones>,


        @InjectRepository(Prescripciones_Medicamentos, 'cardiologiConnection')
        private readonly presMedRepository: Repository<Prescripciones_Medicamentos>,

        private readonly authService: AuthService,
        private readonly empleadosService: EmpleadosService,
        private readonly farmaciaService: FarmaciasService,
        @Inject(forwardRef(()=>PacientesService))
        private readonly pacienteService: PacientesService
    ){}

    async createCardiologo(createCardiologoDto: CreateCardiologoDto){
        let data = createCardiologoDto;
        const {medico} = await this.empleadosService.createMedico(data.createEmpleadoMedicoDto);
        
        console.log(medico)
        try {
            let cardiologo = this.cardiologoRepository.create({id_empleado: medico.id_empleado})
            cardiologo = await this.cardiologoRepository.save(cardiologo)
            return {cardiologo}
            
        } catch (error) {
            this.authService.delete(data.createEmpleadoMedicoDto.userDto.cedula)
            this.logger.log(error.detail)
            throw new InternalServerErrorException(`Ha ocurrido un error ${error.message}`)
        }

    }
    
    async createAgenda(createAgendaDto: createAgendaDto){
        const {id_empleado, ...data} = createAgendaDto;
        
        if(data.hora_fin < data.hora_inicio){
            throw new BadRequestException(`Ha digitado un horario donde la hora de inicio es despues de la hora de finalizacion de la agenda`)
        }

        const validateNotDuplicate = await this.agendaRepository
            .createQueryBuilder('agenda')
            .where('agenda.hora_inicio = :hora_inicio', {hora_inicio: data.hora_inicio})
            .andWhere('agenda.hora_fin = :hora_fin', {hora_fin: data.hora_fin})
            .andWhere('agenda.fecha = :fecha',{fecha: data.fecha})
            .getOne()
        console.log(validateNotDuplicate)
        if(validateNotDuplicate) 
            throw new ConflictException(`Ya existe una agenda con fecha: ${data.fecha} y intervalo de hora: [${data.hora_inicio},${data.hora_fin}]`)
        
        const validateOverlap = await this.agendaRepository
            .createQueryBuilder('agenda')
            .where('agenda.fecha = :fecha', { fecha: data.fecha })
            .andWhere(':hora_inicio < agenda.hora_fin AND :hora_fin > agenda.hora_inicio', {
                hora_inicio: data.hora_inicio,
                hora_fin: data.hora_fin
            })
            .getOne();

            if (validateOverlap) {
            throw new ConflictException(
                `Ya existe una agenda que se traslapa con el intervalo [${data.hora_inicio}, ${data.hora_fin}] en la fecha ${data.fecha}`
            )
            }
        const cardiologo = await this.cardiologoRepository.findOneBy({id_empleado})
        if(!cardiologo) throw new BadRequestException(`El cargiologo al cual quiere asingarle la agenda no exite`)
        
        const agenda = this.agendaRepository.create(
            {
                cardiologo,
                ...data,
            })
        try {
            await this.agendaRepository.save(agenda)
            return {ok: true}
        } catch (error) {
            this.logger.log(error.detail)
            throw new BadRequestException(error.message)
        }
    }


    async createCita(createCitaDto: CreateCitaDto){
        //Consultar si existe el paciente
        const {id_paciente,id_agenda,cedula_admin,...dataCita} = createCitaDto
        const paciente = await this.pacienteService.buscarPaciente(id_paciente)
        if(!paciente) throw new NotFoundException(`El paciente con cedula: ${id_paciente} no se encontro en la base de datos`)
        
        const agenda = await this.agendaRepository.findOne({where: {id_agenda},relations:['cardiologo']})
        if(!agenda) throw new NotFoundException(`La agenda con id: ${id_agenda} no se encontro en la base de datos`)
        if(agenda.estado ==='ocupado') throw new BadRequestException(`La agenda que selecciono se encuentra ocupada`)
        
        const id_admin = await this.empleadosService.getInfoAdmin(cedula_admin);

        const cardiologo: Cardiologos = agenda.cardiologo;
        
        const dataFaltante = await this.empleadosService.getInfoMedico(cardiologo.id_empleado)
        // return {dataFaltante}
        try {
            let cita = this.citaRepositoty.create({
                ...dataCita,
                fecha: agenda.fecha,
                hora_inicio: agenda.hora_inicio,
                hora_fin: agenda.hora_fin,
                nom_med: dataFaltante?.usuario.nombre,
                id_medico: agenda?.cardiologo,
                id_paciente: id_paciente,
                id_admin,
                agenda
            })
            cita = await this.citaRepositoty.save(cita);
            await this.agendaRepository.update(
                {id_agenda: agenda.id_agenda},
                {estado: 'ocupado'}
            )
            return {cita}

        } catch (error) {
            this.logger.log(error.detail)
            throw new InternalServerErrorException(`Ha ocurrido un error: ${error.message}`)
        }
    
    }


    async actualizarHistorial(updateHistorialDto: UpdateHistorialDto) {
        const { id_cita, ...dataHistorial } = updateHistorialDto;

        const citaData = await this.citaRepositoty.findOne({
            where: { id_cita },
            relations: ['agenda', 'id_medico'],
        });

        if (!citaData) throw new NotFoundException(`La cita con ID ${id_cita} no existe`);

        const medico = citaData.id_medico;    // objeto Cardiologo
        const agenda = citaData.agenda;    // objeto Agenda

        const id_historial = await this.pacienteService.buscarCodHistorial(citaData.id_paciente)
        

        const now = new Date();
        const hora = now.getHours().toString().padStart(2, '0') + now.getMinutes().toString().padStart(2, '0');
        console.log({citaData})
        const actualizacion = this.historialActRepository.create({
            ...dataHistorial,
            agenda: citaData.agenda,                       // objeto Agendas
            id_medico: medico?.id_empleado,          // string (uuid)
            fecha_actualizacion: agenda?.fecha,
            hora,
            id_cita: citaData.id_cita,
            id_historial,
        });

        await this.historialActRepository.save(actualizacion);
        
        this.pacienteService.crearRegistro({
            cedula: citaData.id_paciente,
            descripcion: dataHistorial.descripcion
        })
        
        return { message: 'Actualización registrada con éxito', actualizacion };

    }


    async createPrescripcionMedicamento(createPrescripcionMedicamento: CreatePrescripcion_Medicamentos){

        const {id_cita, id_medicamento, ...dataPrescripcion} = createPrescripcionMedicamento; 

        const medicamentos = await this.farmaciaService.consultarMedicamentos(id_medicamento);

        if (!medicamentos || medicamentos.length === 0) {
        throw new BadRequestException(`El medicamento que digitó no está registrado en la base de datos`);
        }
        const citaData = await this.citaRepositoty.findOne({
            where: { id_cita },
            relations: ['agenda', 'id_medico'],
        });
        if(!citaData) throw new BadRequestException(`Informacion de la cita no encontrada`)

        let prescripcion = this.prescripcionRepository.create({
            ...dataPrescripcion,
            id_agenda: citaData.agenda.id_agenda,
            id_medico: citaData.id_medico.id_empleado,
            cita: citaData,
            id_paciente: citaData.id_paciente,

        })
        try {
            prescripcion = await this.prescripcionRepository.save(prescripcion);
            
            let presMedicamento = this.presMedRepository.create({
                id_medicamento: id_medicamento,
                id_prescripcion: prescripcion.id_prescripcion
            }) 
            presMedicamento = await this.presMedRepository.save(presMedicamento);
            console.log({presMedicamento});
            return {message: `La prescripcion se ha creado con exito, su id es: ${presMedicamento.id_prescripcion}`}
        } catch (error) {
            this.logger.log(error.detail)
            throw new BadRequestException (`Ha ocurrido un error: ${error}`)
        }

    }   
    async consultarPrescripciones(cedula:string){
       const prescripciones = await this.prescripcionRepository.find({
        where: { id_paciente: cedula },
        relations: ['medicamentos'],
        });
        return prescripciones
    }

    async consultarAgenda(term?: string) {
        // Si se envía un parámetro (puede ser un UUID o una cédula)
        if (term) {
            if (isUUID(term)) {
                const agendas = await this.agendaRepository
                    .createQueryBuilder('agendas')
                    .leftJoinAndSelect('agendas.cardiologo', 'cardiologo')
                    .leftJoinAndSelect('agendas.cita', 'cita')
                    .where('agendas.cardiologo = :id_cardiologo', { id_cardiologo: term })
                    .select(
                        [
                        'agendas.id_agenda',
                        'agendas.estado',
                        'agendas.hora_inicio',
                        'agendas.hora_fin',
                        'agendas.fecha',
                        'agendas.id_empleado as agendas_id_empleado',
                        'cita.id_cita'
                        ]
                    )
                    .getRawMany();

                if (!agendas || agendas.length === 0)
                    throw new NotFoundException (`El médico con ID: ${term} no cuenta con agendas hasta la fecha`);

                return agendas;
            } else {
                const medico = await this.empleadosService.getMedico(term); // term es cédula
                const agendas = await this.agendaRepository
                    .createQueryBuilder('agendas')
                    .leftJoinAndSelect('agendas.cardiologo', 'cardiologo')
                    .leftJoinAndSelect('agendas.cita', 'cita')
                    .where('agendas.cardiologo = :id_cardiologo', { id_cardiologo: medico.empleado_id_empleado })
                    .select(
                        [
                        'agendas.id_agenda',
                        'agendas.estado',
                        'agendas.hora_inicio',
                        'agendas.hora_fin',
                        'agendas.fecha',
                        'agendas.id_empleado as agendas_id_empleado',
                        'cita.id_cita'
                        ]
                    )
                    .getRawMany();

                if (!agendas || agendas.length === 0)
                    return `El médico con cédula: ${term} no cuenta con agendas hasta la fecha`;

                return agendas;
            }
        }

        // Si no se pasa parámetro, retorna todas las agendas
        const agendas = await this.agendaRepository
        .createQueryBuilder('agendas')
        .leftJoinAndSelect('agendas.cita', 'cita')
        .select(
            [
            'agendas.id_agenda',
            'agendas.estado',
            'agendas.hora_inicio',
            'agendas.hora_fin',
            'agendas.fecha',
            'agendas.id_empleado as agendas_id_empleado',
            'cita.id_cita'
            ]
            )
        .getRawMany()
        return agendas;
    }

    async getCitas(cedula: string){
        const citas = await this.citaRepositoty
            .createQueryBuilder('citas')
            .where('citas.id_paciente = :cedula', {cedula})
            .getRawMany()
        return citas
    }

    async getCitasMedico(id_medico: string){
        if(!isUUID(id_medico)) throw new BadRequestException(`Ha ocurrido un error: Sebe de ingresar su id de empleado`)
        const citas = await this.citaRepositoty
            .createQueryBuilder('citas')
            .where('citas.id_medico = :id_medico', {id_medico})
            .getMany()
        
        if(!citas){
            return {message: `Actualmente no tiene asignada ninguna cita medica`}
        }
        return citas;
        
    }
}
