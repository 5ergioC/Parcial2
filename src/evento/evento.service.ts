import { BadRequestException, Injectable, NotFoundException,} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventoEntity, EstadoEvento,} from './entities/evento.entity';
import { PonenteEntity, TipoPonente } from '../ponente/entities/ponente.entity';
import { AuditorioEntity } from '../auditorio/entities/auditorio.entity';
import { CreateEventoDto } from './dto/create-evento.dto';

@Injectable()
export class EventoService {
  constructor(
    @InjectRepository(EventoEntity)
    private readonly eventoRepository: Repository<EventoEntity>,
    @InjectRepository(PonenteEntity)
    private readonly ponenteRepository: Repository<PonenteEntity>,
    @InjectRepository(AuditorioEntity)
    private readonly auditorioRepository: Repository<AuditorioEntity>,
  ) {}

  async crearEvento(data: CreateEventoDto): Promise<EventoEntity> {
    if (!data.duracionHoras || data.duracionHoras <= 0) {
      throw new BadRequestException(
        'La duracion del evento debe ser un numero positivo',
      );
    }

    if (!data.ponenteId) {
      throw new BadRequestException('El evento debe tener un ponente asignado');
    }

    const ponente = await this.ponenteRepository.findOne({
      where: { id: data.ponenteId },
    });
    if (!ponente) {
      throw new NotFoundException('El ponente indicado no existe');
    }

    if (
      ponente.tipoPonente === TipoPonente.INVITADO &&
      (!data.descripcion || data.descripcion.trim().length < 50)
    ) {
      throw new BadRequestException(
        'La descripcion debe tener al menos 50 caracteres para eventos con ponentes invitados',
      );
    }

    let auditorio: AuditorioEntity | null = null;
    if (data.auditorioId) {
      auditorio = await this.auditorioRepository.findOne({
        where: { id: data.auditorioId },
      });
      if (!auditorio) {
        throw new NotFoundException('El auditorio indicado no existe');
      }
    }

    const evento = this.eventoRepository.create({
      titulo: data.titulo,
      descripcion: data.descripcion,
      fecha: new Date(data.fecha),
      duracionHoras: data.duracionHoras,
      ponente,
      auditorio,
    });

    return this.eventoRepository.save(evento);
  }

  async aprobarEvento(id: number): Promise<EventoEntity> {
    const evento = await this.eventoRepository.findOne({
      where: { id },
      relations: ['auditorio'],
    });
    if (!evento) {
      throw new NotFoundException('El evento indicado no existe');
    }

    if (!evento.auditorio) {
      throw new BadRequestException(
        'No se puede aprobar un evento sin auditorio asignado',
      );
    }

    evento.estado = EstadoEvento.APROBADO;
    return this.eventoRepository.save(evento);
  }

  async eliminarEvento(id: number): Promise<void> {
    const evento = await this.findEventoById(id);
    if (evento.estado === EstadoEvento.APROBADO) {
      throw new BadRequestException(
        'No es posible eliminar un evento que ya fue aprobado',
      );
    }

    await this.eventoRepository.remove(evento);
  }

  async findEventoById(id: number): Promise<EventoEntity> {
    const evento = await this.eventoRepository.findOne({
      where: { id },
      relations: ['ponente', 'auditorio', 'asistentes'],
    });

    if (!evento) {
      throw new NotFoundException(`El evento con id ${id} no existe`);
    }

    return evento;
  }
}
