import { Entity, OneToMany, OneToOne, PrimaryColumn } from "typeorm";
import { Agendas } from "./agendas.entity";
import { Citas } from "./citas.entity";
import { Prescripciones } from "./prescripciones.entity";
import { Actualiza } from "./actualiza.entity";


@Entity({schema:'dep_cardiologia'})
export class Cardiologos {
    
    @PrimaryColumn('uuid')
    id_empleado: string;

    @OneToMany(
        () => Agendas,
        agenda => agenda.cardiologo,{
            cascade: true,
            eager: true
        }
    )
    agendas: Agendas[];


    @OneToMany(
        () => Citas,
        cita => cita.id_medico,{
            eager:true
        }
    )
    citas: Citas[]


    @OneToMany(
        () => Prescripciones,
        precripcion => precripcion.id_medico,{
            cascade: true,
            eager: true
        }
    )
    prescripcion: Prescripciones[];

    @OneToMany(
        () => Actualiza,
        actualiza => actualiza.id_medico,{
            cascade: true,
            eager: true
        }
    )
    actualiza: Actualiza[]
}
