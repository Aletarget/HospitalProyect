import { BadRequestException, HttpException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateFarmaciaDto } from './dto/create-farmacia.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Adquiere, Farmaceuticos, Farmacias, Farmacias_Medicamentos, Medicamentos } from './entities';
import { AuthService } from 'src/auth/auth.service';
import { CreateFarmaceuticoDto, CreateMedicamentoDto, Farmacia_MedicamentoDto } from './dto';
import { isUUID } from 'class-validator';
import { CreateCompraDto } from './dto/create-compra.dto';

@Injectable()
export class FarmaciasService {
    private logger = new Logger('ServiceFarmacias')

    constructor(

    @InjectRepository(Farmacias, 'farmaciasConnection')
    private readonly farmaciaRepository: Repository<Farmacias>,

    @InjectRepository(Farmaceuticos, 'farmaciasConnection')
    private readonly farmaceuticoRepository: Repository<Farmaceuticos>,

    @InjectRepository(Medicamentos, 'farmaciasConnection')
    private readonly medicamentoRepositoy: Repository<Medicamentos>,

    @InjectRepository(Farmacias_Medicamentos, 'farmaciasConnection')
    private readonly registroRepositoy: Repository<Farmacias_Medicamentos>,

    @InjectRepository(Adquiere, 'farmaciasConnection')
    private readonly compraRepository: Repository<Adquiere>,

    private readonly authService: AuthService,
        
    ){}
//Registrar una nueva farmacia;
    async createFarmacia(createFarmaciaDto: CreateFarmaciaDto){
        const data = createFarmaciaDto;
        console.log(data);
        const farmaciaExistente = await this.farmaciaRepository
            .createQueryBuilder('farm')
            .where(`LOWER(TRIM(farm.nombre)) = LOWER(TRIM(:nombre))`, { nombre: data.nombre })
            .getOne();

        if(farmaciaExistente) throw new BadRequestException(`Ya existe una farmacia con ese nombre, vuelvalo a intentar`)

        let farmacia = this.farmaciaRepository.create(data);
        try {
            await this.farmaciaRepository.save(farmacia);
            return {ok: true};
        } catch (error) {
            this.logger.log(`Error al crear la farmacia: ${error.detail}`);
            throw new InternalServerErrorException(error);
        }
    }   
//Registrar un nuevo farmaceutico
    async createFarmaceutico(createFarmaceuticoDto : CreateFarmaceuticoDto){
        const {userData, licencia, id_farmacia} = createFarmaceuticoDto;
        const permisos = 'farmaceutico';
        const user = await this.authService.register({...userData, permisos: permisos});
        console.log({user});
        try {
            const farmacia = await this.farmaciaRepository.findOneBy({id_farmacia});
            if(!farmacia) throw new NotFoundException(`La farmacia a la cual se quizo asignar el farmaceutico no existe`)
            let farmaceutico = this.farmaceuticoRepository.create({
                cedula: user.cedula,
                licencia,
                farmacia: farmacia
            })
            //Al momento de hacer save, validara las llaves foraneas, en caso de 
            //inlfingir con esta saltara al catch y no se hara la creacion del
            //farmaceutico ni de su correpondiente usuario
            farmaceutico = await this.farmaceuticoRepository.save(farmaceutico);
            return {ok: true};
        } catch (error) {
            await this.authService.delete(userData.cedula);
            this.handlerErrors(error);
        }
        
    }
//Registrar un nuevo medicamento
    async createMedicamento(createMedicamentoDto: CreateMedicamentoDto){
        const data = createMedicamentoDto;
        const medicamentoExistente = await this.medicamentoRepositoy
            .createQueryBuilder('medicamento')
            .where('LOWER(TRIM(medicamento.nombre_med)) = LOWER(TRIM(:nombre))', { nombre: data.nombre_med })
            .andWhere('LOWER(TRIM(medicamento.concentracion)) = LOWER(TRIM(:concentracion))', { concentracion: data.concentracion })
            .andWhere('LOWER(TRIM(medicamento.presentacion)) = LOWER(TRIM(:presentacion))', { presentacion: data.presentacion })
            .getOne();
        if(medicamentoExistente) throw new BadRequestException(`Ya existe un medicamento con nombre : ${data.nombre_med}, concentracion: ${data.concentracion} y presentacion: ${data.presentacion}`)
        let medicamento = this.medicamentoRepositoy.create(data);
        try {
            medicamento = await this.medicamentoRepositoy.save(medicamento);
            return {ok: true};
        } catch (error) {
            this.handlerErrors(error);
        }
    }
    async consultarMedicamentos(term?: string) {
        try {
            // Si es UUID => búsqueda por ID
            if (term && isUUID(term)) {
            console.log(`es uuid`)
            const medicamento = await this.medicamentoRepositoy.findOneBy({ id_medicamento: term });

            if (!medicamento) {
                throw new NotFoundException("El medicamento no se encontró en la base de datos");
            }

            return [medicamento]; // Devuelve como array
            }

            // Si hay término => búsqueda por nombre
            if (term) {
            const nombreMed = `%${term.toLowerCase().trim()}%`;

            const medicamentos = await this.medicamentoRepositoy
                .createQueryBuilder('medicamento')
                .where('LOWER(TRIM(medicamento.nombre_med)) LIKE :nombreMed', { nombreMed })
                .getMany();

            if (medicamentos.length === 0) {
                throw new NotFoundException(`No se encontraron medicamentos con el nombre ${term}`);
            }
            console.log(medicamentos);
            return medicamentos;
            }

            // Si no hay término => devolver todos los medicamentos
            const todos = await this.medicamentoRepositoy.find();
            return todos;

        } catch (error) {
            this.logger.error('Error en consultarMedicamentos', error);
            throw new InternalServerErrorException("Ocurrió un error al consultar medicamentos");
        }
    }

//Registrar farmacias_medicamentos
    async regLoteStock(farmacia_medicamento: Farmacia_MedicamentoDto){
        const {id_farmacia,id_medicamento, cedula,...data} = farmacia_medicamento;
        const existeRegistro = await this.registroRepositoy.findOneBy({lote:data.lote})
        if(existeRegistro) throw new BadRequestException(`Este lote ya fue registrado`)
        const dataMedicamento = await this.medicamentoRepositoy.findOneBy({id_medicamento});
        const dataFarmacia = await this.farmaciaRepository.findOneBy({id_farmacia})
        if(!dataMedicamento || !dataFarmacia) throw new NotFoundException(`No se encontro la farmacia o el medicamento a registrar`)
        
        const validar = await this.farmaceuticoRepository
            .createQueryBuilder('farmaceutico')
            .where('farmaceutico.id_farmacia = :id_farmacia',{id_farmacia})
            .andWhere('farmaceutico.cedula = :cedula', {cedula})
            .getOne()
        if(validar) throw new BadRequestException (`Solo puede registrar lote y stock de la farmacia a la cual fue asignado`)

        let registro = this.registroRepositoy.create({
            farmacia: dataFarmacia,
            medicamento: dataMedicamento,
            ...data
        })
        try {
            registro = await this.registroRepositoy.save(registro)
            return {ok: true};
        } catch (error) {
            this.handlerErrors(error);
        }
        
    }

    handlerErrors(error: any) : never{
        this.logger.log(`Ha ocurrido un error: ${error.detail}`);
        throw new BadRequestException(error.message);
    }


    async adquiere(createCompraDto: CreateCompraDto){
        const {nombre_farmacia,id_medicamento,...dataCompra} = createCompraDto;
        const medicamento = await this.medicamentoRepositoy.findOneBy({id_medicamento})

        if(!medicamento) throw new BadRequestException(`Medicamento no encontrado`)
        
        const farmacia = await this.farmaciaRepository
            .createQueryBuilder('farma')
            .where('LOWER(TRIM(farma.nombre) = LOWER(TRIM(:nombre_farmacia)',{nombre_farmacia})
            .getOne()
        if(!farmacia) throw new BadRequestException(`Farmacia no encontrada`)

        const now = new Date();
        const hora = now.getHours().toString().padStart(2, '0') + now.getMinutes().toString().padStart(2, '0');
        const fecha = now.getFullYear().toString() + '-' +
              (now.getMonth() + 1).toString().padStart(2, '0') + '-' +
              now.getDate().toString().padStart(2, '0');
        const fechaDate = new Date(fecha);
        let compra = this.compraRepository.create({
            precio_total: (medicamento.precio*dataCompra.cantidad),
            hora: hora,
            id_farmacia: farmacia.id_farmacia,
            id_medicamento: medicamento.id_medicamento,
            fecha: fechaDate,
            farmacia: farmacia,
            medicamento: medicamento,
            ...dataCompra
        })
        console.log({compra})
        try {
            compra = await this.compraRepository.save(compra);
            return compra;
        } catch (error) {
            this.logger.log(error.detail)
            throw new InternalServerErrorException(`Ha ocurrido un error: ${error.message}`);
        }
    }

    async consultarFarmacia(nombre?: string){
        if(nombre){
            const nombreFarma = nombre.trim().toLowerCase()

            const farmacia = await this.farmaciaRepository
            .createQueryBuilder('farma')
            .where('LOWER(TRIM(farma.nombre)) = LOWER(TRIM(:nombre))', { nombre: nombreFarma.trim().toLowerCase() })
            .orWhere('LOWER(farma.nombre) LIKE :likeNombre', { likeNombre: `%${nombreFarma.trim().toLowerCase()}%` })
            .getOne();

            if(!farmacia) throw new BadRequestException(`La farmacia con el nombre ${nombre} no fue encontrada`)
            return [farmacia];
        }else{
            const farmacias = await this.farmaciaRepository.find()
            return farmacias;
        }
    }
}
