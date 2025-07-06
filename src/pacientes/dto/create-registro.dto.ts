import { IsDate, IsString } from "class-validator";


export class CreateRegistroDto{

    @IsString()
    descripcion: string;

    @IsString()
    cedula: string;
}