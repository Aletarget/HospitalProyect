import { Module } from '@nestjs/common';
import { DepcardiologiaService } from './dep-cardiologia.service';
import { DepcardiologiaController } from './dep-cardiologia.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Agendas, Cardiologos, Citas, Consultas, Prescripciones } from './entities';
import { Prescripciones_Medicamentos } from './entities/pres-medic.entity';
import { Actualiza } from './entities/actualiza.entity';
import { AuthModule } from 'src/auth/auth.module';
import { EmpleadosModule } from 'src/empleados/empleados.module';
import { PacientesModule } from 'src/pacientes/pacientes.module';
import { FarmaciasModule } from 'src/farmacias/farmacias.module';

@Module({
  controllers: [DepcardiologiaController],
  providers: [DepcardiologiaService],
  imports: [
    AuthModule,
    EmpleadosModule,
    PacientesModule,
    FarmaciasModule,
    TypeOrmModule.forFeature(
      [ Agendas, 
        Cardiologos, 
        Consultas, Citas, 
        Prescripciones,
        Prescripciones_Medicamentos,
        Actualiza
      ], 
      'cardiologiConnection')

  ]
})
export class DepcardiologiaModule {}
 