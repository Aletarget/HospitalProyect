import { SetMetadata } from "@nestjs/common";
import { permisosValidos } from "../interfaces/jwt-payload/permisos-validos";


export const META_PERMISOS = 'permisos';
export const permisionProtected = (...args: permisosValidos[]) =>{
    return SetMetadata(META_PERMISOS, args);
}