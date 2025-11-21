import { BadRequestException, ConflictException, Injectable, NotFoundException,} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AsistenteEntity } from './entities/asistente.entity';
import { EventoEntity } from '../evento/entities/evento.entity';

@Injectable()
export class AsistenteService {
  constructor(
    @InjectRepository(AsistenteEntity)
    private readonly asistenteRepository: Repository<AsistenteEntity>,
    @InjectRepository(EventoEntity)
    private readonly eventoRepository: Repository<EventoEntity>,
  ) {}

  async registrarAsistente(
    eventoId: number,
    data: Partial<AsistenteEntity>,
  ): Promise<AsistenteEntity> {
    const evento = await this.eventoRepository.findOne({
      where: { id: eventoId },
      relations: ['auditorio', 'asistentes'],
    });

    if (!evento) {
      throw new NotFoundException(
        `El evento con id ${eventoId} no existe`,
      );
    }

    if (!evento.auditorio) {
      throw new BadRequestException(
        'El evento no tiene un auditorio asignado para calcular capacidad',
      );
    }

    if (!data.email) {
      throw new BadRequestException('El email del asistente es obligatorio');
    }

    const email = data.email.trim().toLowerCase();
    const asistenteRepetido =
      evento.asistentes?.some(
        (asistente) => asistente.email.toLowerCase() === email,
      ) ?? false;

    if (asistenteRepetido) {
      throw new ConflictException(
        'Ya existe un asistente registrado con ese email para este evento',
      );
    }

    const capacidadDisponible =
      evento.auditorio.capacidad - (evento.asistentes?.length ?? 0);
    if (capacidadDisponible <= 0) {
      throw new BadRequestException(
        'La capacidad del auditorio ya esta completa',
      );
    }

    const nuevoAsistente = this.asistenteRepository.create({
      ...data,
      email,
      evento,
    });

    return this.asistenteRepository.save(nuevoAsistente);
  }

  async findAsistentesByEvento(
    eventoId: number,
  ): Promise<AsistenteEntity[]> {
    const evento = await this.eventoRepository.findOne({
      where: { id: eventoId },
      relations: ['asistentes'],
    });

    if (!evento) {
      throw new NotFoundException(
        `El evento con id ${eventoId} no existe`,
      );
    }

    return evento.asistentes;
  }
}
