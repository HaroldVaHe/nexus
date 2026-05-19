import { IsString, IsNotEmpty, IsInt, Min, Max, IsBoolean, IsOptional, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCardDto {
  @ApiProperty({ example: 'Visa' })
  @IsString()
  @IsNotEmpty()
  brand: string;

  @ApiProperty({ example: '4242' })
  @IsString()
  @IsNotEmpty()
  last_four: string;

  @ApiProperty({ example: 12 })
  @IsInt()
  @Min(1)
  @Max(12)
  exp_month: number;

  @ApiProperty({ example: 2027 })
  @IsInt()
  @Min(2024)
  exp_year: number;

  @ApiProperty({ example: 'Juan Pérez' })
  @IsString()
  @IsNotEmpty()
  cardholder_name: string;

  @ApiProperty({ example: false })
  @IsBoolean()
  @IsOptional()
  is_default?: boolean;
}

export class UpdateCardDto {
  @ApiProperty({ required: false, example: 12 })
  @IsInt()
  @Min(1)
  @Max(12)
  @IsOptional()
  exp_month?: number;

  @ApiProperty({ required: false, example: 2028 })
  @IsInt()
  @Min(2024)
  @IsOptional()
  exp_year?: number;

  @ApiProperty({ required: false, example: 'Juan Pérez' })
  @IsString()
  @IsOptional()
  cardholder_name?: string;

  @ApiProperty({ required: false, example: true })
  @IsBoolean()
  @IsOptional()
  is_default?: boolean;
}
