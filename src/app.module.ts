import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmpleadosModule } from './empleados/empleados.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    
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
    
    AuthModule,

    EmpleadosModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
