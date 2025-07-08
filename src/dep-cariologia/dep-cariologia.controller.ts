import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';


import { DepCariologiaService } from './dep-cariologia.service';
import { Auth } from 'src/auth/decorators/auth-user.decorator';
import { permisosValidos } from 'src/auth/interfaces/jwt-payload/permisos-validos';
import { createAgendaDto, CreateCardiologoDto, CreateCitaDto, CreatePrescripcion_Medicamentos, UpdateHistorialDto } from './dto';

@Controller('dep-cardiologia')
export class DepCariologiaController {
  constructor(private readonly depCariologiaService: DepCariologiaService) {}

    @Post('regCardio')
    @Auth(permisosValidos.admin, permisosValidos.superUser)
    createCardiologo(@Body() createCardiologoDto: CreateCardiologoDto){
      return this.depCariologiaService.createCardiologo(createCardiologoDto)
    }


    @Post('crearAgenda')
    @Auth(permisosValidos.admin, permisosValidos.superUser)
    createAgenda(@Body() createAgendaDto: createAgendaDto){
      return this.depCariologiaService.createAgenda(createAgendaDto);
    }

    @Post('crearCita')
    @Auth(permisosValidos.admin, permisosValidos.superUser)
    createCita(@Body() createCitaDto: CreateCitaDto){
      return this.depCariologiaService.createCita(createCitaDto);
    }


    @Post('updHistorial')
    @Auth(permisosValidos.medico, permisosValidos.superUser)
    updateHistorial(@Body() updateHistorialDto:UpdateHistorialDto){
      return this.depCariologiaService.actualizarHistorial(updateHistorialDto)
    }

    @Post('crearPrescripcion')
    @Auth(permisosValidos.medico, permisosValidos.superUser)
    createPrescripcion(@Body() createPrescripcionMedicamento: CreatePrescripcion_Medicamentos){
      return this.depCariologiaService.createPrescripcionMedicamento(createPrescripcionMedicamento)
    }

    @Get('getPrescripciones/:cedula')
    @Auth(permisosValidos.user, permisosValidos.superUser)
    getPrescripciones(@Param('cedula') cedula: string){
      return this.depCariologiaService.consultarPrescripciones(cedula)
    }
}
