import { Body, Controller, Post } from '@nestjs/common';
import { AuditorioService } from './auditorio.service';
import { CreateAuditorioDto } from './dto/create-auditorio.dto';
import { AuditorioEntity } from './entities/auditorio.entity';

@Controller('auditorios')
export class AuditorioController {
  constructor(private readonly auditorioService: AuditorioService) {}

  @Post()
  crear(@Body() dto: CreateAuditorioDto): Promise<AuditorioEntity> {
    return this.auditorioService.crearAuditorio(dto);
  }
}
