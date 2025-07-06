import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm"
import { Pacientes } from "./paciente.entity"
import { Registro } from "./registro.entity";

@Entity({schema: 'pacientes'})
export class Historia_clinica{


    @PrimaryGeneratedColumn('uuid')
    id_historial: string;


    @Column('date')
    fecha_inicio: string;


    @OneToOne(
        () => Pacientes,
        paciente => paciente.hist_clinica,
        {
            onDelete: "CASCADE"
        }
    )
    @JoinColumn({name: 'cedula'})
    paciente: string;


    @OneToMany(
        () => Registro,
        registro => registro.id_historial
    )
    registro: Registro[];

}