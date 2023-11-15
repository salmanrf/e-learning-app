import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';

import UsersService from './users.service';
import { CreateUserDto } from '@backend/users/dtos';
import { BaseApiResponse } from '@backend/dtos';
import { CheckPolicies } from '@backend/decorators';
import { Ability } from '@casl/ability';
import { PoliciesGuard } from '@backend/guards';

@Controller('/api/users')
export default class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: Ability) => ability.can('create', 'users'))
  async handleCreateUser(@Body() createUserDto: CreateUserDto) {
    try {
      const res = await this.usersService.createUser(createUserDto);

      return new BaseApiResponse({
        status: true,
        data: res,
        message: 'User created successfully',
      });
    } catch (error) {
      throw error;
    }
  }

  @Get('/profile')
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: Ability) => ability.can('read', 'users'))
  async handleGetUserProfile(@Req() req: Request) {
    try {
      const user = await this.usersService.findOneUser({
        user_id: req['user_payload']['sub'],
      });

      return new BaseApiResponse({
        status: true,
        data: user,
        message: 'User profile retrieved successfully',
      });
    } catch (error) {
      throw error;
    }
  }
}
