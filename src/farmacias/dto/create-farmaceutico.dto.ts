import { Type } from "class-transformer";
import { IsDefined, IsPositive, IsString, MinLength, ValidateNested } from "class-validator";
import { CreateUserDto } from "src/auth/dto/createUser.dto";


export class CreateFarmaceuticoDto{

    @Type(()=>CreateUserDto)
    @ValidateNested()
    @IsDefined()
    userData: CreateUserDto;

    @IsString()
    @MinLength(5)
    licencia:string;


    @IsPositive()
    id_farmacia: number;


}