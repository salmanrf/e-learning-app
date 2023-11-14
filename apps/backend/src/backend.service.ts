import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class BackendService {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {
    cacheManager.set('TEST', 1, 0);
  }

  async getHello() {
    console.log('TEST VALUE', await this.cacheManager.get('TEST'));

    return 'Hello World!';
  }
}
