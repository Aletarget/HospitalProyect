import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateEmpleadoMedicoDto } from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Administrativos, Empleados, Medicos } from './entities';
import { AuthService } from 'src/auth/auth.service';
import { CreateEmpleadoAdminDto } from './dto/create-emplAdmin.dto';
import { Usuarios } from 'src/auth/entities/usuarios.entity';

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
    userDto.permisos = 'admin';
    const user = await this.authService.register(userDto);

    try {
      
      let employe = this.empleadoRepository.create({
        ... empleadoDto,
        usuario: user
      });
      employe = await this.empleadoRepository.save(employe);
      
      let admin = this.adminRepository.create({
        ...adminDto,
        id_empleado: employe.id_empleado
      })
  
      admin = await this.adminRepository.save(admin);
      console.log(admin);
      
      return admin; 

    } catch (error) {
      
      logger.log(error.detail);
      throw new InternalServerErrorException(error.message);
    }
  }

   async createMedico(createEmpleado: CreateEmpleadoMedicoDto) {
    const logger = new Logger('CreateMedico')
    const {userDto, empleadoDto, medicoDto} = createEmpleado;
    userDto.permisos = 'medico';
    const user = await this.authService.register(userDto);

    try {
      
      let employe = this.empleadoRepository.create({
        ... empleadoDto,
        usuario: user,
        fecha_ingreso: new Date().toISOString().split('T')[0],
      });
      employe = await this.empleadoRepository.save(employe);
      
      let medico = this.medicoRepository.create({
        ...medicoDto,
        empleado: employe
      })
      
      medico = await this.medicoRepository.save(medico);
      console.log(medico);
      
      return {medico}

    } catch (error) {
      logger.log(error.detail);
      throw new InternalServerErrorException(error.message);
    }

  }

  async getInfoMedico(id_empleado: string){

    const data = await this.empleadoRepository.findOneBy({id_empleado})
    if(!data) throw new NotFoundException(`El medico con id: ${id_empleado} no se encontro`)

   const empleado = await this.empleadoRepository
    .createQueryBuilder('empl')
    .leftJoinAndSelect('empl.usuario', 'usuario')
    .where('empl.id_empleado = :id_empleado', { id_empleado }) // o usa .where('empl.cedula = :cedula', { cedula }) si prefieres
    .getOne();
    return empleado;
  }

  async getInfoAdmin(cedula: string){
    //No es necesario poner un trycatch porque la cedula que se le pasa al argumento
    //es la misma que la del admnistrador que se encuentra con la sesion activa.
    const data = await this.empleadoRepository.findOneBy({cedula})
    if(!data) throw new BadRequestException(`No se encontro informacion del empleado admnistrativo identificado con CC: ${cedula}`)
    return data?.id_empleado;
  }

  async consultarMedicos(cedula?: string) {
    if (cedula) {
      const medico = await this.medicoRepository
        .createQueryBuilder('medico')
        .leftJoin('medico.empleado', 'empleado')
        .leftJoin('empleado.usuario', 'usuario')
        .select([
          'usuario.nombre AS nombre',
          'usuario.cedula AS cedula',
          'empleado.id_empleado AS id_empleado',
          'medico.departamento AS departamento'
        ])
        .where('usuario.cedula = :cedula', { cedula })
        .getRawOne();

      if (!medico) {
        throw new NotFoundException(`No se encontró un médico con cédula ${cedula}`);
      }
      console.log(medico)
      return [medico];
    } else {
      const medicos = await this.medicoRepository
        .createQueryBuilder('medico')
        .leftJoin('medico.empleado', 'empleado')
        .leftJoin('empleado.usuario', 'usuario')
        .select([
          'usuario.nombre AS nombre',
          'usuario.cedula AS cedula',
          'empleado.id_empleado AS id_empleado',
          'medico.departamento AS departamento'
        ])
        .getRawMany();
      console.log(medicos)
      return medicos;
    }
  }

  async getMedico(cedula:string){
    const medico = await this.empleadoRepository
      .createQueryBuilder('empleado')
      .leftJoinAndSelect('empleado.medico', 'medico')
      .where('empleado.cedula = :cedula', {cedula})
      .getRawOne()
      return medico;
  }

  async consultarId(cedula: string){
    const id_empleado = await this.empleadoRepository
        .createQueryBuilder('empl')
        .where('empl.cedula = :cedula', {cedula})
        .select('empl.id_empleado')
        .getOne()
    return id_empleado;
  }
}
