import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/cache-manager';
import * as joi from 'joi';
import * as dotenv from 'dotenv';
import { join } from 'path';

import { AuthModule } from '@backend/auth';
import { BackendController } from '@backend/backend.controller';
import { BackendService } from '@backend/backend.service';
import { UsersModule } from '@backend/users';
import { LecturesModule } from '@backend/lectures';

dotenv.config();

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: 'apps/backend/.env',
      cache: false,
      isGlobal: true,
      validationSchema: joi.object({
        AUTH_JWT_SECRET: joi.string().required(),
      }),
    }),
    CacheModule.register({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.POSTGRES_URI,
      entities: [join(__dirname, '**', '*.entity.{ts,js}')],
      autoLoadEntities: true,
      synchronize: process.env.ENV !== 'production',
      logging: process.env.ENV !== 'production',
    }),
    AuthModule,
    LecturesModule,
    UsersModule,
  ],
  controllers: [BackendController],
  providers: [BackendService],
})
export class BackendModule {}
