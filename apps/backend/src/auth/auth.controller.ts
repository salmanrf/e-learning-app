import AuthService from '@backend/auth/auth.service';
import { SigninDto } from '@backend/auth/dtos';
import { BaseApiResponse } from '@backend/dtos';
import {
  Body,
  Controller,
  InternalServerErrorException,
  Post,
} from '@nestjs/common';

@Controller('/api/auth')
export default class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signin')
  async handleSignin(@Body() dto: SigninDto) {
    try {
      const [status, act] = await this.authService.signin(dto);

      if (!status) {
        throw new InternalServerErrorException('Internal server error');
      }

      return new BaseApiResponse({
        status,
        data: {
          access_token: act,
        },
        message: 'User signed-in successfully',
      });
    } catch (error) {
      throw error;
    }
  }
}
