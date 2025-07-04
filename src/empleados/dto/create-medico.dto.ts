import { IsString } from "class-validator";

export class CreateMedicoDto{


    @IsString()
    especialidad: string;

    @IsString()
    registro_medico: string;

}