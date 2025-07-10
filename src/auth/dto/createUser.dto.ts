import { Type } from "class-transformer";
import { ArrayMaxSize, IsArray, IsBoolean, IsDate, IsEmail, IsIn, IsOptional, IsString, Length, MinLength } from "class-validator";

export class CreateUserDto {


    @IsString()
    @Length(8,15)
    cedula: string;

    @IsEmail()
    correo: string;


    @IsString()
    nombre: string;

    @IsString()
    @IsOptional()
    @IsIn(['admin','medico','gestor','super-user','user','farmaceutico'])
    permisos?: string;

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
    
    @IsDate()
    @Type(() => Date)
    fecha_expedicion: Date;

}
