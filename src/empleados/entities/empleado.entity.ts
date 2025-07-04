import { Usuarios } from "src/auth/entities/usuarios.entity";
import { Admin, Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Administrativos } from "./administrativos.entity";
import { Medicos } from "./medicos.entity";

@Entity({schema: 'empleados'})
export class Empleados{

    @PrimaryGeneratedColumn('uuid')
    id_empleado: string;

    @Column('date')
    fecha_ingreso: Date;

    @Column('decimal', {precision: 10, scale:2})
    salario: number;


    @Column('time')
    hora_inicio: string;


    @Column('time')
    hora_fin: string;

    @OneToOne(
        () => Usuarios,
        usuario => usuario.empleado,
        {
            onDelete: "CASCADE"
        }
    )
    @JoinColumn({name : 'cedula'})
    cedula: string;


    @OneToOne(
        () => Administrativos,
        admin => admin.id_empleado,
    )
    admin: Administrativos;

    @OneToOne(
        () => Medicos,
        medico => medico.id_empleado,
    )
    medico: Medicos;

}
