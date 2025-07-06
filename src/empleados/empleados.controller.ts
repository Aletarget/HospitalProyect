import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EmpleadosService } from './empleados.service';
import { CreateEmpleadoAdminDto, CreateEmpleadoMedicoDto } from './dto';
import { Auth } from 'src/auth/decorators/auth-user.decorator';
import { permisosValidos } from 'src/auth/interfaces/jwt-payload/permisos-validos';


@Controller('empleados')
export class EmpleadosController {
  constructor(private readonly empleadosService: EmpleadosService) {}


  @Post('regadmin')
  @Auth(permisosValidos.admin)
  createAdministrativo(
    @Body() createEmpleadoAdminDto: CreateEmpleadoAdminDto) {
    return this.empleadosService.createAdmin(createEmpleadoAdminDto);
  }

  @Post('regmedico')
  @Auth(permisosValidos.admin)
  createMedico(
    @Body() createEmpleadoMedicoDto: CreateEmpleadoMedicoDto) {
    return this.empleadosService.createMedico(createEmpleadoMedicoDto);
  }
}
