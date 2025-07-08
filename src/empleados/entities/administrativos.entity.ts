import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from "typeorm";
import { Empleados } from "./empleado.entity";

@Entity({schema: 'empleados'})
export class Administrativos{

    @PrimaryColumn('uuid')
    id_empleado: string;


    @Column('text')
    cargo_admin:string;

    @OneToOne(
        () => Empleados,
        empleado => empleado.id_empleado,{
            onDelete: "CASCADE"
        }
    )
    @JoinColumn({name: 'id_empleado'})
    empleado: Empleados;

}