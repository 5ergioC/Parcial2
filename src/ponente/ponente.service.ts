import { BadRequestException, Injectable, NotFoundException,} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PonenteEntity, TipoPonente,} from './entities/ponente.entity';
import { EventoEntity } from '../evento/entities/evento.entity';

@Injectable()
export class PonenteService {
  constructor(
    @InjectRepository(PonenteEntity)
    private readonly ponenteRepository: Repository<PonenteEntity>,
    @InjectRepository(EventoEntity)
    private readonly eventoRepository: Repository<EventoEntity>,
  ) {}

  async crearPonente(data: Partial<PonenteEntity>): Promise<PonenteEntity> {
    if (!data.email) {
      throw new BadRequestException('El email del ponente es obligatorio');
    }

    const tipo = data.tipoPonente ?? TipoPonente.INTERNO;
    this.validarEmail(tipo, data.email);

    const nuevoPonente = this.ponenteRepository.create({
      ...data,
      tipoPonente: tipo,
    });

    return this.ponenteRepository.save(nuevoPonente);
  }

  async findPonenteById(id: number): Promise<PonenteEntity> {
    const ponente = await this.ponenteRepository.findOne({ where: { id } });
    if (!ponente) {
      throw new NotFoundException(
        `El ponente con id ${id} no se encuentra registrado`,
      );
    }

    return ponente;
  }

  async eliminarPonente(id: number): Promise<void> {
    const ponente = await this.findPonenteById(id);
    const eventosAsociados = await this.eventoRepository.count({
      where: { ponente: { id } },
    });

    if (eventosAsociados > 0) {
      throw new BadRequestException(
        'No se puede eliminar el ponente porque tiene eventos asociados',
      );
    }

    await this.ponenteRepository.remove(ponente);
  }

  private validarEmail(tipo: TipoPonente, email: string) {
    const emailNormalizado = email.trim().toLowerCase();

    if (tipo === TipoPonente.INTERNO && !emailNormalizado.endsWith('.edu')) {
      throw new BadRequestException(
        'Los ponentes internos deben tener un email que termine en .edu',
      );
    }

    if (tipo === TipoPonente.INVITADO) {
      if (!emailNormalizado.includes('@')) {
        throw new BadRequestException(
          'El email de un ponente invitado debe ser valido (contener @ y dominio)',
        );
      }

      const dominio = emailNormalizado.split('@')[1];
      if (!dominio || !dominio.includes('.')) {
        throw new BadRequestException(
          'El email de un ponente invitado debe ser valido (contener @ y dominio)',
        );
      }
    }
  }
}
