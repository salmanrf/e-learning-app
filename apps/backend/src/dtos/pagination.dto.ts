import { IsIn, IsNumberString, IsOptional, IsString } from 'class-validator';

export class PaginationDto {
  @IsNumberString()
  page_number: number;

  @IsNumberString()
  page_size: number;

  @IsString()
  @IsOptional()
  sort_field: string;

  @IsIn(['DESC', 'ASC'])
  @IsOptional()
  sort_order: 'DESC' | 'ASC';
}

export class PaginatedData<T> extends PaginationDto {
  items: T[];
  total_items: number;
}
