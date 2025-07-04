import {  BadRequestException, Injectable, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';




import { Usuarios } from './entities/usuarios.entity';
import { CreateUserDto } from './dto/createUser.dto';
import { Telefonos } from './entities/telefonos.entity';
import { LoginUserDto } from './dto/loginUser.dto';
import { JwtPayload } from './interfaces/jwt-payload/jwt-payload.interface';

@Injectable()
export class AuthService {

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
      select:{password:true, cedula:true, correo:true},
      where: {correo}
    })

    if(!user)
      throw new BadRequestException(`Usuario no encontrado, intente de nuevo`)

    if(!bcrypt.compareSync(password, user.password))
      throw new BadRequestException('Constraseña invalida intente denuevo')

    return{ 
      cedula: user.cedula,
      correo: user.correo,
      token: this.getJwtToken({correo: user.correo})}
  }
 
  private getJwtToken(payload: JwtPayload){
    const token = this.jwtService.sign(payload);
    return token;
  }

}
