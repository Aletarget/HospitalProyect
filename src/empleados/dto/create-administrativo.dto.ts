import { IsString } from "class-validator";


export class CreateAdministrativoDto{

    @IsString()
    cargo_admin:string;
    
}