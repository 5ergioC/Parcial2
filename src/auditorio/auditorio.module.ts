import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditorioEntity } from './entities/auditorio.entity';
import { AuditorioService } from './auditorio.service';
import { AuditorioController } from './auditorio.controller';

@Module({
  imports: [TypeOrmModule.forFeature([AuditorioEntity])],
  controllers: [AuditorioController],
  providers: [AuditorioService],
  exports: [AuditorioService],
})
export class AuditorioModule {}
