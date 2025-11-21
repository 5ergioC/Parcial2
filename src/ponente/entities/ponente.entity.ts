import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { EventoEntity } from '../../evento/entities/evento.entity';

export enum TipoPonente {
  INTERNO = 'Interno',
  INVITADO = 'Invitado',
}

@Entity({ name: 'ponentes' })
export class PonenteEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'int', unique: true })
  cedula: number;

  @Column()
  nombre: string;

  @Column({ unique: true })
  email: string;

  @Column({
    type: 'enum',
    enum: TipoPonente,
    default: TipoPonente.INTERNO,
  })
  tipoPonente: TipoPonente;

  @Column()
  especialidad: string;

  @OneToMany(() => EventoEntity, (evento) => evento.ponente)
  eventos: EventoEntity[];
}
