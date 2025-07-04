import { Type } from "class-transformer";
import { IsDate, IsNumber, IsPositive, IsString, IsTimeZone, Matches } from "class-validator";

export class CreateEmpleadoDto {

        @IsNumber({maxDecimalPlaces: 2})
        @IsPositive()
        salario: number;

        @IsDate()
        @Type(() => Date)
        fecha_ingreso: Date;
        
        @IsString()
        @Matches(/^([01]\d|2[0-3]):[0-5]\d$/, {
            message: 'hora_inicio debe estar en formato HH:mm',
        })
        hora_inicio: string;

        @IsString()
        @Matches(/^([01]\d|2[0-3]):[0-5]\d$/, {
            message: 'hora_fin debe estar en formato HH:mm',
        })
        hora_fin: string;
}
