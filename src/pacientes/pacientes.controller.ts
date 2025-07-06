import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PacientesService } from './pacientes.service';
import { CreateDefPacienteDto } from './dto/crate-defPaciente.dto';
import { Auth } from 'src/auth/decorators/auth-user.decorator';
import { permisosValidos } from 'src/auth/interfaces/jwt-payload/permisos-validos';
import { CreateRegistroDto } from './entities';

@Controller('pacientes')
export class PacientesController {
  constructor(private readonly pacientesService: PacientesService) {}

  @Post('regPaciente')
  @Auth(permisosValidos.admin)
  create(@Body() createPacienteDto: CreateDefPacienteDto) {
    return this.pacientesService.createPacienteHistorial(createPacienteDto);
  }

  @Get('histClinic/:cedula')
  @Auth(permisosValidos.admin, permisosValidos.medico, permisosValidos.user)
  getHistClinic(@Param('cedula') cedula: string) {
    return this.pacientesService.consultarHistorial(cedula);
  } 

  
  @Post('crearReg')
  @Auth(permisosValidos.medico)
  crearRegistro(@Body() createRegistroDto: CreateRegistroDto) {
    return this.pacientesService.crearRegistro(createRegistroDto);
  }
}
