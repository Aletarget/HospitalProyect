import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { CreateFarmaciaDto } from './dto/create-farmacia.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Farmaceuticos, Farmacias, Farmacias_Medicamentos, Medicamentos } from './entities';
import { AuthService } from 'src/auth/auth.service';
import { CreateFarmaceuticoDto, CreateMedicamentoDto, Farmacia_MedicamentoDto } from './dto';

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
        const {userData, ...data} = createFarmaceuticoDto;
        const permisos = 'farmaceutico';
        const user = await this.authService.register({permisos: permisos, ...userData});
        console.log({user});
        try {
            let farmaceutico = this.farmaceuticoRepository.create({
                cedula: user.cedula,
                ...data
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
    async consultarMedicamentos(nombre: string){
        const nombreMed = nombre.toLowerCase();
        const medicamentos = await this.medicamentoRepositoy.findBy({nombre_med: nombreMed})
        return {medicamentos};
    }

//Registrar farmacias_medicamentos
    async regLoteStock(farmacia_medicamento: Farmacia_MedicamentoDto){
        const data = farmacia_medicamento;
        let registro = this.registroRepositoy.create(data)
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

}
