import { IsString } from "class-validator";


export class CreatePrescripcion_Medicamentos{

    @IsString()
    instrucciones: string;


    @IsString()
    dosis: string;


    @IsString()
    id_cita: string;


    @IsString()
    id_medicamento: string



}