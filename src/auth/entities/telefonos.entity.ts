import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { Usuarios } from "./usuarios.entity";

@Entity({schema:'usuarios'})
export class Telefonos{

    @PrimaryColumn()
    @ManyToOne(
        () => Usuarios,
        usuarios => usuarios.telefonos,
        {
            onDelete: "CASCADE"
        }
    )
    @JoinColumn({name: 'cedula'})
    cedula: string;

    @PrimaryColumn('text')
    telefono: string;


}