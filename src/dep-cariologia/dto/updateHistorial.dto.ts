import { IsString } from "class-validator";



export class UpdateHistorialDto{

    @IsString()
    descripcion:string;

    @IsString()
    id_cita:string;
}   