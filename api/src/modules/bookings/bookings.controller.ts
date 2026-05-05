import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/booking.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/roles.guard';
import { Roles } from '../../common/roles.decorator';

@ApiTags('bookings')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Roles('passenger')
  @Post()
  async create(@Body() createDto: CreateBookingDto, @Req() req: any) {
    return this.bookingsService.create(createDto, req.user.id);
  }

  @Roles('passenger')
  @Get('my')
  async findMyBookings(@Req() req: any) {
    return this.bookingsService.findByPassenger(req.user.id);
  }

  @Roles('driver')
  @Get('driver/trips')
  async findDriverBookings(@Req() req: any) {
    return this.bookingsService.findByDriver(req.user.id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.bookingsService.findById(id);
  }

  @Roles('passenger')
  @Put(':id/cancel')
  async cancelBooking(@Param('id') id: string, @Req() req: any) {
    return this.bookingsService.cancelBooking(id, req.user.id);
  }

  @Roles('driver')
  @Put(':id/confirm')
  async confirmBooking(@Param('id') id: string, @Req() req: any) {
    return this.bookingsService.confirmBooking(id, req.user.id);
  }
}
