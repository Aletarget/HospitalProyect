import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, SetMetadata, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/createUser.dto';
import { LoginUserDto } from './dto/loginUser.dto';
import { permisosValidos } from './interfaces/jwt-payload/permisos-validos';
import { Auth } from './decorators/auth-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign')
  @Auth(permisosValidos.admin, permisosValidos.superUser)
  register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @Post('login')
  login(@Body() loginUserDto: LoginUserDto){
    return this.authService.login(loginUserDto);
  }

  @Delete(':cedula')
  @Auth(permisosValidos.superUser, permisosValidos.admin)
  deleteUser(@Param('cedula') cedula: string){
    return this.authService.delete(cedula)
  }

  @Get()
  @Auth(permisosValidos.admin, permisosValidos.medico, permisosValidos.farmaceutico ,permisosValidos.user, permisosValidos.superUser)
  getUser(@Request() req){
    console.log(req.user)
    return {permisos: req.user.permisos, cedula: req.user.cedula, id: req.user.id_empleado};
  }

}
