import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as joi from 'joi';
import * as dotenv from 'dotenv';
import { join } from 'path';

import { BackendController } from '@backend/backend.controller';
import { BackendService } from '@backend/backend.service';

dotenv.config();

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: 'apps/backend/.env',
      cache: false,
      isGlobal: true,
      validationSchema: joi.object({}),
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.POSTGRES_URI,
      entities: [join(__dirname, '**', '*.entity.{ts,js}')],
      autoLoadEntities: true,
      synchronize: process.env.ENV !== 'production',
      logging: process.env.ENV !== 'production',
    }),
  ],
  controllers: [BackendController],
  providers: [BackendService],
})
export class BackendModule {}
