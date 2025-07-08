import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { Prescripciones } from "./prescripciones.entity";


@Entity({schema: 'dep_cardiologia'})
export class Prescripciones_Medicamentos{

    @PrimaryColumn('uuid')
    id_prescripcion: string;


    @ManyToOne(
        () => Prescripciones,
        prescripcion => prescripcion.medicamentos,{
            onDelete: "CASCADE"
        }
    )
    @JoinColumn({name:'id_prescripcion'})
    prescripcion: Prescripciones;


//Se debe crear una restriccion donde debe de existir el medicamento para poder crear esta prescripcion 
    @PrimaryColumn('uuid')
    id_medicamento: string;


}