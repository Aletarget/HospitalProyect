import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from "typeorm";
import { Empleados } from "./empleado.entity";

@Entity({schema: 'empleados'})
export class Administrativos{

    @Column('text')
    cargo_admin:string;

    @PrimaryColumn('uuid')
    @OneToOne(
        () => Empleados,
        empleado => empleado.id_empleado,{
            onDelete: "CASCADE"
        }
    )
    @JoinColumn({name: 'id_empleado'})
    id_empleado: string;

}