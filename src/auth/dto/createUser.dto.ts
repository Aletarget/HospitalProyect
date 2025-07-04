import { ArrayMaxSize, IsArray, IsBoolean, IsEmail, IsOptional, IsString, Length, Max, MaxLength, MinLength } from "class-validator";
import { Telefonos } from "../entities/telefonos.entity";

export class CreateUserDto {


    @IsString()
    @Length(8,15)
    cedula: string;

    @IsEmail()
    correo: string;


    @IsString()
    nombre: string;

    @IsArray()
    @IsString({each:true})
    @IsOptional()
    permisos?: string[]

    @IsString()
    calle: string;

    @IsString()
    carrera: string;

    @IsBoolean()
    @IsOptional()
    estado?: boolean;

    @IsString()
    @MinLength(6)
    password: string;

    @IsArray()
    @IsString({each:true})
    @ArrayMaxSize(2)
    telefonos: string[];
    

}
