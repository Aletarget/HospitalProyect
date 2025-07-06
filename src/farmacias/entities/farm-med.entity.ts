import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm"
import { Farmacias } from "./farmacias.entity";
import { Medicamentos } from "./medicamentos.entity";


@Entity({schema:'farmacias'})
export class Farmacias_Medicamentos {


    @PrimaryColumn('integer')
    @ManyToOne(
        () => Farmacias,
        farmacia => farmacia.farmacia_medicamento,{
            onDelete: "CASCADE"
        }
    )
    @JoinColumn({name: 'id_farmacia'})
    id_farmacia: number;

    
    @PrimaryColumn('uuid')
    @ManyToOne(
        () => Medicamentos,
        medicamento => medicamento.farmacia_medicamento,{
            onDelete: "CASCADE"
        }
    )
    @JoinColumn({name:'id_medicamento'})
    id_medicamento: string;


    @PrimaryColumn('text')
    lote: string;

    
    @Column('int')
    stock: number;


}
