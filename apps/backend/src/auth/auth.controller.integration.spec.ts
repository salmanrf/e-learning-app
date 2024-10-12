import AuthController from '@backend/auth/auth.controller';
import { SigninDto } from '@backend/auth/dtos';
import { RolesEntity } from '@backend/auth/entities';
import { BaseApiResponse } from '@backend/dtos';
import { UsersEntity } from '@backend/users/entities';
import { CacheModule } from '@nestjs/cache-manager';
import { INestApplication, ValidationPipe, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as request from 'supertest';
import * as bcrypt from 'bcrypt';
import * as utils from '@backend/utils';
import AuthService from '@backend/auth/auth.service';
import { UsersService } from '@backend/users';

jest.mock('bcrypt');
jest.mock('@backend/utils');

describe('Authentication Controller', () => {
  let app: INestApplication;
  let rolesRepoMock: {
    createQueryBuilder: jest.Mock;
  };
  let getManyMock: jest.Mock;
  let userRepoMock: {
    findOne: jest.Mock;
  };
  let configServiceMock: {
    get: jest.Mock;
  };

  beforeEach(async () => {
    getManyMock = jest.fn();
    rolesRepoMock = {
      createQueryBuilder: jest.fn().mockReturnValueOnce({
        leftJoinAndSelect: jest.fn(),
        getMany: getManyMock,
      }),
    };
    userRepoMock = {
      findOne: jest.fn(),
    };
    configServiceMock = {
      get: jest.fn(),
    };

    getManyMock.mockResolvedValueOnce([]);

    const module: TestingModule = await Test.createTestingModule({
      imports: [CacheModule.register({ isGlobal: true })],
      providers: [
        AuthService,
        UsersService,
        {
          provide: getRepositoryToken(RolesEntity),
          useValue: rolesRepoMock,
        },
        {
          provide: getRepositoryToken(UsersEntity),
          useValue: userRepoMock,
        },
        {
          provide: ConfigService,
          useValue: configServiceMock,
        },
      ],
      controllers: [AuthController],
    }).compile();

    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());

    await app.init();
  });

  describe('Signin', () => {
    let userMock: UsersEntity;
    let jwtMock: string;

    beforeEach(() => {
      jwtMock = 'asdasd';
      userMock = {
        user_id: '890',
        full_name: 'Salman',
        email: 'salman@yopmail.com',
        password: '123',
        role_id: 1,
        created_at: new Date(),
        updated_at: new Date(),
      };

      userRepoMock.findOne.mockResolvedValueOnce(userMock);
      (bcrypt.compare as jest.Mock).mockResolvedValueOnce(true);
      (utils.jwtSign as jest.Mock).mockResolvedValueOnce(jwtMock);
    });

    it('Should return base API response with access_token field', async () => {
      const dto: SigninDto = {
        email: 'salman@yopmail.com',
        password: '#Capybara123',
      };

      const expectedData: BaseApiResponse<any> = {
        status: true,
        data: {
          access_token: jwtMock,
        },
        message: 'User signed-in successfully',
      };

      return request(app.getHttpServer())
        .post('/api/auth/signin')
        .send(dto)
        .expect(HttpStatus.CREATED)
        .expect(expectedData);
    });
  });
});
