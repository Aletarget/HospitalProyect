import { IsDate, IsNumber, IsPositive, IsString } from "class-validator";



export class CreateCitaDto{

    @IsString()
    departamento: string;

    @IsString()
    edificio: string;

    @IsString()
    cod_consultorio:string;

    @IsNumber()
    @IsPositive()
    id_agenda: number;

    @IsString()
    id_paciente: string;

    @IsString()
    cedula_admin: string;
}