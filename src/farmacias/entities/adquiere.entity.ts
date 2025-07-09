import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Medicamentos } from "./medicamentos.entity";
import { Farmacias } from "./farmacias.entity";

@Entity({schema: 'farmacias'})
export class Adquiere{
    
    @PrimaryGeneratedColumn('increment')
    id_compra: number;

    @Column('text')
    cedula: string;

    @Column('uuid')
    id_medicamento: string

    @ManyToOne(
        () => Medicamentos,
        medicamento => medicamento.adquiere,{
            onDelete: "CASCADE" 
        }
    )
    @JoinColumn({name:'id_medicamento'})
    medicamento: Medicamentos;

    @Column('integer')
    id_farmacia: number;

    @ManyToOne(
        () => Farmacias,
        farmacia => farmacia.adquiere,{
            onDelete: "CASCADE" 
        }
    )
    @JoinColumn({name:'id_farmacia'})
    farmacia: Farmacias;

    @Column('time')
    hora: string;

    @Column('date')
    fecha: Date;

    @Column('decimal', {precision: 10, scale:2})
    precio_total: number;

    @Column('int')
    cantidad: number;

}