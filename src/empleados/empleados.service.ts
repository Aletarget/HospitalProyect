import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { CreateAdministrativoDto, CreateEmpleadoMedicoDto } from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Administrativos, Empleados, Medicos } from './entities';
import { AuthService } from 'src/auth/auth.service';
import { CreateEmpleadoAdminDto } from './dto/create-emplAdmin.dto';

@Injectable()
export class EmpleadosService {
  constructor(

    private readonly authService: AuthService,

    @InjectRepository(Empleados, 'usuariosConnection')
    private readonly empleadoRepository: Repository<Empleados>,
    
    @InjectRepository(Administrativos, 'usuariosConnection')
    private readonly adminRepository: Repository<Administrativos>,
    
    @InjectRepository(Medicos, 'usuariosConnection')
    private readonly medicoRepository: Repository<Medicos>,
  ){}


  async createAdmin(createEmpleado: CreateEmpleadoAdminDto) {
    const logger = new Logger('CreateAdmin')
    const {userDto, empleadoDto, adminDto} = createEmpleado;
    userDto.permisos = ['admin','user'];
    const user = await this.authService.register(userDto);
    try {
      
      let employe = this.empleadoRepository.create({
        ... empleadoDto,
        cedula: user.cedula
      });
      employe = await this.empleadoRepository.save(employe);
      
      let admin = this.adminRepository.create({
        ...adminDto,
        id_empleado: employe.id_empleado
      })
  
      admin = await this.adminRepository.save(admin);
      console.log(admin);
      
      return `Registro exitoso del nuevo empleado, su id es: ${admin.id_empleado}`; 

    } catch (error) {
      logger.log(error.detail);
      throw new InternalServerErrorException(error.message);
    }
  }

   async createMedico(createEmpleado: CreateEmpleadoMedicoDto) {
    const logger = new Logger('CreateMedico')
    const {userDto, empleadoDto, medicoDto} = createEmpleado;
    userDto.permisos = ['medico','user'];
    try {
      const user = await this.authService.register(userDto);
      
      let employe = this.empleadoRepository.create({
        ... empleadoDto,
        cedula: user.cedula
      });
      employe = await this.empleadoRepository.save(employe);
      
      let medico = this.medicoRepository.create({
        ...medicoDto,
        id_empleado: employe.id_empleado
      })
      
      medico = await this.medicoRepository.save(medico);
      console.log(medico);
      
      return `Registro exitoso del nuevo empleado, su id es: ${medico.id_empleado}`; 

    } catch (error) {
      logger.log(error);
      throw new InternalServerErrorException(error.message);
    }

  }

  findAll() {
    return `This action returns all empleados`;
  }

  findOne(id: number) {
    return `This action returns a #${id} empleado`;
  }


  remove(id: number) {
    return `This action removes a #${id} empleado`;
  }
}
