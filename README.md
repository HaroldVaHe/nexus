# Nexus — Carpooling Universitario

Aplicación de carpooling para la **Universidad de La Sabana**. Conecta estudiantes que comparten trayectos en el corredor Chía-Bogotá de forma segura, eficiente e incentivada.

---

## Stack Tecnológico

| Capa | Tecnología | Versión |
|---|---|---|
| **Frontend** | React Native + Expo | SDK 54 / RN 0.81.5 |
| **Lenguaje** | TypeScript | 5.9 |
| **Backend** | NestJS + TypeORM | NestJS 10 / Node 24 |
| **Base de datos** | PostgreSQL 16 | — |
| **Autenticación** | JWT + bcrypt | — |
| **Pagos** | Mercado Pago (sandbox) | — |
| **Monitoreo** | Sentry + Winston | — |
| **Contenerización** | Docker + Docker Compose | Postgres + JMeter |

---

## Estructura del Proyecto

```
nexus/
├── api/                         # Backend NestJS
│   ├── src/
│   │   ├── main.ts              # Entrypoint (Sentry + Winston + Swagger)
│   │   ├── app.module.ts        # Módulo raíz
│   │   ├── common/              # Guards, decorators, logger
│   │   ├── config/              # database.config.ts
│   │   ├── database/            # Entities + data-source.ts
│   │   └── modules/
│   │       ├── auth/            # Registro, login, JWT
│   │       ├── bookings/        # Reservas de viajes
│   │       ├── cards/           # Tarjetas guardadas
│   │       ├── health/          # Health check + Sentry test endpoints
│   │       ├── notifications/   # Notificaciones (stub)
│   │       ├── payments/        # Pagos + Mercado Pago
│   │       ├── reviews/         # Calificaciones
│   │       ├── sabana-coins/    # Monedero virtual
│   │       ├── trips/           # Viajes CRUD + búsqueda
│   │       ├── users/           # Perfiles
│   │       └── vehicles/        # Vehículos de conductores
│   ├── scripts/
│   │   ├── test-sentry.js       # Prueba autónoma de Sentry
│   │   ├── simulate-payment-traffic.js  # Simulador de carga
│   │   └── create-test-jwt.js   # Generador de tokens de prueba
│   ├── logs/                    # Logs de Winston (error.log + combined.log)
│   ├── .env                     # Variables de entorno (no trackear)
│   └── .env.example
├── app/                         # Frontend React Native / Expo
│   ├── app/                     # Pantallas (expo-router)
│   │   ├── (auth)/              # Login, registro
│   │   ├── (tabs)/              # Home, search, publish, profile
│   │   ├── payments/            # Tarjetas, agregar tarjeta
│   │   ├── settings/            # Seguridad, pagos, notificaciones, etc.
│   │   ├── trip/[id].tsx        # Detalle de viaje
│   │   ├── report/              # Reporte de usuarios
│   │   ├── help.tsx             # Centro de ayuda
│   │   ├── my-vehicles.tsx      # Mis vehículos
│   │   └── sentry-test.tsx      # Pantalla de pruebas Sentry
│   ├── src/
│   │   ├── api/                 # Clientes HTTP (auth, trips, cards, etc.)
│   │   ├── components/          # Componentes reutilizables
│   │   ├── context/             # AuthContext, SettingsContext
│   │   ├── hooks/               # useTheme, etc.
│   │   ├── i18n/                # Traducciones (es/en)
│   │   ├── theme/               # colors.ts, spacing, tipografía
│   │   └── utils/               # config.ts, sentry-test.ts
│   ├── sentry.properties        # Config nativa Sentry
│   └── app.json                 # Config Expo (plugins, icon, etc.)
├── database/
│   └── schema.sql               # Esquema completo DB (11 tablas + 3 vistas)
├── jmeter/
│   ├── payment-verify.jmx       # Plan de pruebas JMeter
│   └── README.md
├── docker-compose.yaml          # Postgres + JMeter
├── docs/
│   └── criterios/               # 23 guías de los criterios de diseño
├── 1.1 Definición del Problema.docx
├── 1.2 Buyer Persona.docx
├── 1.3 Propuesta de Valor.docx
├── 1.4 Alcance MVP.docx
└── 3.1 Stack Tecnologico.docx
```

---

## Requisitos Previos

- **Node.js** >= 18 (en Windows) o Node 24+
- **PostgreSQL** >= 16.x
- **npm** >= 9.x
- **Expo Go** en tu dispositivo o un emulador Android/iOS

> ⚠️ **WSL**: Node.js está instalado solo en Windows. Usa la ruta completa:
> ```bash
> "/mnt/c/Program Files/nodejs/node.exe" "C:\\Program Files\\nodejs\\node_modules\\npm\\bin\\npm-cli.js" install
> ```

---

## Instalación y Configuración

### 1. Base de datos

```bash
psql -U postgres -c "CREATE DATABASE nexus;"
psql -U postgres -d nexus -f database/schema.sql
```

### 2. Backend (API)

```bash
cd api
npm install
cp .env.example .env
# Editar .env con tus credenciales de PostgreSQL y Mercado Pago
npm run start:dev
```

El API estará en `http://localhost:3000/api/v1` — Documentación Swagger en `/api/v1/docs`.

### 3. Frontend (App)

```bash
cd app
npm install
npx expo start
```

Escanea el QR con **Expo Go** o presiona `a` (Android) / `i` (iOS).

### 4. Configurar URL del API

En `app/src/utils/config.ts`, cambia la IP local:

```typescript
BASE_URL: __DEV__
  ? 'http://192.168.1.X:3000/api/v1'  // ← Tu IP local
  : 'https://api.nexus.unisabana.edu.co/api/v1',
```

Para encontrar tu IP: `ipconfig` (Windows) o `ifconfig` (Mac/Linux).

---

## Comandos Útiles

### Backend (`api/`)

| Comando | Qué hace |
|---|---|
| `npm run start:dev` | Desarrollo con hot-reload |
| `npm run build` | Compilar TS → JS |
| `npm run start:prod` | Ejecutar build de producción |
| `npm run traffic:payments` | Simular tráfico de pagos |
| `npm run traffic:jmeter` | JMeter vía Docker |
| `npm run schema:sync` | Sincronizar entidades TypeORM con DB |

### Frontend (`app/`)

| Comando | Qué hace |
|---|---|
| `npx expo start` | Servidor de desarrollo |
| `npx expo start --clear` | Resetear caché Metro |
| `npx expo start --web` | Abrir en navegador |
| `npx expo prebuild` | Generar proyectos nativos (ios/android) |

### Sentry

```bash
cd api && node scripts/test-sentry.js
curl http://localhost:3000/api/v1/health/test/message
curl http://localhost:3000/api/v1/health/test/error
```

---

## Endpoints del API

| Método | Endpoint | Descripción |
|---|---|---|
| POST | `/api/v1/auth/register` | Registro con email institucional |
| POST | `/api/v1/auth/login` | Login con JWT |
| GET | `/api/v1/health` | Health check (status + DB) |
| GET | `/api/v1/health/test/message` | Enviar test a Sentry (captureMessage) |
| GET | `/api/v1/health/test/error` | Enviar test a Sentry (captureException) |
| GET | `/api/v1/trips` | Listar viajes disponibles |
| POST | `/api/v1/trips` | Crear un viaje |
| GET | `/api/v1/trips/:id` | Detalle de un viaje |
| POST | `/api/v1/bookings` | Reservar asiento |
| GET | `/api/v1/bookings` | Mis reservas |
| POST | `/api/v1/cards` | Agregar tarjeta |
| GET | `/api/v1/cards` | Listar tarjetas guardadas |
| DELETE | `/api/v1/cards/:id` | Eliminar tarjeta |
| POST | `/api/v1/payments` | Procesar pago |
| GET | `/api/v1/reviews/:userId` | Calificaciones de un usuario |
| POST | `/api/v1/reviews` | Calificar viaje |
| GET | `/api/v1/sabana-coins/balance` | Saldo de Sabana Coins |
| POST | `/api/v1/sabana-coins/redeem` | Canjear Sabana Coins |
| GET | `/api/v1/users/profile` | Perfil del usuario |
| GET | `/api/v1/vehicles` | Mis vehículos |
| POST | `/api/v1/vehicles` | Agregar vehículo |

Documentación interactiva: `http://localhost:3000/api/v1/docs` (Swagger UI).

---

## Analytics & Monitoreo

### Sentry (Crash Reporting)

- **Frontend**: `sentry-expo` captura errores no controlados + `Sentry.ErrorBoundary`
- **Backend**: `@sentry/nestjs` captura excepciones de la API
- DSN configurado en `api/.env` y `app/src/utils/config.ts`
- Dashboard: [sentry.io](https://sentry.io) (org: unisabana-hn)

### Winston (Logs)

- Logs colorizados en consola (desarrollo)
- Archivos rotados diariamente: `api/logs/error.log` y `api/logs/combined.log`
- Formato JSON para procesamiento automático

### Health Check

```
GET /api/v1/health
→ { "status": "ok", "info": { "database": { "status": "up" } } }
```

---

## Pruebas de Carga

```bash
# Simulador Node.js (100 usuarios concurrentes)
cd api && npm run traffic:payments

# JMeter vía Docker con reporte HTML
cd api && npm run traffic:jmeter
```

Resultados en `jmeter/results/` con percentiles P50/P95/max.

---

## Documentación de Diseño

Los criterios de diseño están documentados en `docs/criterios/` (23 archivos MD). Los documentos fuente originales están en la raíz como `.docx`:

| Archivo | Contenido |
|---|---|
| `1.1 Definición del Problema.docx` | Contexto, problema, reto y solución |
| `1.2 Buyer Persona.docx` | Perfiles de pasajero y conductor |
| `1.3 Propuesta de Valor.docx` | 5 pilares diferenciales |
| `1.4 Alcance MVP.docx` | 8 Must Have cerrados (MoSCoW) |
| `3.1 Stack Tecnologico.docx` | Justificación del stack completo |

> Para extraer texto de los `.docx` (sin Word):
> ```python
> python3 -c "import zipfile, xml.etree.ElementTree as ET; z=zipfile.ZipFile('archivo.docx'); r=ET.fromstring(z.read('word/document.xml')); print('\n'.join(t.text for t in r.iter('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}t') if t.text))"
> ```

---

## Estado del Proyecto

### ✅ Implementado
- Backend completo: auth, trips, bookings, payments, reviews, sabana-coins, vehicles, cards, health
- Frontend conectado a APIs reales (auth, trips, bookings, payments, cards, sabana-coins, vehicles, users)
- Autenticación JWT con validación de dominio `@unisabana.edu.co`
- Mercado Pago (pagos con tarjeta + PSE vía MP)
- Sabana Coins (monedero virtual)
- Gestión de tarjetas guardadas (agregar, listar, eliminar, default)
- Sentry (frontend + backend) + Winston logs + Health Check
- Pruebas de carga con JMeter
- Safe area insets para notch/barra de estado (iOS + Android)
- Roles de usuario (passenger/driver) con navegación condicional

### 🟡 Parcial
- Reportes de usuario (UI completa, datos mock, sin backend)
- Microsoft OAuth (stub — devuelve mock)
- Mapas (Leaflet en web, falta Google Maps en móvil)
- Notificaciones push (módulo existe, sin implementar)
- Protección de datos (menús UI sin contenido legal, sin Habeas Data)

### ❌ Pendiente
- Pruebas unitarias
- Despliegue producción (Dockerfile, CI/CD, SSL, nginx)
- Backup & recovery de DB
- Diagramas User Flow / Wireframes formales

---

## Reglas Críticas

1. **No activar `synchronize: true`** en TypeORM. El schema está en `database/schema.sql` y se aplica manualmente.
2. **Solo emails `@unisabana.edu.co`** — validado en `auth.service.ts`.
3. **Auth response plana** — El backend nunca devuelve `{ user: {...} }`. Devuelve `{ accessToken, id, email, full_name, ... }`.
4. **Sentry en desarrollo** necesita `enableInExpoDevelopment: true` en `Sentry.init()`.
5. **Los .docx** se pueden leer con Python 3 + zipfile (no necesitas Word).

---

*Universidad de La Sabana — Capstone Design Project — Mayo 2026*
