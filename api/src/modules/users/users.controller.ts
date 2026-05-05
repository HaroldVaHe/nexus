import { Controller, Get, Put, Body, Param, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/roles.guard';
import { Roles } from '../../common/roles.decorator';

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async getProfile(@Req() req: any) {
    return this.usersService.getProfile(req.user.id);
  }

  @Roles('driver', 'passenger')
  @Get()
  async getAll() {
    return this.usersService.getAll();
  }

  @Roles('driver', 'passenger')
  @Put(':id')
  async updateProfile(
    @Param('id') id: string,
    @Body() updateData: Partial<any>,
  ) {
    return this.usersService.updateProfile(id, updateData);
  }
}
