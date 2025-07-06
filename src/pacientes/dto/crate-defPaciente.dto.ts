import { ValidateNested } from "class-validator";
import { CreatePacienteDto } from "./create-paciente.dto";
import { Usuarios } from "src/auth/entities/usuarios.entity";
import { Type } from "class-transformer";
import { CreateUserDto } from "src/auth/dto/createUser.dto";

export class CreateDefPacienteDto{

    @ValidateNested()
    @Type(()=> CreatePacienteDto)
    pacienteDto: CreatePacienteDto;

    @ValidateNested()
    @Type(()=> CreateUserDto) 
    userDto: CreateUserDto;

}
