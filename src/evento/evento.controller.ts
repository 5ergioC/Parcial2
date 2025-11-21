import { Body, Controller, Delete, Get, Param, Patch, Post,} from '@nestjs/common';
import { EventoService } from './evento.service';
import { CreateEventoDto } from './dto/create-evento.dto';
import { EventoEntity } from './entities/evento.entity';

@Controller('eventos')
export class EventoController {
  constructor(private readonly eventoService: EventoService) {}

  @Post()
  async crearEvento(@Body() dto: CreateEventoDto): Promise<EventoEntity> {
    return this.eventoService.crearEvento(dto);
  }

  @Get(':id')
  findEvento(@Param('id') id: string) {
    return this.eventoService.findEventoById(Number(id));
  }

  @Patch(':id/aprobar')
  aprobar(@Param('id') id: string) {
    return this.eventoService.aprobarEvento(Number(id));
  }

  @Delete(':id')
  eliminar(@Param('id') id: string) {
    return this.eventoService.eliminarEvento(Number(id));
  }
}
