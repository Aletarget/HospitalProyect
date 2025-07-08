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

    @Column('numeric', {precision: 10, scale:2})
    salario: number;

    @Column('text')
    cedula: string;

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
    usuario: Usuarios;


    @OneToOne(
        () => Administrativos,
        admin => admin.id_empleado,{
            cascade: true
        }
    )
    admin: Administrativos;

    @OneToOne(
        () => Medicos,
        medico => medico.empleado
    )
    medico: Medicos;

}
