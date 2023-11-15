import { Ability, AbilityBuilder, AbilityClass } from '@casl/ability';
import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

import { RolesEntity } from '@backend/auth/entities';
import { ISigninPayload } from '@backend/auth/types';
import { Action } from './types';

type Subjects = 'users' | 'lectures' | 'courses' | 'all';

export type AppAbility = Ability<[Action, Subjects]>;

@Injectable()
export default class CaslAbilityFactory {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  async createForUser(user_payload: ISigninPayload) {
    const { can, cannot, build } = new AbilityBuilder<
      Ability<[Action, Subjects]>
    >(Ability as AbilityClass<AppAbility>);

    const role = await this.cacheManager.get<RolesEntity>(
      `roles:${user_payload.role_id}`,
    );

    if (!role) {
      cannot(Action.Manage, 'all');

      return build();
    }

    role.role_permissions.forEach(({ permission }) => {
      const action = permission.action as Action;

      can(
        action,
        permission.resource.title as Subjects,
        {
          user_id: user_payload.sub,
        } as any,
      );

      return;
    });

    return build();
  }
}
