import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Cardiologos } from "./cardiologos.entity";
import { Consultas } from "./consultas.entity";
import { Citas } from "./citas.entity";
import { Prescripciones } from "./prescripciones.entity";
import { Actualiza } from "./actualiza.entity";

@Entity({schema: 'dep_cardiologia'})
export class Agendas{

    @PrimaryGeneratedColumn('increment')
    id_agenda: number;

    @Column('text',{
        default: 'disponible',
        nullable:false
    })
    estado: string;

    @Column('time',{
        nullable: false
    })
    hora_inicio: string;

    @Column('time',{
        nullable: false
    })
    hora_fin: string;

    @Column('date',{
        nullable:false
    })
    fecha: Date;

    @ManyToOne(
        () => Cardiologos,
        cardiologo => cardiologo.agendas,
        {
            onDelete: "CASCADE"
        }
    )
    @JoinColumn({name: 'id_empleado'})
    cardiologo: Cardiologos;

    @OneToMany(
        () => Consultas,
        consulta => consulta.id_agenda,{
            cascade:true,
            eager: true
        }
    )
    consultas: Consultas[];


    @OneToOne(
        () => Citas,
        cita => cita.agenda,{
            cascade: true,
            eager: true
        }
    )
    cita: Citas;


    @OneToOne(
            () => Prescripciones,
            precripcion => precripcion.agenda,{
                cascade: true
            }
        )
    prescripcion: Prescripciones;

    @OneToOne(
        () => Actualiza,
        actualiza => actualiza.agenda,{
            cascade: true,
            eager: true
        }
    )
    actualiza: Actualiza;

}