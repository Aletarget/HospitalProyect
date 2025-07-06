import { BadRequestException, CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { META_PERMISOS } from '../decorators/permision-protected.decorator';
import { Usuarios } from '../entities/usuarios.entity';

@Injectable()
export class UserPermisosGuard implements CanActivate {

  constructor(
    private readonly reflector: Reflector
  ){}
  
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {

    const permisosValidos: String[] = this.reflector.get(META_PERMISOS, context.getHandler())

    const request = context.switchToHttp().getRequest();
    const user = request.user as Usuarios;

    if (!user)
      throw new BadRequestException('Usuario no encontrado')
    console.log({userPermision: user.permisos})
    if(permisosValidos.includes(user.permisos)){
      return true;
    }
    throw new ForbiddenException(`El usuario identificado con CC: ${user.cedula}, no tiene los permisos para realizar la operacion`);
  }
}
