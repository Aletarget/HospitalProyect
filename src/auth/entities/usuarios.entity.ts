import { Column, Entity, OneToMany, OneToOne, PrimaryColumn } from "typeorm";
import { Telefonos } from "./telefonos.entity";
import { Empleados } from "src/empleados/entities";
import { Pacientes } from "src/pacientes/entities/paciente.entity";

@Entity({schema: 'usuarios'})
export class Usuarios {

    @PrimaryColumn('text',{
        
    })
    cedula: string;

    @Column('text',
        {
            
            unique:true,
            nullable:false
        }
    )
    correo: string;


    @Column('text',
        {
            
            nullable:false
        }
    )
    nombre: string;


    @Column('text',{
        nullable:false,
        default: 'user'
    })
    permisos: string;


    @Column('text',{
        
        nullable:false
    })
    calle: string


    @Column('text',{
        
        nullable:false
    })
    carrera: string;

    @Column('bool',{
        default: true
    })
    estado: boolean;

    @Column('text',{
        nullable:false,
        select: false
    })
    password: string;


    @Column('date',{
        nullable: true
    })
    fecha_expedicion: Date

    @OneToMany(
        () => Telefonos,
        telefonos => telefonos.cedula,
        {
            cascade:true,
            eager: true
        }
    )
    telefonos: Telefonos[];



    @OneToOne(
        () => Empleados,
        empleado => empleado.usuario,{
            cascade: true
        }
    )
    empleado: Empleados;


    @OneToOne(
        () => Pacientes,
        paciente => paciente.cedula,{
            cascade: true
        }
    )
    paciente: Pacientes;


    

}
