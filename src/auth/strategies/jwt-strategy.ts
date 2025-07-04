import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Repository } from "typeorm";
import { Usuarios } from "../entities/usuarios.entity";
import { JwtPayload } from "../interfaces/jwt-payload/jwt-payload.interface";



@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(Usuarios, 'usuariosConnection')
    private readonly userRepository: Repository<Usuarios>,

    configService: ConfigService
) {
      super({
        secretOrKey: configService.get('JWT_SECRET')!,
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      });
  }
  
  // Metodo abstracto que implementa la estrategia que se decea manejar, en este caso
  // se quiere validar que el usaurio exista y que su estado sea activo
  async validate(payload: JwtPayload): Promise<Usuarios> {
    const { correo } = payload;

    const user = await this.userRepository.findOneBy({ correo });

    if (!user)
      throw new UnauthorizedException('Token not valid');

    if (!user.estado)
      throw new UnauthorizedException('User is inactive');

    return user;
  }

}