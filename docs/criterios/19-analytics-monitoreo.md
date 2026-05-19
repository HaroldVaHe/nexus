# 19. Analytics y Monitoreo — Para Dummies

## 1. ¿Qué es analytics y monitoreo?

Es un conjunto de herramientas que te permiten **saber qué está pasando con tu aplicación** en todo momento. Así como un carro tiene indicadores de velocidad, temperatura y combustible, una app necesita indicadores de errores, rendimiento y salud.

**Analytics:** Recopila datos sobre cómo usan la app los usuarios (qué pantallas visitan, cuánto tiempo pasan, dónde hacen clic).

**Monitoreo:** Vigila la salud técnica de la app (errores, tiempo de respuesta, disponibilidad).

## 2. ¿Por qué es importante?

- **Saber cuándo falla**: Si la app se cierra, quieres saberlo antes de que el usuario se queje
- **Entender al usuario**: Saber qué funciones usa más ayuda a priorizar mejoras
- **Detectar tendencias**: ¿Los errores aumentaron después de la última actualización?
- **Disponibilidad**: Si el servidor está caído, quieres una alerta inmediata
- **Depuración remota**: Ver el stack trace exacto del error sin tener el teléfono del usuario

## 3. ¿Cómo se hace en la práctica?

Nexus usa **3 herramientas** que trabajan juntas:

```
┌──────────────────────┐     ┌──────────────────────────┐
│   FRONTEND (Expo)    │     │    BACKEND (NestJS)       │
│                      │     │                            │
│  Sentry (crash       │────▶│  Sentry (errores API)      │
│  reporting)          │     │                            │
│                      │     │  Winston (logs archivos)   │
│                      │     │                            │
│                      │     │  Health Check (/health)    │
└──────────────────────┘     └──────────────────────────┘
```

### 3.1 Sentry — Cazador de errores automático

Sentry es un servicio web que **atrapa automáticamente** todos los errores y crashes. Cuando la app falla, Sentry registra:
- En qué archivo y línea ocurrió
- En qué dispositivo (Android/iOS, versión, modelo)
- En qué pantalla estaba el usuario
- Los logs anteriores al error (breadcrumbs)

**Frontend:** `app/app/_layout.tsx`
```typescript
Sentry.init({
  dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
  enableInExpoDevelopment: true,
  tracesSampleRate: 0.1,
});
```

**Backend:** `api/src/main.ts`
```typescript
if (process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV || 'development',
  });
}
```

### 3.2 Winston — Bitácora del servidor

Winston es una librería que **escribe en archivos** todo lo que pasa en el servidor:

- `api/logs/error.log` — Solo errores
- `api/logs/combined.log` — Todo (info, warn, error)

Cada línea es un JSON con timestamp, nivel, mensaje y contexto.

Configuración en `api/src/common/logger/logger.config.ts`.
En producción solo se guardan `error`, `warn` y `log` (sin debug).

### 3.3 Health Check — ¿El servidor está vivo?

Un endpoint simple que responde "sí, estoy vivo" o "no, algo falló":

```
GET /api/v1/health
```

Respuesta exitosa:
```json
{ "status": "ok", "info": { "database": { "status": "up" } } }
```

Respuesta fallida (BD caída):
```json
{ "status": "error", "error": { "database": { "status": "down" } } }
```

## 4. Estado actual en Nexus

| Herramienta | Estado | Archivos |
|---|---|---|
| **Sentry Frontend** | ✅ | `app/app/_layout.tsx`, `app/src/utils/config.ts`, `app/src/utils/sentry-test.ts` |
| **Sentry Backend** | ✅ | `api/src/main.ts`, dependencia `@sentry/nestjs` |
| **Winston logs** | ✅ | `api/src/common/logger/logger.config.ts` |
| **Health Check** | ✅ | `api/src/modules/health/health.controller.ts` |
| **Endpoints de prueba Sentry** | ✅ | `GET /health/test/message`, `/test/error`, `/test/crash` |
| **Pantalla Test Sentry** | ✅ | `app/app/sentry-test.tsx` (Settings > About > Developer) |
| **Google Analytics / Firebase** | ❌ | No hay analytics de uso de la app |
| **Alertas automáticas** | ❌ | No hay configuración de alertas en Sentry |

### 4.1 Archivos clave

| Archivo | Rol |
|---|---|
| `api/src/main.ts` | Inicializa Sentry al arrancar el servidor |
| `api/src/modules/health/health.controller.ts` | Endpoint de health check + pruebas de Sentry |
| `api/src/common/logger/logger.config.ts` | Configuración de Winston (archivos, formato, colores) |
| `api/scripts/test-sentry.js` | Script independiente para probar Sentry |
| `app/app/_layout.tsx` | Inicializa Sentry y envuelve app con ErrorBoundary |
| `app/src/utils/sentry-test.ts` | Funciones de prueba (message, error, crash) |
| `app/app/sentry-test.tsx` | Pantalla con botones para probar Sentry |

### 4.2 Cómo probar que funciona

**Probar Sentry en frontend:**
1. Abre la app, ve a Perfil > Settings > About > Test Sentry
2. Toca los botones para enviar mensaje, error o crash simulado
3. Revisa en [sentry.io](https://sentry.io) que aparezcan los eventos

**Probar Sentry en backend:**
```bash
curl http://localhost:3000/api/v1/health/test/message
curl http://localhost:3000/api/v1/health/test/error
curl http://localhost:3000/api/v1/health/test/crash
```

**Probar Health Check:**
```bash
curl http://localhost:3000/api/v1/health
```

**Ver logs de Winston:**
```bash
tail -f api/logs/combined.log
```

### 4.3 Lo que falta

- **Analytics de uso**: No hay Google Analytics, Firebase Analytics ni similar para entender cómo usan la app los usuarios
- **Alertas proactivas**: Sentry puede enviar emails/Slack cuando ocurren errores críticos, pero no está configurado
- **Monitoreo de uptime**: Un servicio como UptimeRobot que verifique el health check cada 5 minutos y alerte si está caído
- **Dashboards**: No hay un dashboard centralizado que muestre el estado de todos los servicios

### 4.4 Variables de entorno para monitoreo

```env
# En .env del backend
SENTRY_DSN=https://...@ingest.sentry.io/...
SENTRY_TRACES_SAMPLE_RATE=0.1

# En la app (config.ts)
SENTRY_DSN: process.env.EXPO_PUBLIC_SENTRY_DSN
```

## Resumen

De las 3 herramientas de monitoreo (Sentry, Winston, Health Check), todas están implementadas y funcionales. Sentry captura errores en frontend y backend, Winston guarda logs en archivos, y Health Check permite verificar que el servidor responde. Lo que falta es analytics de uso (Google/Firebase) y alertas automáticas.
