import { Module } from '@nestjs/common';
import { EmpleadosService } from './empleados.service';
import { EmpleadosController } from './empleados.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Empleados, Administrativos, Medicos } from './entities';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [EmpleadosController],
  providers: [EmpleadosService],
  imports: [
    TypeOrmModule.forFeature([Empleados, Administrativos, Medicos], 'usuariosConnection'),
    AuthModule
  ],
  exports: [
    EmpleadosService
  ]
})
export class EmpleadosModule {}
