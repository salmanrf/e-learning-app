import {
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export default class CreateLectureDto {
  @IsString()
  title: string;

  @IsString()
  @MinLength(1)
  @MaxLength(25)
  type: string;

  @IsString()
  @IsOptional()
  content: string;

  author_id: string;
}
