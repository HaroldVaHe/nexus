# 13. Implementación del Core — Para Dummies

## 1. ¿Qué es la "implementación del core"?

El "core" de una aplicación es el conjunto de funcionalidades principales sin las cuales el producto no tiene sentido. Es como el motor de un carro: puedes cambiarle los asientos o el color, pero sin motor no anda.

En Nexus, el core es todo lo necesario para que un estudiante de la Universidad de La Sabana pueda:
1. Registrarse e iniciar sesión
2. Publicar un viaje (conductor)
3. Buscar y reservar un viaje (pasajero)
4. Pagar por el viaje
5. Calificar al conductor/pasajero

## 2. ¿Por qué es importante?

- **Define el MVP** (Producto Mínimo Viable): Lo mínimo que debe funcionar para que la app sea útil
- **Prioriza el desarrollo**: Si no está en el core, puede esperar
- **Enfoca las pruebas**: Lo que más se usa debe estar más probado
- **Evita distraerse con funcionalidades secundarias**

## 3. ¿Cómo se organiza en Nexus?

Nexus sigue una **arquitectura modular** en el backend (NestJS). Cada funcionalidad vive en su propio módulo dentro de `api/src/modules/`.

### 3.1 Autenticación (Auth) — `api/src/modules/auth/`

**¿Qué hace?**
- Registro de usuarios con email `@unisabana.edu.co`
- Inicio de sesión con email/contraseña
- Autenticación con Microsoft OAuth (parcial)
- Generación de tokens JWT
- Validación de dominio institucional

**Archivos clave:**
- `auth.service.ts` — Lógica: validar email, crear usuario, generar JWT
- `auth.controller.ts` — Endpoints: `POST /auth/register`, `POST /auth/login`, `POST /auth/microsoft`, `POST /auth/verify-domain`
- `jwt.strategy.ts` — Estrategia de Passport para validar tokens

### 3.2 Viajes (Trips) — `api/src/modules/trips/`

**¿Qué hace?**
- Publicar un viaje (origen, destino, hora, precio, asientos)
- Buscar viajes por origen, destino, fecha, asientos disponibles
- Ver detalle de un viaje
- Cancelar o modificar un viaje
- Listar viajes propios

**Archivos clave:**
- `trips.service.ts` — CRUD completo + búsqueda con filtros
- `trips.controller.ts` — Endpoints RESTful

### 3.3 Reservas (Bookings) — `api/src/modules/bookings/`

**¿Qué hace?**
- Solicitar reserva de asiento (pasajero)
- Confirmar o rechazar reserva (conductor)
- Cancelar reserva
- Listar reservas propias (como pasajero o conductor)

**Archivos clave:**
- `bookings.service.ts` — Lógica de reservas
- `bookings.controller.ts` — Endpoints

### 3.4 Pagos (Payments) — `api/src/modules/payments/`

**¿Qué hace?**
- Crear preferencia de pago en Mercado Pago
- Verificar estado del pago al regresar de la pasarela
- Consultar pagos por reserva

**Archivos clave:**
- `payments.service.ts` — Integración con Mercado Pago SDK
- `payments.controller.ts` — `POST /payments/create-preference`, `POST /payments/verify`

### 3.5 Sabana Coins — `api/src/modules/sabana-coins/`

**¿Qué hace?**
- Consultar saldo de monedas virtuales
- Ver historial de transacciones (ledger)
- Agregar y gastar monedas

**Archivos clave:**
- `sabana-coins.service.ts` — Lógica de monedero virtual
- Se usa materialized view `user_sabana_coins_balance` en BD

### 3.6 Vehículos (Vehicles) — `api/src/modules/vehicles/`

**¿Qué hace?**
- Registrar vehículo (marca, modelo, color, placa)
- Editar y eliminar vehículo
- Listar mis vehículos

**Archivos clave:**
- `vehicles.service.ts` — CRUD de vehículos

### 3.7 Tarjetas guardadas (Cards) — `api/src/modules/cards/`

**¿Qué hace?**
- Guardar referencia de tarjeta para pagos rápidos
- Validar fecha de vencimiento
- Definir tarjeta por defecto

**Archivos clave:**
- `cards.service.ts` — CRUD de tarjetas guardadas

### 3.8 Usuarios (Users) — `api/src/modules/users/`

**¿Qué hace?**
- Ver perfil propio
- Actualizar perfil (nombre, facultad, teléfono)
- Cambiar roles (conductor/pasajero)
- Consultar rutas frecuentes

**Archivos clave:**
- `users.service.ts` — Gestión de perfiles y rutas frecuentes

### 3.9 Reseñas (Reviews) — `api/src/modules/reviews/`

**¿Qué hace?**
- Calificar a conductor/pasajero después de un viaje
- Comentarios con tags predefinidos (puntual, amable, seguro, etc.)

**Archivos clave:**
- `reviews.service.ts` — Lógica de calificaciones

### 3.10 Notificaciones — `api/src/modules/notifications/`

**¿Qué hace?**
- Crear notificaciones en BD
- Listar notificaciones del usuario
- Marcar como leídas
- Tipos: confirmación/cancelación de reserva, pago, calificación, etc.

**Archivos clave:**
- `notifications.service.ts` — CRUD de notificaciones en BD

### 3.11 Frontend — `app/`

Cada módulo del backend tiene su contraparte en el frontend:

| API Client | Pantalla(s) | Backend Module |
|---|---|---|
| `app/src/api/auth.ts` | Login, Register | Auth |
| `app/src/api/trips.ts` | Publicar viaje, Buscar, Detalle | Trips |
| `app/src/api/bookings.ts` | Mis reservas, Solicitudes | Bookings |
| `app/src/api/payments.ts` | Pago (webview Mercado Pago) | Payments |
| `app/src/api/vehicles.ts` | Mis vehículos | Vehicles |
| `app/src/api/cards.ts` | Mis tarjetas | Cards |
| `app/src/api/users.ts` | Perfil | Users |
| `app/src/api/routes.ts` | Rutas frecuentes | Users |
| `app/src/api/sabana-coins.ts` | Sabana Coins | SabanaCoins |

## 4. Estado actual en Nexus

| Módulo | Backend | Frontend | Integración real |
|---|---|---|---|
| **Auth** (registro/login) | ✅ Completo | ✅ Completo | ✅ JWT, dominio institucional |
| **Auth** (Microsoft OAuth) | 🟡 Stub — `verifyMicrosoftToken` devuelve mock email | 🟡 Botón existe, no funcional | ❌ Sin registro en Azure AD |
| **Trips** (CRUD + búsqueda) | ✅ Completo | ✅ Completo | ✅ Endpoints reales |
| **Bookings** (solicitar/aprobar/rechazar) | ✅ Completo | ✅ Completo | ✅ Endpoints reales |
| **Payments** (Mercado Pago) | ✅ Completo | ✅ Completo | ✅ SDK integrado |
| **Sabana Coins** | ✅ Completo | ✅ Completo | ✅ Endpoints reales |
| **Vehicles** | ✅ Completo | ✅ Completo | ✅ Endpoints reales |
| **Cards** (tarjetas guardadas) | ✅ Completo | ✅ Completo | ✅ Endpoints reales |
| **Users** (perfil, roles) | ✅ Completo | ✅ Completo | ✅ Endpoints reales |
| **Reviews** (calificaciones) | ✅ Completo | 🟡 UI existe, integración pendiente | 🟡 |
| **Notifications** | 🟡 Solo BD, sin push | 🟡 Pantalla existe, sin push real | ❌ Sin Expo Push Notifications |
| **Reportes** | ❌ No existe | 🟡 Pantalla con datos mock | ❌ Datos simulados |
| **Rutas frecuentes** | ✅ Completo | ✅ Completo | ✅ Endpoints reales |

**Archivos clave:**
- `api/src/app.module.ts:1-53` — Todos los módulos importados
- `api/src/modules/` — 10 módulos implementados
- `app/src/api/` — 9 API clients conectados al backend
- `app/app/` — Pantallas organizadas por expo-router

### 4.1 Diagrama de módulos

```
┌─────────────────────────────────────────────┐
│              NEXUS API (NestJS)              │
│                                             │
│  ┌──────┐  ┌───────┐  ┌─────────┐          │
│  │ Auth │  │ Trips │  │Bookings │          │
│  └──┬───┘  └───┬───┘  └────┬────┘          │
│     │          │           │               │
│     ▼          ▼           ▼               │
│  ┌──────┐  ┌────────┐  ┌──────────┐       │
│  │Users │  │Vehicles│  │ Payments │       │
│  └──┬───┘  └───┬────┘  └────┬─────┘       │
│     │          │           │               │
│     ▼          ▼           ▼               │
│  ┌──────┐  ┌────────┐  ┌──────────┐       │
│  │Cards │  │ Reviews│  │SabanaCoins│       │
│  └──────┘  └────────┘  └──────────┘       │
│                                             │
│  ┌─────────────┐  ┌────────────┐           │
│  │Notifications│  │   Health   │           │
│  └─────────────┘  └────────────┘           │
└─────────────────────────────────────────────┘
```

## Resumen

El core de Nexus está casi completo (11 de 13 módulos funcionales). Lo que falta principalmente son: Microsoft OAuth real (pendiente de Azure AD), notificaciones push (pendiente Expo Push), y reportes (pendiente backend). El resto del backend y frontend están completamente integrados con datos reales.
