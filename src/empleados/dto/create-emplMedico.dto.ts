import { CreateUserDto } from "src/auth/dto/createUser.dto";
import { CreateEmpleadoDto } from "./create-empleado.dto";
import { CreateMedicoDto } from "./create-medico.dto";
import { ValidateNested } from "class-validator";
import { Type } from "class-transformer";

export class CreateEmpleadoMedicoDto{

    @ValidateNested()
    @Type(()=> CreateUserDto)
    userDto: CreateUserDto;


    @ValidateNested()
    @Type(()=> CreateEmpleadoDto) 
    empleadoDto: CreateEmpleadoDto;

    @ValidateNested()
    @Type(()=> CreateMedicoDto)
    medicoDto: CreateMedicoDto;
}