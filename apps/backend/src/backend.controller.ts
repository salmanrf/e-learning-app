import { Controller, Get } from '@nestjs/common';
import { BackendService } from './backend.service';

@Controller()
export class BackendController {
  constructor(private readonly backendService: BackendService) {}

  @Get()
  async getHello() {
    return await this.backendService.getHello();
  }
}
