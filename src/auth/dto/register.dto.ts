import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  IsStrongPassword,
} from 'class-validator';
import { UserRole } from '../enums/role.enum';

export class RegisterDto {
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @IsStrongPassword({}, { message: 'Password is not strong enough' })
  password: string;

  @IsEnum(UserRole)
  @IsOptional()
  role: string;
}
