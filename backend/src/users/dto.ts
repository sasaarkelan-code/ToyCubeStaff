import { IsString, IsEnum, IsOptional, MinLength, IsInt, IsBoolean } from 'class-validator';
import { Role, WorkMode, StaffStatus } from '@prisma/client';

export class CreateUserDto {
  @IsString()
  login: string;

  @IsString()
  nickname: string;

  @IsString()
  @MinLength(4)
  password: string;

  @IsEnum(Role)
  @IsOptional()
  role?: Role;

  @IsString()
  @IsOptional()
  position?: string;
}

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  nickname?: string;

  @IsString()
  @IsOptional()
  position?: string;

  @IsEnum(WorkMode)
  @IsOptional()
  workMode?: WorkMode;

  @IsEnum(StaffStatus)
  @IsOptional()
  status?: StaffStatus;

  @IsString()
  @IsOptional()
  telegram?: string;

  @IsInt()
  @IsOptional()
  warnings?: number;

  @IsInt()
  @IsOptional()
  reprimands?: number;

  @IsBoolean()
  @IsOptional()
  onVacation?: boolean;

  @IsInt()
  @IsOptional()
  currency?: number;
}

export class ChangeRoleDto {
  @IsEnum(Role)
  role: Role;
}
