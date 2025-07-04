import { applyDecorators, UseGuards } from "@nestjs/common";
import { permisosValidos } from "../interfaces/jwt-payload/permisos-validos";
import { permisionProtected } from "./permision-protected.decorator";
import { AuthGuard } from "@nestjs/passport";
import { UserPermisosGuard } from "../guards/user-permisos.guard";


export function Auth(...roles: permisosValidos[]) {
  return applyDecorators(
    permisionProtected(...roles),
    UseGuards(AuthGuard('jwt'), UserPermisosGuard)
  );
}