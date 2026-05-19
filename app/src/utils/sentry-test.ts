import * as Sentry from 'sentry-expo';

export function testSentryMessage() {
  Sentry.Native.captureMessage('Sentry frontend OK');
  console.log('[SentryTest] captureMessage sent');
}

export function testSentryError() {
  try {
    throw new Error('Error de prueba controlado');
  } catch (e) {
    Sentry.Native.captureException(e);
    console.log('[SentryTest] captureException sent');
  }
}

export function testSentryCrash() {
  throw new Error('Crash no controlado - Sentry');
}
