import { IsEmail, IsString, Min, MinLength } from "class-validator";

export class LoginUserDto{

    @IsEmail()
    correo: string;


    @IsString()
    @MinLength(6)
    password: string;
    
}