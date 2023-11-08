import {
  IsNumber,
  IsString,
  Matches,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export default class CreateUserDto {
  @IsNumber()
  @Min(1)
  role_id: number;

  @IsString()
  @Matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
  email: string;

  @IsString()
  @MinLength(1)
  @MaxLength(255)
  full_name: string;

  @IsString()
  @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{12,255}$/)
  password: string;
}
