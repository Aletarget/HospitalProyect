import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmpleadosModule } from './empleados/empleados.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { PacientesModule } from './pacientes/pacientes.module';
import { FarmaciasModule } from './farmacias/farmacias.module';
import { DepCariologiaModule } from './dep-cariologia/dep-cariologia.module';

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
        host: process.env.DB_HOST,
        port: +process.env.DB_PORT!,
        database: process.env.DB_NAMEUSUARIOS,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        autoLoadEntities: true,
        synchronize: true,
      }
    ),

    //FARMACIAS
    TypeOrmModule.forRoot(
      {
        name: 'farmaciasConnection',
        type: 'postgres',
        host: process.env.DB_HOST,
        port: +process.env.DB_PORT!,
        database: process.env.DB_NAMEFARMACIAS,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        autoLoadEntities: true,
        synchronize: true,
      }
    ),

    //DEPARTAMENTO_CARDIOLOGIA
     TypeOrmModule.forRoot(
      {
        name: 'cardiologiConnection',
        type: 'postgres',
        host: process.env.DB_HOST,
        port: +process.env.DB_PORT!,
        database: process.env.DB_NAMEDEPCARDI,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        autoLoadEntities: true,
        synchronize: true,
      }
    ),
    
    AuthModule,

    EmpleadosModule,

    PacientesModule,

    FarmaciasModule,

    DepCariologiaModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
