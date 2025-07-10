import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { FarmaciasService } from './farmacias.service';
import { Auth } from 'src/auth/decorators/auth-user.decorator';
import { permisosValidos } from 'src/auth/interfaces/jwt-payload/permisos-validos';
import { CreateFarmaceuticoDto, CreateFarmaciaDto, CreateMedicamentoDto, Farmacia_MedicamentoDto,  } from './dto';
import { CreateCompraDto } from './dto/create-compra.dto';

@Controller('farmacias')
export class FarmaciasController {
  constructor(private readonly farmaciasService: FarmaciasService) {}

  @Post('regFarmaceutico')
  @Auth(permisosValidos.superUser)
  createFarmaceutico(@Body() createFarmaceuticoDto: CreateFarmaceuticoDto) {
    return this.farmaciasService.createFarmaceutico(createFarmaceuticoDto); 
  }

  @Post('regFarmacia')
  @Auth(permisosValidos.superUser)
  regFarmacia(@Body() createFarmaciaDto: CreateFarmaciaDto) {
    return this.farmaciasService.createFarmacia(createFarmaciaDto);
  }

  @Post('regMedicamento')
  @Auth(permisosValidos.superUser)
  regMedicamento(@Body() createMedicamentoDto: CreateMedicamentoDto) {
    return this.farmaciasService.createMedicamento(createMedicamentoDto);
  }


  @Post('regLoteStock')
  @Auth(permisosValidos.superUser, permisosValidos.farmaceutico)
  regLoteStock(@Body() farmacia_medicamentoDto: Farmacia_MedicamentoDto) {
    return this.farmaciasService.regLoteStock(farmacia_medicamentoDto);
  }

  @Get('medicamento/:nombre')
  @Auth(permisosValidos.medico, permisosValidos.farmaceutico, permisosValidos.superUser)
  consultarMedicamentos(@Param('nombre') nombre: string){
    return this.farmaciasService.consultarMedicamentos(nombre);
  }
  @Get('medicamento')
  @Auth(permisosValidos.medico, permisosValidos.farmaceutico, permisosValidos.superUser)
  consultarMedicamentosNoName(){
    return this.farmaciasService.consultarMedicamentos();
  }


  @Post('compraMedicamento')
  @Auth(permisosValidos.user)
  compraMedicamento(@Body() createCompraDto: CreateCompraDto){
    return this.farmaciasService.adquiere(createCompraDto);
  }

  @Get('consultarFarmacia/:nombre')
  @Auth(permisosValidos.user, permisosValidos.admin, permisosValidos.superUser)
  consultarFarmacias(@Param('nombre') nombre?: string){
    return this.farmaciasService.consultarFarmacia(nombre);
  }
  @Get('consultarFarmacia')
  @Auth(permisosValidos.user, permisosValidos.admin, permisosValidos.superUser)
  consultarFarmaciasNoNameID(){
    return this.farmaciasService.consultarFarmacia();
  }
}
