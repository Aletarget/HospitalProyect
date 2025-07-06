import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryColumn } from "typeorm";
import { Farmacias } from "./farmacias.entity";

@Entity({schema:'farmacias'})
export class Farmaceuticos{


    @PrimaryColumn('text')
    cedula: string; 


    @Column('text',{
        unique: true
    })
    licencia: string;


    @ManyToOne(
        () => Farmacias,
        farmacia => farmacia.farmaceuticos,{
            onDelete: "CASCADE"
        }
    )
    @JoinColumn({name: 'id_farmacia'})
    id_farmacia: number;


}