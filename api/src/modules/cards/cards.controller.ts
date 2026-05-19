import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { CardsService } from './cards.service';
import { CreateCardDto, UpdateCardDto } from './dto/card.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/roles.guard';
import { Roles } from '../../common/roles.decorator';

@ApiTags('cards')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('cards')
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  @Roles('driver', 'passenger')
  @Post()
  async create(@Body() createCardDto: CreateCardDto, @Req() req: any) {
    return this.cardsService.create(createCardDto, req.user.id);
  }

  @Roles('driver', 'passenger')
  @Get()
  async findMyCards(@Req() req: any) {
    return this.cardsService.findByUser(req.user.id);
  }

  @Roles('driver', 'passenger')
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateCardDto: UpdateCardDto, @Req() req: any) {
    return this.cardsService.update(id, updateCardDto, req.user.id);
  }

  @Roles('driver', 'passenger')
  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req: any) {
    await this.cardsService.remove(id, req.user.id);
    return { message: 'Card deleted' };
  }
}
