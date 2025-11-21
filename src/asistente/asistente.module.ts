import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AsistenteEntity } from './entities/asistente.entity';
import { AsistenteService } from './asistente.service';
import { EventoEntity } from '../evento/entities/evento.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AsistenteEntity, EventoEntity])],
  providers: [AsistenteService],
  exports: [AsistenteService],
})
export class AsistenteModule {}
