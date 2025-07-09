import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
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
        let farmacia = this.farmaciaRepository.create(data);
        try {
            await this.farmaciaRepository.save(farmacia);
            return `Se ha registrado la farmacia correctamente`;
        } catch (error) {
            this.logger.log(`Error al crear la farmacia: ${error.detail}`);
            throw new InternalServerErrorException(error.message);
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
            return `Se ha registrado el farmaceutico correctamente`;
        } catch (error) {
            await this.authService.delete(userData.cedula);
            this.handlerErrors(error);
        }
        
    }
//Registrar un nuevo medicamento
    async createMedicamento(createMedicamentoDto: CreateMedicamentoDto){
        const data = createMedicamentoDto;
        let medicamento = this.medicamentoRepositoy.create(data);
        try {
            medicamento = await this.medicamentoRepositoy.save(medicamento);
            return `Se ha registrado el medicamento correctamente`;
        } catch (error) {
            this.handlerErrors(error);
        }
    }
    async consultarMedicamentos(term: string){

        if(isUUID(term)){
            try {
                const medicamento = await this.medicamentoRepositoy.findOneBy({id_medicamento: term})
                return medicamento;
            } catch (error) {
                throw new BadRequestException(`El medicamento no se encontro en la base de datos`)
            }
        }else{
            try {
                const nombreMed = term.toLowerCase();
                const medicamentos = await this.medicamentoRepositoy.findBy({nombre_med: nombreMed})
                return {medicamentos};    
            } catch (error) {
                throw new BadRequestException(`El medicamento no se encontro en la base de datos`)
            }

        }
    }

//Registrar farmacias_medicamentos
    async regLoteStock(farmacia_medicamento: Farmacia_MedicamentoDto){
        const {id_farmacia,id_medicamento, ...data} = farmacia_medicamento;
        const dataMedicamento = await this.medicamentoRepositoy.findOneBy({id_medicamento});
        const dataFarmacia = await this.farmaciaRepository.findOneBy({id_farmacia})
        if(!dataMedicamento || !dataFarmacia) throw new NotFoundException(`No se encontro la farmacia o el medicamento a registrar`)
        let registro = this.registroRepositoy.create({
            farmacia: dataFarmacia,
            medicamento: dataMedicamento,
            ...data
        })
        try {
            registro = await this.registroRepositoy.save(registro)
            return `Se ha registrado el lote y el stock de manera correcta`;
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
        
        const farmacia = await this.farmaciaRepository.findOneBy({nombre:nombre_farmacia})
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
}
