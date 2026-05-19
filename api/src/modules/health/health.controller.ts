import { Controller, Get, Logger } from '@nestjs/common';
import { HealthCheckService, HealthCheck, TypeOrmHealthIndicator } from '@nestjs/terminus';
import * as Sentry from '@sentry/nestjs';

@Controller('health')
export class HealthController {
  private readonly logger = new Logger(HealthController.name);

  constructor(
    private health: HealthCheckService,
    private db: TypeOrmHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.db.pingCheck('database'),
    ]);
  }

  @Get('test/message')
  testMessage() {
    this.logger.log('Enviando captureMessage de prueba');
    Sentry.captureMessage('Backend health test OK');
    return { status: 'ok', message: 'captureMessage enviado a Sentry' };
  }

  @Get('test/error')
  testError() {
    this.logger.log('Enviando captureException de prueba');
    try {
      throw new Error('Error de prueba desde /health/test/error');
    } catch (e) {
      Sentry.captureException(e);
    }
    return { status: 'ok', message: 'captureException enviado a Sentry' };
  }

  @Get('test/crash')
  testCrash() {
    this.logger.log('Enviando crash simulado a Sentry');
    try {
      throw new Error('Crash simulado desde /health/test/crash');
    } catch (e) {
      Sentry.captureException(e);
    }
    return { status: 'ok', message: 'captureException (crash simulado) enviado a Sentry' };
  }
}
