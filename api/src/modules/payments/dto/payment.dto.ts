import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePaymentPreferenceDto {
  @ApiProperty({ example: 'uuid-of-booking' })
  @IsString()
  @IsNotEmpty()
  booking_id: string;
}

export class VerifyPaymentDto {
  @ApiProperty({ example: 'uuid-of-booking' })
  @IsString()
  @IsNotEmpty()
  external_reference: string;

  @ApiProperty({ example: '1234567890' })
  @IsString()
  @IsOptional()
  preference_id?: string;

  @ApiProperty({ example: 'approved' })
  @IsString()
  @IsOptional()
  collection_status?: string;
}
