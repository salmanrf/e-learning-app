import * as bcrypt from 'bcrypt';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { SigninDto } from '@backend/auth/dtos';
import { UsersService } from '@backend/users';
import { Appconfig } from '@backend/types';
import { jwtSign } from 'apps/backend/utils';

@Injectable()
export default class AuthService {
  constructor(
    private readonly configService: ConfigService<Appconfig>,
    private readonly usersService: UsersService,
  ) {}

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
