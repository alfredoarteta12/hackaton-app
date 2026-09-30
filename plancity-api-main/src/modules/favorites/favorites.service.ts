import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Favorite } from './entities/favorite.entity';
import { EventsService } from '../events/events.service';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectRepository(Favorite)
    private readonly favoritesRepository: Repository<Favorite>,
    private readonly eventsService: EventsService,
  ) {}

  async findAllByUser(userId: string) {
    const favorites = await this.favoritesRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
    return favorites.map((favorite) => favorite.event);
  }

  async add(userId: string, eventId: string): Promise<Favorite> {
    await this.eventsService.findOne(eventId);

    const existing = await this.favoritesRepository.findOne({
      where: { userId, eventId },
    });
    if (existing) {
      throw new ConflictException('Este evento ya está en tus favoritos');
    }

    const favorite = this.favoritesRepository.create({ userId, eventId });
    return this.favoritesRepository.save(favorite);
  }

  async remove(userId: string, eventId: string): Promise<void> {
    const favorite = await this.favoritesRepository.findOne({
      where: { userId, eventId },
    });
    if (!favorite) {
      throw new NotFoundException('Este evento no está en tus favoritos');
    }
    await this.favoritesRepository.remove(favorite);
  }
}
