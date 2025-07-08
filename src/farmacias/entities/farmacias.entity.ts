import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm"
import { Farmacias_Medicamentos } from "./farm-med.entity";
import { Farmaceuticos } from "./farmaceuticos.entity";
import { Adquiere } from "./adquiere.entity";


@Entity({schema:'farmacias'})
export class Farmacias {


    @PrimaryGeneratedColumn('increment')
    id_farmacia: number;

    
    @Column('text',{
        unique:true
    })
    telefono: string;


    @Column('text')
    nombre: string;

    
    @Column('text')
    calle: string;


    @Column('text')
    carrera: string;



    @OneToMany(
        () => Farmacias_Medicamentos,
        farmacia_medicamento => farmacia_medicamento.farmacia,
            {
            cascade:true,
            eager: true
            }
    )
    farmacia_medicamento: Farmacias_Medicamentos[];


    @OneToMany(
        () => Farmaceuticos,
        farmaceuticos => farmaceuticos.farmacia,{
            cascade: true,
            eager:true
        }
    )
    farmaceuticos: Farmaceuticos[]

    @OneToMany(
            () => Adquiere,
            adquiere => adquiere.id_farmacia,
            {
                cascade: true,
                eager: true
            }
        )
    adquiere: Adquiere[]
}
