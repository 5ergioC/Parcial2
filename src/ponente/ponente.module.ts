import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PonenteEntity } from './entities/ponente.entity';
import { PonenteService } from './ponente.service';
import { EventoEntity } from '../evento/entities/evento.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PonenteEntity, EventoEntity])],
  providers: [PonenteService],
  exports: [PonenteService],
})
export class PonenteModule {}
