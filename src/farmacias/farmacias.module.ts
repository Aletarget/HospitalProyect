import { Module } from '@nestjs/common';
import { FarmaciasService } from './farmacias.service';
import { FarmaciasController } from './farmacias.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Farmacias_Medicamentos, Farmacias, Medicamentos, Farmaceuticos, Adquiere } from './entities';
import { AuthModule } from 'src/auth/auth.module';




@Module({
  controllers: [FarmaciasController],
  providers: [FarmaciasService],
  imports:[
    AuthModule,
    TypeOrmModule.forFeature([
      Farmacias,
      Medicamentos,
      Farmacias_Medicamentos,
      Farmaceuticos,
      Adquiere
    ], 'farmaciasConnection')
  ],
  exports: [
    FarmaciasService
  ]
})


export class FarmaciasModule {}
