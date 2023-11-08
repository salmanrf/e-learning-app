import { Body, Controller, Post } from '@nestjs/common';

import UsersService from './users.service';
import { CreateUserDto } from '@backend/users/dtos';
import { BaseApiResponse } from '@backend/dtos';

@Controller('/api/users')
export default class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
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
}
