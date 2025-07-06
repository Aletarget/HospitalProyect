import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AuthService } from 'src/auth/auth.service';

import { Pacientes } from './entities/paciente.entity';
import { Registro } from './entities/registro.entity';
import { Historia_clinica } from './entities/hist-clinica.entity';

import { CreateDefPacienteDto } from './dto/crate-defPaciente.dto';
import { CreateRegistroDto } from './entities';
import { resourceUsage } from 'process';
// import { CreateRegistroDto } from './entities';


@Injectable()
export class PacientesService {

  private logger = new Logger('PacientesService');

  constructor(
    @InjectRepository(Pacientes, 'usuariosConnection')
    private readonly pacientesRepository: Repository<Pacientes>,

    @InjectRepository(Historia_clinica, 'usuariosConnection')
    private readonly historiaReposority: Repository<Historia_clinica>,

    @InjectRepository(Registro, 'usuariosConnection')
    private readonly registrosRepository: Repository<Registro>,

    private readonly authService: AuthService,
  ){}


  async createPacienteHistorial(createPacienteDto: CreateDefPacienteDto) {
    const logger = new Logger('Create Paciente');
    const {userDto, pacienteDto} = createPacienteDto

    const user = await this.authService.register(userDto);

    const fecha = new Intl.DateTimeFormat('sv-SE').format(new Date());
    try {
      
      let paciente = this.pacientesRepository.create({
        ... pacienteDto,
        cedula: user.cedula
      })
      paciente = await this.pacientesRepository.save(paciente)
      
      let hist_clinica = this.historiaReposority.create({
        fecha_inicio: fecha,
        paciente: paciente.cedula
      })
      hist_clinica = await this.historiaReposority.save(hist_clinica);

      return {userDto, pacienteDto, hist_clinica}

    } catch (error) {
      logger.log(error.detail)
      await this.authService.delete(userDto.cedula);
      throw new InternalServerErrorException(`Ha ocurrido un error al intentar crear el paciente (check logs, code error: ${error.code})`)      
    }

  }

  async consultarHistorial(cedula: string){
    const user = await this.authService.findOne(cedula);

    const historialData = await this.historiaReposority
      .createQueryBuilder('hist')
      .leftJoinAndSelect('hist.paciente', 'paciente')
      .leftJoinAndSelect('hist.registro', 'registro')
      .where('hist.cedula = :cedula', { cedula })
      .getOne();

    if (!historialData) return null;

    // Renombrar la propiedad "cedula" como "paciente"
    return historialData;
  
  }

// CREAR UN NUEVO REGISTRO
  async crearRegistro(createRegistroDto: CreateRegistroDto){
    const {cedula, ...registroData} = createRegistroDto;
    const paciente = await this.pacientesRepository.findOneBy({cedula})
    if(!paciente) throw new NotFoundException(`El paciente con cedula: ${cedula} no fue encontrado`)
    //Consultar el id_historial del paciente
    try {
      const pacienteHistorial = await this.historiaReposority
        .createQueryBuilder('historial')
        .leftJoinAndSelect('historial.paciente','paciente')
        .where('historial.cedula = :cedula', {cedula})
        .getOne();
      console.log(pacienteHistorial);
      const fecha = new Intl.DateTimeFormat('sv-SE').format(new Date());
      let registro = this.registrosRepository.create({
        id_historial:{id_historial: pacienteHistorial!.id_historial},
        fecha: fecha,
        ...registroData
      })
      
      registro = await this.registrosRepository.save(registro);


      return `Se ha actualizado la historia clinica del paciente identificado con CC:${cedula}, 
              número de registro generado: ${registro.id_registro} `
      
    } catch (error) {
      this.logger.log(error.detail)
      throw new InternalServerErrorException(`Ha ocurrido un error: ${error.message}`)
    }
  }
}
