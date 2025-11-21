import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventoEntity } from './entities/evento.entity';
import { EventoService } from './evento.service';
import { PonenteEntity } from '../ponente/entities/ponente.entity';
import { AuditorioEntity } from '../auditorio/entities/auditorio.entity';
import { EventoController } from './evento.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([EventoEntity, PonenteEntity, AuditorioEntity]),
  ],
  controllers: [EventoController],
  providers: [EventoService],
  exports: [EventoService],
})
export class EventoModule {}
