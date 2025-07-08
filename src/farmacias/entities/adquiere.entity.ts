import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Medicamentos } from "./medicamentos.entity";
import { Farmacias } from "./farmacias.entity";

@Entity({schema: 'farmacias'})
export class Adquiere{
    
    @PrimaryGeneratedColumn('increment')
    id_compra: number;

    @Column('text')
    cedula: string;

    @ManyToOne(
        () => Medicamentos,
        medicamento => medicamento.adquiere,{
            onDelete: "CASCADE" 
        }
    )
    @JoinColumn({name:'id_medicamento'})
    id_medicamento: Medicamentos;

    @ManyToOne(
        () => Farmacias,
        farmacia => farmacia.adquiere,{
            onDelete: "CASCADE" 
        }
    )
    @JoinColumn({name:'id_farmacia'})
    id_farmacia: Farmacias;

    @Column('time')
    hora: string;

    @Column('date')
    fecha: string;

    @Column('decimal', {precision: 10, scale:2})
    precio_total: number;

    @Column('int')
    cantidad: number;

}