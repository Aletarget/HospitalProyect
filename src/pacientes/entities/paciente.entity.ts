import { Usuarios } from "src/auth/entities/usuarios.entity";
import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryColumn } from "typeorm";
import { Historia_clinica } from "./hist-clinica.entity";

@Entity({schema: 'pacientes'})
export class Pacientes {

    @PrimaryColumn('text')
    cedula: string;

    @OneToOne(
        () => Usuarios,
        usuario => usuario.paciente,
        {
            onDelete: "CASCADE"
        }
    )
    @JoinColumn({name : 'cedula'})
    usuario: Usuarios;

    @Column('date')
    fecha_nac: Date;
    

    @OneToOne(
        () => Historia_clinica,
        hist_clinica => hist_clinica.paciente
    )
    hist_clinica: Historia_clinica;
}
