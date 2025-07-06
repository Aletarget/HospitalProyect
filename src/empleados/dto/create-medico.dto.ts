import { IsIn, IsString } from "class-validator";

export class CreateMedicoDto{


    @IsString()
    @IsIn(['cardiologia', 'neurologia'])
    departamento: string;

    @IsString()
    registro_medico: string;

}