import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm"
import { Farmacias } from "./farmacias.entity";
import { Medicamentos } from "./medicamentos.entity";


@Entity({schema:'farmacias'})
export class Farmacias_Medicamentos {


    @PrimaryColumn('integer')
    id_farmacia: number;

    @PrimaryColumn('uuid')
    id_medicamento: string;

    @PrimaryColumn('text')
    lote: string;

    
    @Column('int')
    stock: number;

    
    @ManyToOne(
        () => Farmacias,
        farmacia => farmacia.farmacia_medicamento,{
            onDelete: "CASCADE"
        }
    )
    @JoinColumn({name: 'id_farmacia'})
    farmacia: Farmacias;

    
    @ManyToOne(
        () => Medicamentos,
        medicamento => medicamento.farmacia_medicamento,{
            onDelete: "CASCADE"
        }
    )
    @JoinColumn({name:'id_medicamento'})
    medicamento: Medicamentos;




}
