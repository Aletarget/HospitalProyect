import { IsNumber, IsPositive, IsString, IsUUID } from "class-validator";


export class CreateCompraDto{

    @IsString()
    cedula:string;

    @IsString()
    id_medicamento:string;

    @IsString()
    nombre_farmacia: string;

    @IsNumber()
    @IsPositive()
    cantidad: number;

}