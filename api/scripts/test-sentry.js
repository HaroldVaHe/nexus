/**
 * Script independiente para probar Sentry desde terminal.
 * Uso: node scripts/test-sentry.js
 */
require('dotenv').config();

const Sentry = require('@sentry/nestjs');

const dsn = process.env.SENTRY_DSN;
if (!dsn) {
  console.error('❌ SENTRY_DSN no está definido en .env');
  process.exit(1);
}

Sentry.init({
  dsn,
  environment: process.env.NODE_ENV || 'development',
});

console.log('✅ Sentry inicializado');
console.log(`   DSN: ${dsn.slice(0, 40)}...`);
console.log('   Enviando mensaje de prueba...');

Sentry.captureMessage('Script test Sentry OK');

// Esperar a que Sentry termine de enviar antes de salir
Sentry.flush(5000).then(() => {
  console.log('✅ Mensaje enviado. Revisa sentry.io > Issues');
  process.exit(0);
}).catch(err => {
  console.error('❌ Error al enviar:', err.message);
  process.exit(1);
});
