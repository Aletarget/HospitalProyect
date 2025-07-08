import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from "typeorm";
import { Empleados } from "./empleado.entity";

@Entity({schema: 'empleados'})
export class Medicos{

    @PrimaryColumn('uuid')
    id_empleado: string;

    @OneToOne(
        () => Empleados,
        empleado => empleado.id_empleado,{
            onDelete: "CASCADE"
        }
    )
    @JoinColumn({name: 'id_empleado'})
    empleado: Empleados;


    @Column('text')
    departamento: string;

    @Column('text',{
        unique:true
    })
    registro_medico: string;


}