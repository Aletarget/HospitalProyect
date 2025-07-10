import { IsPositive, isString, IsString, IsUUID } from "class-validator";



export class Farmacia_MedicamentoDto{

    @IsPositive()
    id_farmacia: number;

    @IsUUID()
    id_medicamento: string;

    @IsString()
    lote:string;

    @IsPositive()
    stock: number;

    @IsString()
    cedula: string;
}