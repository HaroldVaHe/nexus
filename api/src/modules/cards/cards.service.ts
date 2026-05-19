import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SavedCard } from '../../database/entities/saved-card.entity';
import { CreateCardDto, UpdateCardDto } from './dto/card.dto';

@Injectable()
export class CardsService {
  constructor(
    @InjectRepository(SavedCard)
    private cardsRepository: Repository<SavedCard>,
  ) {}

  async create(createCardDto: CreateCardDto, userId: string): Promise<SavedCard> {
    this.validateExpiry(createCardDto.exp_month, createCardDto.exp_year);

    const existingCards = await this.cardsRepository.count({
      where: { user: { id: userId } },
    });

    const isDefault = existingCards === 0 ? true : (createCardDto.is_default ?? false);

    if (isDefault) {
      await this.clearDefault(userId);
    }
    const card = this.cardsRepository.create({
      ...createCardDto,
      is_default: isDefault,
      user: { id: userId },
    });
    return this.cardsRepository.save(card);
  }

  private validateExpiry(month: number, year: number): void {
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    if (year < currentYear) {
      throw new BadRequestException('La tarjeta ya está vencida');
    }
    if (year === currentYear && month < currentMonth) {
      throw new BadRequestException('La tarjeta ya está vencida');
    }
  }

  async findByUser(userId: string): Promise<SavedCard[]> {
    return this.cardsRepository.find({
      where: { user: { id: userId } },
      order: { is_default: 'DESC', created_at: 'DESC' },
    });
  }

  async findOne(id: string): Promise<SavedCard> {
    const card = await this.cardsRepository.findOne({ where: { id } });
    if (!card) {
      throw new NotFoundException('Card not found');
    }
    return card;
  }

  async update(id: string, updateCardDto: UpdateCardDto, userId: string): Promise<SavedCard> {
    const card = await this.findOne(id);
    if (card.user_id !== userId) {
      throw new NotFoundException('Card not found');
    }
    if (updateCardDto.exp_month !== undefined || updateCardDto.exp_year !== undefined) {
      this.validateExpiry(
        updateCardDto.exp_month ?? card.exp_month,
        updateCardDto.exp_year ?? card.exp_year,
      );
    }
    if (updateCardDto.is_default) {
      await this.clearDefault(userId);
    }
    await this.cardsRepository.update(id, updateCardDto);
    return this.findOne(id);
  }

  async remove(id: string, userId: string): Promise<void> {
    const card = await this.findOne(id);
    if (card.user_id !== userId) {
      throw new NotFoundException('Card not found');
    }
    await this.cardsRepository.remove(card);
  }

  private async clearDefault(userId: string): Promise<void> {
    await this.cardsRepository.update(
      { user: { id: userId }, is_default: true },
      { is_default: false },
    );
  }
}
