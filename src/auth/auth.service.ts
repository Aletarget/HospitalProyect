import {  BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';




import { Usuarios } from './entities/usuarios.entity';
import { CreateUserDto } from './dto/createUser.dto';
import { Telefonos } from './entities/telefonos.entity';
import { LoginUserDto } from './dto/loginUser.dto';
import { JwtPayload } from './interfaces/jwt-payload/jwt-payload.interface';
import { UpdatePasswordDto } from './dto/updatePassword.dto';

@Injectable()
export class AuthService {
  private logger = new Logger('AuthService');
  constructor(
    @InjectRepository(Usuarios, 'usuariosConnection')
    private readonly userRepository: Repository<Usuarios>,

    @InjectRepository(Telefonos, 'usuariosConnection')
    private readonly phoneRepository: Repository<Telefonos>,

    private readonly jwtService: JwtService
  ){}

  async register(createUserDto: CreateUserDto) {
    const logger = new Logger('CreateUser')
    const {password, telefonos=[], ...data} = createUserDto;
    //Validar si el usuario ya existe
    const userValid = await this.userRepository.findOneBy({cedula: data.cedula})
    if(userValid)
      throw new BadRequestException('Ya existe un usuario registrado con ese número de identificion o correo electronico');
    
    const user =  this.userRepository.create(
      {
        ...data,
        telefonos: telefonos.map(telefono => this.phoneRepository.create({telefono: telefono})),
        password: bcrypt.hashSync(password,10)
      }); 

    try {
      const resultado = await this.userRepository.save(user);
      return resultado;
    } catch (error) {
      logger.log(error);
      throw new BadRequestException(error.detail);
    }
  }


  async login( loginUserDto: LoginUserDto){
    const {correo, password} = loginUserDto;

    const user = await this.userRepository.findOne({
      select:{password:true, cedula:true, correo:true, permisos: true, estado:true},
      where: {correo}
    })

    if(!user)
      throw new BadRequestException(`Usuario no encontrado, intente de nuevo`)

    if(!bcrypt.compareSync(password, user.password))
      throw new BadRequestException('Constraseña invalida intente denuevo')
    return{
      token: this.getJwtToken({correo: user.correo, cedula: user.cedula, permisos: user.permisos, estado: user.estado})}
  }
 
  private getJwtToken(payload: JwtPayload){
    const token = this.jwtService.sign(payload);
    return token;
  }


  async delete(cedula: string){
    const user = await this.findOne(cedula)
    this.userRepository.remove(user);
  }


  async findOne(cedula: string): Promise<Usuarios>{
    const user = await this.userRepository.findOneBy({cedula})
    
    if(!user){
      throw new NotFoundException(`No se ha encontrado el usuario identificado con CC: ${cedula}`);
    }
    return user;
  }

  async changePassword(updatePasswordDto: UpdatePasswordDto) {
    const { cedula, fecha_expedicion, telefono, newPassword } = updatePasswordDto;

    try {
      const user = await this.userRepository
        .createQueryBuilder('usuario')
        .where('usuario.cedula = :cedula', { cedula })
        .andWhere('DATE(usuario.fecha_expedicion) = DATE(:fecha_expedicion)', { fecha_expedicion })
        .getOne();
      console.log(user)
      if (!user) {
        throw new BadRequestException('Usuario no encontrado. Verifique los datos ingresados.');
      }

      const telefonoFind = await this.phoneRepository
        .createQueryBuilder('tele')
        .where('tele.telefono = :telefono', { telefono })
        .andWhere('tele.cedula = :cedula', { cedula })
        .getOne();
      console.log(telefonoFind)
      if (!telefonoFind) {
        throw new BadRequestException('Teléfono no registrado o no coincide con el usuario.');
      }

      user.password = bcrypt.hashSync(newPassword, 10);
      console.log(user);
      await this.userRepository.save(user);
      return `Ok`
    } catch (error) {
      this.logger.error(error?.detail || error);
      throw new InternalServerErrorException('Ocurrió un error al cambiar la contraseña.');
    }
  }

}
