import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';


import { DepcardiologiaService } from './dep-cardiologia.service';
import { Auth } from 'src/auth/decorators/auth-user.decorator';
import { permisosValidos } from 'src/auth/interfaces/jwt-payload/permisos-validos';
import { createAgendaDto, CreateCardiologoDto, CreateCitaDto, CreatePrescripcion_Medicamentos, UpdateHistorialDto } from './dto';

@Controller('dep-cardiologia')
export class DepcardiologiaController {
  constructor(private readonly depcardiologiaService: DepcardiologiaService) {}

    @Post('regCardio')
    @Auth(permisosValidos.admin, permisosValidos.superUser)
    createCardiologo(@Body() createCardiologoDto: CreateCardiologoDto){
      return this.depcardiologiaService.createCardiologo(createCardiologoDto)
    }


    @Post('crearAgenda')
    @Auth(permisosValidos.admin, permisosValidos.superUser)
    createAgenda(@Body() createAgendaDto: createAgendaDto){
      return this.depcardiologiaService.createAgenda(createAgendaDto);
    }

    @Post('crearCita')
    @Auth(permisosValidos.admin, permisosValidos.superUser)
    createCita(@Body() createCitaDto: CreateCitaDto){
      return this.depcardiologiaService.createCita(createCitaDto);
    }


    @Post('updHistorial')
    @Auth(permisosValidos.medico, permisosValidos.superUser)
    updateHistorial(@Body() updateHistorialDto:UpdateHistorialDto){
      return this.depcardiologiaService.actualizarHistorial(updateHistorialDto)
    }

    @Post('crearPrescripcion')
    @Auth(permisosValidos.medico, permisosValidos.superUser)
    createPrescripcion(@Body() createPrescripcionMedicamento: CreatePrescripcion_Medicamentos){
      return this.depcardiologiaService.createPrescripcionMedicamento(createPrescripcionMedicamento)
    }

    @Get('getPrescripciones/:cedula')
    @Auth(permisosValidos.user, permisosValidos.superUser)
    getPrescripciones(@Param('cedula') cedula: string){
      return this.depcardiologiaService.consultarPrescripciones(cedula)
    }

    // Ruta con parámetro opcional
    @Get('getAgendas/:term')
    @Auth(permisosValidos.admin, permisosValidos.medico, permisosValidos.superUser)
    getAgendasConTerm(@Param('term') term: string) {
      return this.depcardiologiaService.consultarAgenda(term);
    }

    // Ruta sin parámetro
    @Get('getAgendas')
    @Auth(permisosValidos.admin, permisosValidos.medico, permisosValidos.superUser)
    getAgendas() {
      return this.depcardiologiaService.consultarAgenda(); // sin argumentos
    }
}
