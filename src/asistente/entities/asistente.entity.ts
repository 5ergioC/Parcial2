import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { EventoEntity } from '../../evento/entities/evento.entity';

@Entity({ name: 'asistentes' })
export class AsistenteEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column()
  nombre: string;

  @Column()
  codigoEstudiante: string;

  @Column()
  email: string;

  @ManyToOne(() => EventoEntity, (evento) => evento.asistentes, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  evento: EventoEntity;
}
