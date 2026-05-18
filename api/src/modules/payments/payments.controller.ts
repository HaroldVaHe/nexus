import {
  Controller,
  Post,
  Body,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/roles.guard';
import { Roles } from '../../common/roles.decorator';
import { CreatePaymentPreferenceDto, VerifyPaymentDto } from './dto/payment.dto';

@ApiTags('payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('create-preference')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('passenger')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Crear preferencia de pago de Mercado Pago para una reserva' })
  @ApiResponse({
    status: 201,
    description: 'Preferencia creada correctamente',
    schema: {
      example: {
        checkout_url: 'https://www.mercadopago.com/checkout/v1/redirect?pref_id=123',
        sandbox_url: 'https://www.mercadopago.com/checkout/v1/redirect?pref_id=123&sandbox=true',
        preference_id: '123',
      },
    },
  })
  async createPreference(@Body() createDto: CreatePaymentPreferenceDto, @Req() req: any) {
    return this.paymentsService.createPreference(createDto, req.user);
  }

  @Post('verify')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('passenger')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Verificar el estado de un pago luego de redireccionar desde Mercado Pago' })
  @ApiResponse({ status: 200, description: 'Pago verificado correctamente' })
  async verifyPayment(@Body() verifyDto: VerifyPaymentDto, @Req() req: any) {
    return this.paymentsService.verifyPayment(verifyDto, req.user);
  }
}
