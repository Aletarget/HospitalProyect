import { forwardRef, Module } from '@nestjs/common';
import { PacientesService } from './pacientes.service';
import { PacientesController } from './pacientes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pacientes } from './entities/paciente.entity';
import { Historia_clinica } from './entities/hist-clinica.entity';
import { Registro } from './entities/registro.entity';
import { AuthModule } from 'src/auth/auth.module';
import { DepcardiologiaModule } from 'src/dep-cardiologia/dep-cardiologia.module';

@Module({
  controllers: [PacientesController],
  providers: [PacientesService],

  imports: [
    forwardRef(() =>DepcardiologiaModule),
    AuthModule,
    TypeOrmModule.forFeature([Pacientes, Historia_clinica, Registro], 'usuariosConnection'),
  ],
  exports: [PacientesService]

})
export class PacientesModule {}
