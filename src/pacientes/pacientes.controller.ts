import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PacientesService } from './pacientes.service';
import { CreateDefPacienteDto } from './dto/crate-defPaciente.dto';
import { Auth } from 'src/auth/decorators/auth-user.decorator';
import { permisosValidos } from 'src/auth/interfaces/jwt-payload/permisos-validos';
import { CreateRegistroDto } from './entities';

@Controller('pacientes')
export class PacientesController {
  constructor(
    private readonly pacientesService: PacientesService,
  ) {}

  @Post('regPaciente')
  @Auth(permisosValidos.admin, permisosValidos.superUser)
  create(@Body() createPacienteDto: CreateDefPacienteDto) {
    return this.pacientesService.createPacienteHistorial(createPacienteDto);
  }

  @Get('histClinic/:cedula')
  @Auth(permisosValidos.admin, permisosValidos.medico, permisosValidos.user, permisosValidos.superUser)
  getHistClinic(@Param('cedula') cedula: string) {
    return this.pacientesService.consultarHistorial(cedula);
  } 

  
  @Post('crearReg')
  @Auth(permisosValidos.medico, permisosValidos.superUser)
  crearRegistro(@Body() createRegistroDto: CreateRegistroDto) {
    return this.pacientesService.crearRegistro(createRegistroDto);
  }

    @Get('getCitas/:cedula')
  @Auth(permisosValidos.admin, permisosValidos.medico, permisosValidos.user, permisosValidos.superUser)
  getCitas(@Param('cedula') cedula: string) {
    return this.pacientesService.getCitas(cedula);
  } 
}
