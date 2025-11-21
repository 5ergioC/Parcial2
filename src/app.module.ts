import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PonenteEntity } from './ponente/entities/ponente.entity';
import { AuditorioEntity } from './auditorio/entities/auditorio.entity';
import { AsistenteEntity } from './asistente/entities/asistente.entity';
import { EventoEntity } from './evento/entities/evento.entity';
import { PonenteModule } from './ponente/ponente.module';
import { AuditorioModule } from './auditorio/auditorio.module';
import { EventoModule } from './evento/evento.module';
import { AsistenteModule } from './asistente/asistente.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT!,
      database: process.env.DB_NAME,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      entities: [PonenteEntity, AuditorioEntity, AsistenteEntity, EventoEntity],
      autoLoadEntities: true,
      synchronize: true, // SOLO EN DESARROLLO
    }),
    PonenteModule,
    AuditorioModule,
    EventoModule,
    AsistenteModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
