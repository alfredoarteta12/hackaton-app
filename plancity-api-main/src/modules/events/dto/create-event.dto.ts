import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsDateString,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  IsUrl,
  Min,
  MinLength,
} from 'class-validator';

export class CreateEventDto {
  @ApiProperty({ example: 'Festival de Jazz en el Parque' })
  @IsString()
  @MinLength(2)
  name: string;

  @ApiPropertyOptional({
    example: 'Una noche de jazz en vivo con bandas locales',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: '2026-11-15T19:00:00.000Z' })
  @IsDateString()
  date: string;

  @ApiProperty({ example: 'Parque de la 93, Bogotá' })
  @IsString()
  @MinLength(2)
  location: string;

  @ApiProperty({
    example: 45000,
    description:
      'Precio de entrada en la moneda local, sin símbolos. Usa 0 para eventos gratuitos',
  })
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  price: number;

  @ApiProperty({ example: 200, description: 'Cupo total de asistentes' })
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  capacity: number;

  @ApiProperty({ example: '3fa85f64-5717-4562-b3fc-2c963f66afa6' })
  @IsUUID()
  categoryId: string;

  @ApiPropertyOptional({
    example: [
      'https://example.com/imagenes/evento1-flyer.jpg',
      'https://example.com/imagenes/evento1-escenario.jpg',
    ],
    description:
      'URLs de las imágenes del evento, en el orden en que se deben mostrar',
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(10)
  @IsUrl({}, { each: true })
  images?: string[];
}
