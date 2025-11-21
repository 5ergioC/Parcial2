import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PonenteEntity } from '../../ponente/entities/ponente.entity';
import { AuditorioEntity } from '../../auditorio/entities/auditorio.entity';
import { AsistenteEntity } from '../../asistente/entities/asistente.entity';

export enum EstadoEvento {
  PROPUESTO = 'Propuesto',
  APROBADO = 'Aprobado',
  RECHAZADO = 'Rechazado',
}

@Entity({ name: 'eventos' })
export class EventoEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column()
  titulo: string;

  @Column({ type: 'text' })
  descripcion: string;

  @Column({ type: 'timestamp' })
  fecha: Date;

  @Column({ type: 'int' })
  duracionHoras: number;

  @Column({
    type: 'enum',
    enum: EstadoEvento,
    default: EstadoEvento.PROPUESTO,
  })
  estado: EstadoEvento;

  @ManyToOne(() => PonenteEntity, (ponente) => ponente.eventos, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  ponente: PonenteEntity;

  @ManyToOne(() => AuditorioEntity, (auditorio) => auditorio.eventos, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  auditorio: AuditorioEntity | null;

  @OneToMany(() => AsistenteEntity, (asistente) => asistente.evento)
  asistentes: AsistenteEntity[];
}
