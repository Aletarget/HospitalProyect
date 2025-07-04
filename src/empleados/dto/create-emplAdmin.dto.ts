import { CreateUserDto } from "src/auth/dto/createUser.dto";
import { CreateEmpleadoDto } from "./create-empleado.dto";
import { CreateAdministrativoDto } from "./create-administrativo.dto";
import { ValidateNested } from "class-validator";
import { Type } from "class-transformer";

export class CreateEmpleadoAdminDto{

    @ValidateNested()
    @Type(()=> CreateUserDto)
    userDto: CreateUserDto;


    @ValidateNested()
    @Type(()=> CreateEmpleadoDto) 
    empleadoDto: CreateEmpleadoDto;

    @ValidateNested()
    @Type(()=> CreateAdministrativoDto)
    adminDto: CreateAdministrativoDto;


}