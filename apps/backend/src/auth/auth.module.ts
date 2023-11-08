import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  PermissionsEntity,
  ResourcesEntity,
  RolesEntity,
  RolesPermissionsEntity,
} from '@backend/auth/entities';

import { UsersModule } from '@backend/users';
import AuthController from './auth.controller';
import AuthService from './auth.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PermissionsEntity,
      RolesEntity,
      RolesPermissionsEntity,
      ResourcesEntity,
    ]),
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
