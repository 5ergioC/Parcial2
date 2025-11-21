import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditorioEntity } from './entities/auditorio.entity';

@Injectable()
export class AuditorioService {
  constructor(
    @InjectRepository(AuditorioEntity)
    private readonly auditorioRepository: Repository<AuditorioEntity>,
  ) {}

  async crearAuditorio(
    data: Partial<AuditorioEntity>,
  ): Promise<AuditorioEntity> {
    if (!data.capacidad || data.capacidad <= 0) {
      throw new BadRequestException(
        'La capacidad del auditorio debe ser mayor a cero',
      );
    }

    const auditorio = this.auditorioRepository.create(data);
    return this.auditorioRepository.save(auditorio);
  }
}
