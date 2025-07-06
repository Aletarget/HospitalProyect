import { IsString, Matches } from "class-validator";

export class CreateFarmaciaDto {

    @IsString()
    @Matches(/^\d+$/, {
    message: 'El valor debe contener solo números.',
    })
    telefono: string

    @IsString()
    nombre: string;

    @IsString()
    calle: string;

    @IsString()
    carrera: string;


}
