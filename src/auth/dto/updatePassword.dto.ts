import { Type } from "class-transformer";
import { IsDate, IsString } from "class-validator";



export class UpdatePasswordDto{


    @IsDate()
    @Type(
        () => Date
    )
    fecha_expedicion: Date;

    @IsString()
    cedula: string;

    @IsString()
    telefono: string;

    @IsString()
    newPassword: string;

}