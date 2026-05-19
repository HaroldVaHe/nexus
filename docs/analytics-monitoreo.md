# 📊 Analytics & Monitoreo — Nexus

> **Para quién**: Desarrolladores, testers, y cualquier persona que quiera entender cómo se monitorea la app.
> **Propósito**: Saber cuándo la app falla, qué falló, y poder arreglarlo antes de que el usuario se queje.

---

## Índice

1. [¿Qué es esto y por qué existe?](#1-qué-es-esto-y-por-qué-existe)
2. [Glosario para dummies](#2-glosario-para-dummies)
3. [Diagrama general](#3-diagrama-general)
4. [Sentry — Crash Reporting](#4-sentry--crash-reporting)
5. [Winston — Logs del Backend](#5-winston--logs-del-backend)
6. [Health Check — ¿El servidor está vivo?](#6-health-check--el-servidor-está-vivo)
7. [Cómo probar que todo funciona](#7-cómo-probar-que-todo-funciona)
8. [Archivos creados/modificados](#8-archivos-creadosmodificados)
9. [Solución de problemas](#9-solución-de-problemas)

---

## 1. ¿Qué es esto y por qué existe?

### El problema

Imagina que lanzas la app y un usuario te dice: *"la app se me cerró sola"*. ¿Qué haces? No sabes:

- ¿Fue en Android o iOS?
- ¿En qué pantalla estaba?
- ¿Qué error apareció?
- ¿Fue un error de código o de conexión?

Sin herramientas de monitoreo, estás **ciego**. Tienes que esperar a que el usuario te dé detalles, y generalmente no los da.

### La solución

Implementamos **3 herramientas** que trabajan juntas:

| Herramienta | ¿Qué hace? | ¿Dónde? |
|---|---|---|
| **Sentry** | Atrapa errores y crashes automáticamente y los reporta | Frontend (app) + Backend (API) |
| **Winston** | Guarda un historial de todo lo que pasa en el servidor | Backend (API) |
| **Health Check** | Un "¿estás vivo?" que responde rápido | Backend (API) |

---

## 2. Glosario para dummies

| Término | Significado |
|---|---|
| **Crash** | La app se cierra inesperadamente |
| **Error no controlado** | Un error que el programador no previó y no atrapó con `try/catch` |
| **Stack trace** | La "huella digital" del error: dice exactamente en qué archivo y línea pasó |
| **Issue** | Un problema reportado en Sentry (puede ser 1 error que ocurrió 50 veces) |
| **Evento** | Cada vez que ocurre un error, es 1 evento |
| **Log** | Un mensaje de texto que dice "esto pasó a esta hora" |
| **DSN** | La dirección única de tu proyecto en Sentry (como una dirección de casa) |
| **Flush** | Forzar el envío de datos pendientes antes de salir |

---

## 3. Diagrama general

```
┌─────────────────────────────────────────────────────────────┐
│                     USUARIO                                  │
│  (usa la app en su celular)                                  │
└──────────┬──────────────────────────────────────┬──────────┘
           │                                      │
           ▼                                      ▼
┌──────────────────────┐           ┌──────────────────────────┐
│   FRONTEND (Expo)    │           │    BACKEND (NestJS)       │
│                      │           │                            │
│  sentry-expo         │           │  @sentry/nestjs           │
│  (atrapa crashes)    │           │  (atrapa errores API)      │
│                      │           │                            │
│  Envía a:            │──────────▶│  Winston                   │
│  sentry.io           │  HTTP     │  (guarda logs en archivos) │
│                      │           │                            │
│                      │           │  Health Check              │
│                      │           │  (responde GET /health)    │
└──────────────────────┘           └──────────────────────────┘
                                           │
                                           ▼
                                   ┌────────────────┐
                                   │   sentry.io     │
                                   │ (dashboard web) │
                                   └────────────────┘
```

---

## 4. Sentry — Crash Reporting

### 4.1 ¿Qué es Sentry?

Sentry es un servicio web (como Gmail, pero para errores) que recolecta **automáticamente** todos los errores y crashes de tu app. Puedes verlos en un dashboard ordenado por gravedad y frecuencia.

### 4.2 ¿Qué captura?

| Tipo | ¿Captura? |
|---|---|
| Error de JavaScript (app) | ✅ Sí — `ReferenceError`, `TypeError`, etc. |
| Crash nativo (Android/iOS) | ✅ Sí — pero requiere build nativo (EAS Build) |
| Error en API (backend) | ✅ Sí — `throw new Error(...)` en NestJS |
| Error de red | ✅ Sí — si se lanza como excepción |
| Errores de lógica atrapados | ✅ Sí — si usas `Sentry.captureException()` |

### 4.3 ¿Cómo se ve en el código?

#### Frontend (`app/app/_layout.tsx`)

```typescript
// 1. Inicializar Sentry al arrancar la app
Sentry.init({
  dsn: 'https://...@ingest.sentry.io/...', // la dirección del proyecto
  enableInExpoDevelopment: true,            // para que funcione en desarrollo
  tracesSampleRate: 0.1,                    // 10% de las sesiones tienen trazas
});

// 2. Envolver la app con ErrorBoundary
//     (atrapa errores no controlados automáticamente)
if (CONFIG.SENTRY_DSN) {
  return <Sentry.Native.ErrorBoundary>{content}</Sentry.Native.ErrorBoundary>;
}
```

#### Backend (`api/src/main.ts`)

```typescript
// 1. Inicializar Sentry
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV || 'development',
});

// 2. Cada vez que ocurre un error no controlado en la API,
//    Sentry lo captura automáticamente
```

### 4.4 Enviar eventos manualmente

```typescript
// Mensaje informativo (no es error, solo aviso)
Sentry.captureMessage('Algo importante pasó');

// Error controlado (lo atrapaste con try/catch)
try {
  algoPeligroso();
} catch (e) {
  Sentry.captureException(e);
}
```

### 4.5 ¿Dónde ver los errores?

1. Ve a **[sentry.io](https://sentry.io)**
2. Inicia sesión con la cuenta de **unisabana-hn**
3. En el menú izquierdo, haz clic en **Issues**
4. Ahí ves todos los errores ordenados por frecuencia

Cada "Issue" te muestra:
- Cuántas veces ocurrió
- En qué dispositivo (Android/iOS, versión, modelo)
- En qué pantalla
- El stack trace exacto (archivo:línea)
- Los logs anteriores al error (breadcrumbs)

---

## 5. Winston — Logs del Backend

### 5.1 ¿Qué es Winston?

Winston es una librería que **escribe en archivos** todo lo que pasa en el servidor. A diferencia de `console.log`, Winston:

- Guarda los mensajes en **archivos rotados por día**
- Separa **errores** de **logs normales**
- Da **formato JSON** para que sea fácil de procesar
- Muestra **colores** en la consola de desarrollo

### 5.2 ¿Dónde se guardan los logs?

En la carpeta `api/logs/`:

```
api/
├── logs/
│   ├── error.log        ← Solo errores (cada línea es un JSON)
│   └── combined.log     ← Todo (info, warn, error)
```

Cada línea es un JSON como este:

```json
{
  "timestamp": "2026-05-19T10:30:00.000Z",
  "level": "error",
  "message": "Error al crear viaje",
  "context": "TripsController"
}
```

### 5.3 ¿Cómo se usa?

#### En desarrollo — Consola colorizada:

```
2026-05-19 [TripsController] ERROR: Error al crear viaje
2026-05-19 [AuthService]      INFO: Usuario registrado exitosamente
2026-05-19 [Bootstrap]        LOG: Nexus API running on http://localhost:3000
```

#### En producción — Buffer de logs (solo `error`, `warn`, `log` por eficiencia)

```typescript
logger: process.env.NODE_ENV === 'production'
  ? ['error', 'warn', 'log']  // silencia 'debug' y 'verbose'
  : loggerConfig,             // en desarrollo usa Winston completo
```

### 5.4 Usar logs en un servicio

```typescript
// En cualquier servicio de NestJS:
private readonly logger = new Logger(TripsService.name);

this.logger.log(`Usuario ${userId} creó un viaje`);
this.logger.error(`Error al procesar pago: ${error.message}`);
this.logger.warn(`Intento de acceso sin token`);
```

---

## 6. Health Check — ¿El servidor está vivo?

### 6.1 ¿Qué es?

Un endpoint simple que responde "sí, estoy vivo" o "no, algo falló".

### 6.2 ¿Cómo se usa?

```
GET http://localhost:3000/api/v1/health
```

Respuesta exitosa:

```json
{
  "status": "ok",
  "info": {
    "database": {
      "status": "up"
    }
  }
}
```

Respuesta fallida (base de datos caída):

```json
{
  "status": "error",
  "error": {
    "database": {
      "status": "down",
      "message": "ECONNREFUSED"
    }
  }
}
```

### 6.3 ¿Para qué sirve?

- **Servicios de monitoreo** (UptimeRobot, Pingdom, etc.) pueden pegarle cada 5 minutos
- **Docker/Kubernetes** lo usan para saber si el contenedor está sano
- **Tú** puedes saber rápido si el servidor responde antes de investigar más

---

## 7. Cómo probar que todo funciona

### 7.1 Probar Sentry en la app (Frontend)

1. Abre la app en el celular/emulador
2. Ve a **Settings > About > Developer > Test Sentry**
3. Verás 3 botones:

| Botón | Qué hace |
|---|---|
| 🟢 **Enviar mensaje info** | Manda `captureMessage` a Sentry |
| 🟡 **Enviar error controlado** | Manda `captureException` a Sentry |
| 🔴 **Crashear app** | Lanza un error no controlado |

### 7.2 Probar Sentry en la API (Backend)

Con el servidor corriendo:

```bash
# Mensaje informativo
curl http://localhost:3000/api/v1/health/test/message

# Error controlado
curl http://localhost:3000/api/v1/health/test/error

# Crash simulado
curl http://localhost:3000/api/v1/health/test/crash
```

### 7.3 Probar con script autónomo

```bash
cd api
node scripts/test-sentry.js
```

### 7.4 Probar Health Check

```bash
curl http://localhost:3000/api/v1/health
```

### 7.5 Ver los logs de Winston

```bash
# Ver errores
cat api/logs/error.log

# Ver todos los logs
cat api/logs/combined.log

# Seguir en tiempo real (tail)
tail -f api/logs/combined.log
```

### 7.6 Verificar en Sentry.io

Después de cada prueba:

1. Ve a **[sentry.io](https://sentry.io)**
2. Menú izquierdo > **Issues**
3. Deberías ver los eventos que acabas de enviar
4. Haz clic en uno para ver el stack trace, dispositivo, etc.

---

## 8. Archivos creados/modificados

### Backend

| Archivo | Rol |
|---|---|
| `api/src/main.ts` | Inicializa Sentry al arrancar. Si hay `SENTRY_DSN`, captura errores. |
| `api/src/modules/health/health.controller.ts` | Endpoints de health check + tests de Sentry |
| `api/src/modules/health/health.module.ts` | Módulo NestJS para health check |
| `api/src/common/logger/logger.config.ts` | Configuración de Winston (colores, archivos, formato) |
| `api/scripts/test-sentry.js` | Script independiente para probar Sentry desde terminal |
| `api/.env` | `SENTRY_DSN` y `SENTRY_TRACES_SAMPLE_RATE` |
| `api/.env.example` | Lo mismo pero sin valores reales (para otros desarrolladores) |
| `api/src/app.module.ts` | Importa HealthModule |

### Frontend

| Archivo | Rol |
|---|---|
| `app/app/_layout.tsx` | Inicializa Sentry y envuelve la app con ErrorBoundary |
| `app/src/utils/config.ts` | Guarda el DSN de Sentry |
| `app/src/utils/sentry-test.ts` | Funciones de prueba (message, error, crash) |
| `app/app/sentry-test.tsx` | Pantalla con botones para probar Sentry |
| `app/app/settings/about.tsx` | Botón "Test Sentry" en sección Developer |
| `app/sentry.properties` | Configuración del plugin Sentry para Expo |
| `app/app.json` | Plugin `@sentry/react-native/expo` registrado |

---

## 9. Solución de problemas

### "No veo los eventos en Sentry"

| Posible causa | Solución |
|---|---|
| `SENTRY_DSN` está vacío | Revisa `api/.env` y `app/src/utils/config.ts` |
| Expo en desarrollo | Asegúrate de `enableInExpoDevelopment: true` en `_layout.tsx` |
| Sin internet | El emulador/teléfono necesita conexión |
| El script sale antes de enviar | Debe tener `Sentry.flush()` (ya lo tiene) |
| Filtro de Issues | En Sentry, revisa que no haya filtros activos (por nivel, por fecha) |

### "Error: `@sentry/react-native/expo` plugin not found"

Ejecuta:

```bash
cd app
npm install
```

### "El health check responde 500"

La base de datos no está corriendo. Inicia PostgreSQL:

```bash
sudo service postgresql start
# O desde Windows: abre pgAdmin o corre pg_ctl start
```

### "No entiendo cómo llegar a la pantalla de Test Sentry"

1. Abre la app
2. Ve a la pestaña **Perfil** (último ícono en la barra inferior)
3. Toca el engranaje ⚙️ (Settings)
4. Toca **Acerca de** (About)
5. Desplázate al final
6. Sección **Developer** > **Test Sentry**

---

## Resumen en 1 párrafo

> **Sentry** atrapa los errores automáticamente y los muestra en un dashboard web para que sepas qué falló y en qué dispositivo. **Winston** guarda un historial detallado de todo lo que pasa en el servidor en archivos de texto. **Health Check** es un endpoint simple que responde "sí, estoy vivo". Con estas 3 herramientas, cuando un usuario reporte un error, ya tienes toda la información para arreglarlo sin tener que preguntarle nada.

---

*Documento generado el 19 de mayo de 2026 — Proyecto Nexus, Universidad de La Sabana*
