import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '@backend/auth';
import UsersEntity from './entities/users.entity';
import UsersController from './users.controller';
import UsersService from './users.service';
import { CaslModule } from '@backend/casl';

@Module({
  imports: [TypeOrmModule.forFeature([UsersEntity]), CaslModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export default class UsersModule {}
