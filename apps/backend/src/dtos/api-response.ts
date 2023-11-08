import { BadRequestException } from '@nestjs/common';
import { validateSync } from 'class-validator';

export default class BaseApiResponse<T> {
  status?: boolean;
  data?: T;
  message?: string;
  errors?: object;

  constructor(init: Partial<BaseApiResponse<T>>) {
    Object.assign(this, init);

    const errors = validateSync(this);
    if (errors.length > 0) {
      throw new BadRequestException(`Validation failed: ${errors.toString()}`);
    }
  }
}
