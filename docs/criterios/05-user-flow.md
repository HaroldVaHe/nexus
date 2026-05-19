# Flujo de Usuario (User Flow) — Para Dummies

## ¿Qué es un User Flow?

Un **User Flow** (flujo de usuario) es el camino que sigue una persona dentro de tu app para completar una tarea. Es como un mapa de navegación: desde que abre la app hasta que logra lo que vino a hacer.

Por ejemplo, el flujo "Comprar un producto" sería:
1. Abrir la app → 2. Buscar producto → 3. Ver detalles → 4. Añadir al carrito → 5. Pagar → 6. Confirmación

Cada paso es una **pantalla** o una **acción**. El flujo muestra las decisiones que el usuario toma en cada punto.

## Por Qué es Importante

- **Detecta puntos de fricción.** Si un flujo tiene demasiados pasos, los usuarios se frustran y abandonan.
- **Guía el diseño de pantallas.** Sabes exactamente qué botones y qué información necesita cada pantalla.
- **Alinea al equipo.** Diseñadores, desarrolladores y QA prueban contra los mismos flujos.
- **Reduce la complejidad.** Un flujo bien diseñado elimina pasos innecesarios.

Sin user flows, terminas con pantallas bonitas pero una navegación confusa.

## El User Flow Principal de Nexus

El flujo más importante para un pasajero es:

```
Inicio 
  │
  ▼
┌──────────────────────┐
│   Pantalla de Login   │ ← Si no ha iniciado sesión
│  (email + contraseña) │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│   Buscar Viaje        │ ← Pantalla principal
│  (origen, destino,    │
│   fecha y hora)       │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│  Resultados de        │
│  Búsqueda             │ ← Lista de viajes disponibles
│  (conductor, precio,  │
│   asientos, hora)     │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│  Detalle del Viaje    │ ← Info del conductor, vehículo,
│                       │   ruta, reseñas
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│  Confirmar Reserva   │ ← Seleccionar asientos, punto
│                       │   de encuentro
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│  Método de Pago      │ ← PSE, tarjeta o Sabana Coins
│                       │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│  Confirmación +       │ ← ¡Viaje reservado!
│  Detalles del viaje   │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│  Calificar (post-     │ ← Después del viaje
│  viaje)               │
└──────────────────────┘
```

### Diagrama Simplificado

```
Registro → Login → Buscar Viaje → Reservar → Pagar → Viajar → Calificar
```

## El User Flow del Conductor

```
Login → Publicar Viaje → Esperar pasajeros → Gestionar reservas → Iniciar viaje →
            Finalizar → Recibir pago + Sabana Coins
```

## Posibles Puntos de Fricción (y Cómo se Resuelven)

| Punto de Fricción | Solución en Nexus |
|---|---|
| El usuario olvidó su contraseña | Flujo de recuperación (pantalla de login → "olvidé contraseña") |
| No hay viajes disponibles para su ruta | Mostrar mensaje amigable + sugerencia de buscar otra fecha |
| El conductor cancela el viaje | Notificación push + reembolso automático |
| El pasajero no se presenta | Sistema de calificaciones negativas |
| Pago fallido | Reintentar con otro método de pago |

## Cómo se Hace en la Práctica

1. **Identifica la tarea principal.** ¿Qué es lo que el usuario viene a hacer? (En Nexus: reservar un viaje).
2. **Lista los pasos en orden.** Desde que abre la app hasta que completa la tarea.
3. **Dibuja el flujo.** Puede ser en papel, pizarra o herramientas digitales.
4. **Identifica decisiones (bifurcaciones).** "Si el usuario no está logueado → mostrar login". "Si el pago falla → mostrar error".
5. **Simplifica.** ¿Puedes reducir el número de pasos? ¿Puedes combinar pantallas?
6. **Prueba con usuarios.** Obsérvalos seguir el flujo. ¿Dónde se detienen? ¿Dónde se confunden?

Herramientas: Figma, Miro, Lucidchart, Draw.io, o incluso papel y lápiz.

## Estado Actual en Nexus

El user flow está implementado en la navegación de la app mediante **expo-router**.

### Pantallas por Módulo

Las pantallas están organizadas en `app/app/`:

| Ruta | Pantalla | Flujo |
|---|---|---|
| `app/app/index.tsx` | Inicio / Login | Entrada principal |
| `app/app/(auth)/` | Autenticación | Login, registro, recuperación |
| `app/app/(tabs)/` | Navegación principal | Tabs inferiores (inicio, búsqueda, perfil) |
| `app/app/trip/` | Viajes | Crear, ver detalle |
| `app/app/bookings.tsx` | Reservas | Lista de reservas del usuario |
| `app/app/payment/` | Pagos | Pantallas de pago (PSE, card, Sabana Points) |
| `app/app/payments/` | Historial de pagos | Resumen de transacciones |
| `app/app/my-vehicles.tsx` | Mis vehículos | CRUD de vehículos |
| `app/app/my-publications.tsx` | Mis publicaciones | Viajes publicados por el conductor |
| `app/app/notifications.tsx` | Notificaciones | Centro de notificaciones |
| `app/app/settings.tsx` | Ajustes | Configuración del usuario |
| `app/app/settings/` | Sub-páginas de ajustes | Perfil, seguridad, preferencias |
| `app/app/help.tsx` | Ayuda | Preguntas frecuentes y contacto |
| `app/app/report/` | Reportes | Generación de reportes (post-MVP) |

### Navegación (expo-router)

- **`_layout.tsx`**: Layout principal que define la navegación general.
- **`(auth)/`**: Grupo de rutas protegidas para autenticación.
- **`(tabs)/`**: Grupo de rutas con navegación por tabs (inferior).

### Conexión con el Backend

Cada flujo se conecta con los API clients en `app/src/api/`:
- `auth.ts` → Login, registro
- `trips.ts` → CRUD y búsqueda de viajes
- `bookings.ts` → Reservas
- `payments.ts` → Pagos
- `vehicles.ts` → Vehículos
- `users.ts` → Perfil de usuario
- `routes.ts` → Rutas
- `sabana-coins.ts` → Saldo y transacciones

## Resumen

El user flow es el **esqueleto de la app**. Antes de diseñar una sola pantalla, debes tener claros todos los caminos que el usuario puede recorrer. En Nexus, el flujo principal está implementado con expo-router y conectado a APIs reales del backend, lo que permite a un estudiante real registrarse, buscar un viaje, pagar y calificar — todo desde su celular.
