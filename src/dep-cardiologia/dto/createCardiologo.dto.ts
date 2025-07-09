import { Type } from "class-transformer";
import { ValidateNested } from "class-validator";
import { CreateEmpleadoMedicoDto } from "src/empleados/dto";



export class CreateCardiologoDto {
    @ValidateNested()
    @Type(
        () => CreateEmpleadoMedicoDto
    )
    createEmpleadoMedicoDto: CreateEmpleadoMedicoDto;
}
