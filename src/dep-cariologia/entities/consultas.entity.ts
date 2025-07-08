import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { Agendas } from "./agendas.entity";


@Entity({schema: 'dep_cardiologia'})
export class Consultas{

    @PrimaryColumn('uuid')
    id_empleado:string;


    @PrimaryColumn('uuid')
    @ManyToOne(
        () => Agendas,
        agenda => agenda.consultas,{
            onDelete: "CASCADE"
        }
    )
    @JoinColumn({name: 'id_agenda'})
    id_agenda:Agendas;



}