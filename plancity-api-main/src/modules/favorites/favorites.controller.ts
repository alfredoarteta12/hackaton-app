import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { FavoritesService } from './favorites.service';
import { Auth } from '../auth/decorators/auth.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { JwtPayload } from '../auth/interfaces/jwt-payload.interface';

@ApiTags('Favoritos')
@Auth()
@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  @ApiOperation({
    summary: 'Listar los eventos favoritos del usuario autenticado',
  })
  findAll(@CurrentUser() currentUser: JwtPayload) {
    return this.favoritesService.findAllByUser(currentUser.sub);
  }

  @Post(':eventId')
  @ApiOperation({ summary: 'Agregar un evento a favoritos' })
  add(
    @CurrentUser() currentUser: JwtPayload,
    @Param('eventId', ParseUUIDPipe) eventId: string,
  ) {
    return this.favoritesService.add(currentUser.sub, eventId);
  }

  @Delete(':eventId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Quitar un evento de favoritos' })
  remove(
    @CurrentUser() currentUser: JwtPayload,
    @Param('eventId', ParseUUIDPipe) eventId: string,
  ) {
    return this.favoritesService.remove(currentUser.sub, eventId);
  }
}
