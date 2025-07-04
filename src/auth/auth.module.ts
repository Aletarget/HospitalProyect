import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';


import { JwtStrategy } from './strategies/jwt-strategy';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';


import { Usuarios } from './entities/usuarios.entity';
import { Telefonos } from './entities/telefonos.entity';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([Usuarios, Telefonos], 'usuariosConnection'),

    PassportModule.register({
      defaultStrategy: 'jwt'
    }),

    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.get('JWT_SECRET'),
          signOptions:{
            expiresIn: '30m'
          }
        }
      }
    }),


  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [
    TypeOrmModule,
    AuthService,
    JwtModule,
    JwtStrategy,
    PassportModule
  ]
})
export class AuthModule {}
