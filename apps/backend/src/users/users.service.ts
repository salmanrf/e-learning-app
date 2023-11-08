import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import { UsersEntity } from '@backend/users/entities';
import { CreateUserDto } from '@backend/users/dtos';

@Injectable()
export default class UsersService {
  constructor(
    @InjectRepository(UsersEntity)
    private readonly usersRepo: Repository<UsersEntity>,
  ) {}

  async createUser(dto: CreateUserDto): Promise<UsersEntity> {
    try {
      // ? Assume role with 1 is superadmin role
      const createData = { ...dto };

      const hashed = await bcrypt.hash(dto.password, 11);

      createData.password = hashed;

      const newUser = await this.usersRepo.save(createData);

      return newUser;
    } catch (error) {
      throw error;
    }
  }

  async findOneUser(criteria: Partial<UsersEntity>) {
    try {
      const user = await this.usersRepo.findOne({ where: criteria });

      return user;
    } catch (error) {
      throw error;
    }
  }
}
