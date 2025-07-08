import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Citas } from "./citas.entity";
import { Agendas } from "./agendas.entity";
import { Cardiologos } from "./cardiologos.entity";
import { Prescripciones_Medicamentos } from "./pres-medic.entity";


@Entity({schema: 'dep_cardiologia'})
export class Prescripciones{

    @PrimaryGeneratedColumn('uuid')
    id_prescripcion: string;

    @Column('text')
    instrucciones: string;

    @Column('text')
    dosis: string;

    @OneToOne(
        () => Citas,
        cita => cita.prescripcion,{
            onDelete: "CASCADE"
        }
    )
    @JoinColumn({name: 'id_cita'})
    cita: Citas;

    @Column('integer')
    id_agenda: number;  

    @OneToOne(
        () => Agendas,
        agenda => agenda.prescripcion,{
            onDelete: "CASCADE"
        }
    )
    @JoinColumn({name: 'id_agenda'})
    agenda: Agendas;

    @ManyToOne(
        () => Cardiologos,
        cardiologo => cardiologo.prescripcion,{
            onDelete: "CASCADE"
        }
    )
    @JoinColumn({name: 'id_medico'})
    id_medico: string;

    @Column('text')
    id_paciente:string;

    @OneToMany(
        () => Prescripciones_Medicamentos,
        prescripcion_medicamento => prescripcion_medicamento.id_prescripcion
    )
    medicamentos: Prescripciones_Medicamentos[]
}