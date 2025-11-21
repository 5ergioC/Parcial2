export class CreateEventoDto {
  titulo: string;
  descripcion: string;
  fecha: string;
  duracionHoras: number;
  ponenteId: number;
  auditorioId?: number;
}
