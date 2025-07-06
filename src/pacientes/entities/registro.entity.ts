import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Historia_clinica } from "./hist-clinica.entity";

@Entity({schema: 'pacientes'})
export class Registro{

    @PrimaryGeneratedColumn('uuid')
    id_registro: string;


    @ManyToOne(
        () => Historia_clinica,
        hist_clinica => hist_clinica.registro,
        {
            onDelete: "CASCADE",
            eager: true
        }
    )
    @JoinColumn({name: 'id_historial'})
    id_historial: Historia_clinica;


    @Column('date')
    fecha: string;
    
    @Column('text')
    descripcion: string


}