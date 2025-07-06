import { IsNumber, IsPositive, IsString } from "class-validator";


export class CreateMedicamentoDto{


    @IsNumber({ maxDecimalPlaces: 2 })
    @IsPositive()
    precio: number;

    @IsString()
    presentacion: string;

    @IsString()
    concentracion: string;

    @IsString()
    nombre_med: string

}