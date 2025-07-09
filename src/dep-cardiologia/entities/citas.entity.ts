import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Agendas } from "./agendas.entity";
import { Cardiologos } from "./cardiologos.entity";
import { Prescripciones } from "./prescripciones.entity";
import { Actualiza } from "./actualiza.entity";


@Entity({schema: 'dep_cardiologia'})
export class Citas{
    @PrimaryGeneratedColumn('uuid')
    id_cita: string;

    @Column('text')
    departamento: string;

    @Column('text')
    edificio: string;

    @Column('text')
    cod_consultorio: string;

    @Column('date')
    fecha: Date;

    @Column('time')
    hora_inicio: string;

    @Column('time')
    hora_fin: string;

    @Column('text')
    nom_med: string;

    //Se crea una restriccion desde el backend
    
    @Column('uuid')
    id_admin: string;

    @ManyToOne(
        () => Cardiologos,
        cargiologo => cargiologo.citas,{
            onDelete: "CASCADE"
        }
    )
    @JoinColumn({name: 'id_medico'})
    id_medico: Cardiologos;

    @OneToOne(
        () => Agendas,
        agenda => agenda.cita,{
            onDelete: "CASCADE"
        }
    )
    @JoinColumn({name: 'id_agenda'})
    agenda: Agendas;

    //Se crea una restriccion desde el backend donde el paciente debe existir en la base de datos
    @Column('text')
    id_paciente: string;


    @OneToOne(
        () => Prescripciones,
        precripcion => precripcion.cita,{
            cascade: true
        }
    )
    prescripcion: Prescripciones;



    @OneToOne(
            () => Actualiza,
            actualiza => actualiza.agenda,{
                eager: true
            }
        )
    actualiza: Actualiza;

}