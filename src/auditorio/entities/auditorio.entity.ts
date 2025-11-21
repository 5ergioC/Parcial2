import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { EventoEntity } from '../../evento/entities/evento.entity';

@Entity({ name: 'auditorios' })
export class AuditorioEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column()
  nombre: string;

  @Column({ type: 'int' })
  capacidad: number;

  @Column()
  ubicacion: string;

  @OneToMany(() => EventoEntity, (evento) => evento.auditorio)
  eventos: EventoEntity[];
}
