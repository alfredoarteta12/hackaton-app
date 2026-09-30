import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../entities/user.entity';

export class UserResponseDto {
  @ApiProperty({ example: '3fa85f64-5717-4562-b3fc-2c963f66afa6' })
  id: string;

  @ApiProperty({ example: 'Santiago Botero' })
  name: string;

  @ApiProperty({ example: 'santiago@example.com' })
  email: string;

  @ApiProperty({ example: UserRole.USER, enum: UserRole })
  role: UserRole;

  @ApiProperty({ example: '2026-08-01T10:00:00.000Z' })
  createdAt: Date;
}
