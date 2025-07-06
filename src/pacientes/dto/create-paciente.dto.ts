import { Type } from "class-transformer";
import { IsDate } from "class-validator";

export class CreatePacienteDto {


    @IsDate()
    @Type(() => Date)
    fecha_nac: Date;


}
