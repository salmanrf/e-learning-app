import { PaginationDto } from '@backend/dtos';
import { IsOptional, IsString } from 'class-validator';

export default class FindManyLecturesDto extends PaginationDto {
  @IsString()
  @IsOptional()
  author_id?: string;

  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  content?: string;
}
