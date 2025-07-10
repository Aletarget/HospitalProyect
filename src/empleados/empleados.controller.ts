import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EmpleadosService } from './empleados.service';
import { CreateEmpleadoAdminDto, CreateEmpleadoMedicoDto } from './dto';
import { Auth } from 'src/auth/decorators/auth-user.decorator';
import { permisosValidos } from 'src/auth/interfaces/jwt-payload/permisos-validos';


@Controller('empleados')
export class EmpleadosController {
  constructor(private readonly empleadosService: EmpleadosService) {}


  @Post('regadmin')
  @Auth(permisosValidos.admin, permisosValidos.superUser)
  createAdministrativo(
    @Body() createEmpleadoAdminDto: CreateEmpleadoAdminDto) {
    return this.empleadosService.createAdmin(createEmpleadoAdminDto);
  }

  @Post('regmedico')
  @Auth(permisosValidos.admin, permisosValidos.superUser)
  createMedico(
    @Body() createEmpleadoMedicoDto: CreateEmpleadoMedicoDto) {
    return this.empleadosService.createMedico(createEmpleadoMedicoDto);
  }

  @Get('getMedicos/:cedula')
  @Auth(permisosValidos.admin, permisosValidos.superUser)
  getMedicos(@Param('cedula') cedula: string){
    return this.empleadosService.consultarMedicos(cedula);
  }
  @Get('getMedicos/')
  @Auth(permisosValidos.admin, permisosValidos.superUser)
  getAllMedicos(){
    return this.empleadosService.consultarMedicos();
  }

  @Get('getId/:cedula')
  @Auth(permisosValidos.admin, permisosValidos.superUser, permisosValidos.medico)
  getIdEmpleado(@Param('cedula') cedula: string){
    return this.empleadosService.consultarId(cedula);
  }
}
