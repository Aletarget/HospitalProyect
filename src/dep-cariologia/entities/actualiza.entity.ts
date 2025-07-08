import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryColumn } from "typeorm";
import { Agendas } from "./agendas.entity";
import { Cardiologos } from "./cardiologos.entity";
import { Citas } from "./citas.entity";

@Entity({schema: 'dep_cardiologia'})
export class Actualiza{
    @PrimaryColumn('uuid')
    @OneToOne(
        () => Citas,
        cita => cita.actualiza,{
            onDelete: "CASCADE"
        }
    )
    id_cita: string;
    

    @PrimaryColumn('uuid')
    @ManyToOne(
        () => Cardiologos,
        cardiologo => cardiologo.actualiza,{
            onDelete: "CASCADE"
        }
    )
    @JoinColumn({name: 'id_medico'})
    id_medico: string;
    

    @PrimaryColumn('integer')
    id_agenda: number;
    
    @OneToOne(
        () => Agendas,
        agenda => agenda.actualiza,{
            onDelete: "CASCADE"
        }
    )
    @JoinColumn({name: 'id_agenda'})
    agenda: Agendas;
    
    //Restriccion donde se debe de buscar el historial del paciente y usarlo en este campo
    @Column('uuid')
    id_historial: string;
    
    @Column('date')
    fecha_actualizacion: Date;
    
    @Column('text')
    descripcion: string;
    
    @Column('time')
    hora: string;

}