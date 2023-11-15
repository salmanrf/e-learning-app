import * as bcrypt from 'bcrypt';
import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  OnModuleInit,
  forwardRef,
} from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { SigninDto } from '@backend/auth/dtos';
import { UsersService } from '@backend/users';
import { Appconfig } from '@backend/types';
import { jwtSign } from '@backend/utils';
import { RolesEntity } from '@backend/auth/entities';

@Injectable()
export default class AuthService implements OnModuleInit {
  constructor(
    @InjectRepository(RolesEntity)
    private readonly rolesRepo: Repository<RolesEntity>,
    private readonly configService: ConfigService<Appconfig>,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  async onModuleInit() {
    const roles = await this.findAllRoles();

    await Promise.all(
      roles.map((r) => {
        this.cacheManager.set(`roles:${r.role_id}`, r, 0);
      }),
    );
  }

  async findOneRole(criteria: Partial<RolesEntity>) {
    const role = await this.rolesRepo.findOne({ where: { ...criteria } });

    return role;
  }

  async findAllRoles() {
    const rolesQb = this.rolesRepo.createQueryBuilder('r');

    rolesQb.leftJoinAndSelect('r.role_permissions', 'rp');
    rolesQb.leftJoinAndSelect('rp.permission', 'p');
    rolesQb.leftJoinAndSelect('p.resource', 'res');

    const data = await rolesQb.getMany();

    return data;
  }

  async signin(dto: SigninDto): Promise<[boolean, string]> {
    try {
      const user = await this.usersService.findOneUser({
        email: dto.email.toLocaleLowerCase(),
      });

      if (!user) {
        throw new NotFoundException("Can't find user");
      }

      const passwordMatch = await bcrypt.compare(dto.password, user.password);

      if (!passwordMatch) {
        throw new BadRequestException('Incorrect email/password');
      }

      const accessToken = await jwtSign(
        {
          sub: user.user_id,
          email: user.email,
          role_id: user.role_id,
          full_name: user.full_name,
        },
        this.configService.get('AUTH_JWT_SECRET'),
        {
          algorithm: 'HS256',
          expiresIn: 24 * 60 * 60, // ? 24 hours in seconds
        },
      );

      return [true, accessToken];
    } catch (error) {
      throw error;
    }
  }
}
