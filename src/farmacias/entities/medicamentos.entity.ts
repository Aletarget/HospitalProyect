import { BeforeInsert, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm"
import { Farmacias_Medicamentos } from "./farm-med.entity";
import { Adquiere } from "./adquiere.entity";


@Entity({schema:'farmacias'})
export class Medicamentos {


    @PrimaryGeneratedColumn('uuid')
    id_medicamento: string;

    
    @Column('decimal', {precision: 10, scale:2})
    precio: number;


    @Column('text')
    presentacion: string;

    
    @Column('text')
    concentracion: string


    @Column('text')
    nombre_med: string




    @OneToMany(
        () => Farmacias_Medicamentos,
        farmacia_medicamento => farmacia_medicamento.medicamento,
            {
            cascade:true,
            eager: true
            }
    )
    farmacia_medicamento: Farmacias_Medicamentos[];

    @BeforeInsert()
    lowerInsertName(){
        this.nombre_med = this.nombre_med.toLowerCase();
    }


    @OneToMany(
        () => Adquiere,
        adquiere => adquiere.medicamento,
        {
            cascade: true,
            eager: true
        }
    )
    adquiere: Adquiere[]
}
