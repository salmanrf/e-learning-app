import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CaslModule } from '@backend/casl';
import LecturesService from './lectures.service';
import LecturesController from './lectures.controller';
import { LecturesEntity } from './entities';

@Module({
  imports: [TypeOrmModule.forFeature([LecturesEntity]), CaslModule],
  controllers: [LecturesController],
  providers: [LecturesService],
})
export default class LecturesModule {}
