import { Type } from "class-transformer";
import { IsDate, IsString, IsUUID, Matches } from "class-validator";




export class createAgendaDto{

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

    @IsDate()
    @Type(
        () => Date
    )
    fecha: Date;

    @IsString()
    @IsUUID()
    id_empleado: string
}