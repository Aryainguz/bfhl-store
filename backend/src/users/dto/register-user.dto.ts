import { IsEmail, IsNotEmpty, IsString, MinLength, IsEnum, IsOptional } from 'class-validator';

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

export class RegisterUserDto {
  @IsNotEmpty()
  @IsString()
  name: string;
  
  @IsEmail()
  email: string;
  
  @IsNotEmpty()
  @MinLength(6)
  password: string;
  
  // The role is optional; if not provided, it defaults to "user"
  @IsOptional()
  @IsEnum(UserRole, { message: 'Role must be either "user" or "admin"' })
  role: UserRole = UserRole.USER;
}
