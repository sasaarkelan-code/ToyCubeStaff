import { IsString, IsNotEmpty } from 'class-validator';

export class CreateManualDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsString()
  content: string;
}

export class UpdateManualDto {
  @IsString()
  title?: string;

  @IsString()
  category?: string;

  @IsString()
  content?: string;
}
