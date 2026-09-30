import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Event } from './entities/event.entity';
import { EventImage } from './entities/event-image.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { QueryEventDto } from './dto/query-event.dto';
import { CategoriesService } from '../categories/categories.service';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private readonly eventsRepository: Repository<Event>,
    @InjectRepository(EventImage)
    private readonly eventImagesRepository: Repository<EventImage>,
    private readonly categoriesService: CategoriesService,
  ) {}

  async findAll(query: QueryEventDto): Promise<Event[]> {
    const qb = this.eventsRepository
      .createQueryBuilder('event')
      .leftJoinAndSelect('event.category', 'category')
      .leftJoinAndSelect('event.images', 'images')
      .orderBy('event.date', 'ASC');

    if (query.search) {
      qb.andWhere(
        '(event.name ILIKE :search OR event.description ILIKE :search)',
        {
          search: `%${query.search}%`,
        },
      );
    }

    if (query.categoryId) {
      qb.andWhere('event.categoryId = :categoryId', {
        categoryId: query.categoryId,
      });
    }

    return qb.getMany();
  }

  async findOne(id: string): Promise<Event> {
    const event = await this.eventsRepository.findOne({ where: { id } });
    if (!event) {
      throw new NotFoundException('Evento no encontrado');
    }
    return event;
  }

  async create(dto: CreateEventDto): Promise<Event> {
    await this.categoriesService.findOne(dto.categoryId);
    await this.assertNameNotTaken(dto.name);

    const event = this.eventsRepository.create({
      name: dto.name,
      description: dto.description ?? null,
      date: new Date(dto.date),
      location: dto.location,
      price: dto.price,
      capacity: dto.capacity,
      categoryId: dto.categoryId,
      images: (dto.images ?? []).map((url, index) =>
        this.eventImagesRepository.create({ url, order: index }),
      ),
    });

    const saved = await this.eventsRepository.save(event);
    return this.findOne(saved.id);
  }

  async update(id: string, dto: UpdateEventDto): Promise<Event> {
    const event = await this.findOne(id);

    if (dto.categoryId && dto.categoryId !== event.categoryId) {
      await this.categoriesService.findOne(dto.categoryId);
    }

    if (dto.name && dto.name.toLowerCase() !== event.name.toLowerCase()) {
      await this.assertNameNotTaken(dto.name);
    }

    const { images, date, ...rest } = dto;
    Object.assign(event, rest);
    if (date) {
      event.date = new Date(date);
    }

    if (images) {
      await this.eventImagesRepository.delete({ eventId: id });
      event.images = images.map((url, index) =>
        this.eventImagesRepository.create({ url, order: index }),
      );
    }

    await this.eventsRepository.save(event);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const event = await this.findOne(id);
    await this.eventsRepository.remove(event);
  }

  private async assertNameNotTaken(name: string): Promise<void> {
    const existing = await this.eventsRepository.findOne({
      where: { name: ILike(name) },
    });
    if (existing) {
      throw new ConflictException('Ya existe un evento con este nombre');
    }
  }
}
