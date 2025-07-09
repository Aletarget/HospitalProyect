import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmpleadosModule } from './empleados/empleados.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { PacientesModule } from './pacientes/pacientes.module';
import { FarmaciasModule } from './farmacias/farmacias.module';
import { DepcardiologiaModule } from './dep-cardiologia/dep-cardiologia.module';

@Module({
  imports: [
    ConfigModule.forRoot(),


    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public')
    }),


    //USUARIOS
    TypeOrmModule.forRoot(
      {
        name: 'usuariosConnection',
        type: 'postgres',
        host: process.env.DB_HOSTUSUARIOS,
        port: +process.env.DB_PORTUSUARIOS!,
        database: process.env.DB_NAMEUSUARIOS,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORDUSUARIOS,
        autoLoadEntities: true,
        synchronize: true,
        ssl: { rejectUnauthorized: false }
      }
    ),

    //FARMACIAS
    TypeOrmModule.forRoot(
      {
        name: 'farmaciasConnection',
        type: 'postgres',
        host: process.env.DB_HOSTFARMACIAS,
        port: +process.env.DB_PORTFARMACIAS!,
        database: process.env.DB_NAMEFARMACIAS,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORDFARMACIAS,
        autoLoadEntities: true,
        synchronize: true
      }
    ),

    //DEPARTAMENTO_CARDIOLOGIA
     TypeOrmModule.forRoot(
      {
        name: 'cardiologiConnection',
        type: 'postgres',
        host: process.env.DB_HOSTDEPTOCARDIO,
        port: +process.env.DB_PORTDEPTOCARDIO!,
        database: process.env.DB_NAMEDEPCARDI,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORDDEPTOCARDIO,
        autoLoadEntities: true,
        synchronize: true,
      }
    ),
    
    AuthModule,

    EmpleadosModule,

    PacientesModule,

    FarmaciasModule,

    DepcardiologiaModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
