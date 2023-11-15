import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';

import { jwtVerify } from '@backend/utils';
import { Appconfig } from '@backend/types';
import { AppAbility, CaslAbilityFactory } from '@backend/casl';
import { ISigninPayload } from '@backend/auth/types';
import { CHECK_POLICIES_KEY } from '@backend/decorators';
import { PolicyHandler } from '@backend/casl/types';

@Injectable()
export default class PoliciesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly caslAbilityFactory: CaslAbilityFactory,
    private readonly configService: ConfigService<Appconfig>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const policyHandlers =
      this.reflector.get<PolicyHandler[]>(
        CHECK_POLICIES_KEY,
        context.getHandler(),
      ) || [];

    const req = context.switchToHttp().getRequest();
    const authorization = req.headers['authorization'] as string;

    if (!authorization) {
      return !!authorization;
    }

    const token = authorization.split(' ').pop();
    let decoded: ISigninPayload;

    try {
      decoded = (await jwtVerify(
        token,
        this.configService.get('AUTH_JWT_SECRET'),
      )) as ISigninPayload;

      req['user_payload'] = decoded;
    } catch (error) {
      throw new UnauthorizedException(error);
    }

    const ability = await this.caslAbilityFactory.createForUser(decoded);

    return policyHandlers.every((handler) =>
      this.execPolicyHandler(handler, ability),
    );
  }

  private execPolicyHandler(handler: PolicyHandler, ability: AppAbility) {
    if (typeof handler === 'function') {
      return handler(ability);
    }
    return handler.handle(ability);
  }
}
