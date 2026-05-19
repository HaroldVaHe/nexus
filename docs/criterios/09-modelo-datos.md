# Modelo de Datos — Para Dummies

## ¿Qué es un Modelo de Datos?

Un **modelo de datos** es un diagrama que muestra cómo se organiza y relaciona la información en tu aplicación. Es como el plano de una biblioteca: qué libros hay, en qué estantes están, cómo se relacionan unos con otros.

Sin un modelo de datos, terminas guardando información desordenada y es imposible mantener el sistema a largo plazo.

## ¿Qué es un Diagrama ER (Entidad-Relación)?

Un diagrama ER (Entidad-Relación) representa:
- **Entidades:** Las "cosas" sobre las que guardamos información (Usuarios, Viajes, Reservas).
- **Atributos:** Las propiedades de cada entidad (nombre, email, precio).
- **Relaciones:** Cómo se conectan las entidades entre sí.

Por ejemplo: "Un **Usuario** puede tener muchos **Viajes**, pero un **Viaje** pertenece a un solo **Usuario**". Esto es una relación 1:N (uno a muchos).

## Las 11 Tablas de Nexus

El esquema completo está en `database/schema.sql`. Aquí están todas las tablas:

---

### 1. `users` — Usuarios

| Columna | Tipo | Descripción |
|---|---|---|
| `id` | UUID | Identificador único |
| `email` | VARCHAR(255) | Correo electrónico (único, solo @unisabana.edu.co) |
| `full_name` | VARCHAR(255) | Nombre completo |
| `password_hash` | VARCHAR(255) | Contraseña encriptada con bcrypt |
| `profile_photo_url` | VARCHAR(500) | URL de la foto de perfil |
| `faculty` | VARCHAR(150) | Facultad del estudiante |
| `phone` | VARCHAR(20) | Teléfono de contacto |
| `status` | ENUM | `active`, `suspended`, `deactivated` |
| `average_rating` | DECIMAL(3,2) | Calificación promedio (0-5) |
| `total_trips` | INTEGER | Total de viajes completados |

**Propósito:** Almacena la información básica de cada estudiante registrado.

---

### 2. `user_roles` — Roles de Usuario

| Columna | Tipo | Descripción |
|---|---|---|
| `user_id` | UUID | Referencia al usuario |
| `role` | ENUM | `driver` o `passenger` |

**Propósito:** Define si un usuario es conductor, pasajero, o ambos (puede tener ambos roles).

---

### 3. `vehicles` — Vehículos

| Columna | Tipo | Descripción |
|---|---|---|
| `id` | UUID | Identificador único |
| `driver_id` | UUID | Dueño del vehículo (referencia a users) |
| `brand` | VARCHAR(100) | Marca (Mazda, Renault, etc.) |
| `model` | VARCHAR(100) | Modelo (Mazda 3, Stepway, etc.) |
| `color` | VARCHAR(50) | Color |
| `plate` | VARCHAR(20) | Placa |
| `deleted_at` | TIMESTAMPTZ | Soft delete (null = activo) |

**Propósito:** Los conductores registran sus vehículos para publicar viajes.

**Relación:** Un conductor puede tener varios vehículos, un vehículo pertenece a un conductor.

---

### 4. `trips` — Viajes

| Columna | Tipo | Descripción |
|---|---|---|
| `id` | UUID | Identificador único |
| `driver_id` | UUID | Conductor que publica el viaje |
| `vehicle_id` | UUID | Vehículo usado |
| `origin_name` | VARCHAR(255) | Nombre del lugar de origen |
| `origin_lat` / `origin_lng` | DECIMAL(9,6) | Coordenadas de origen |
| `destination_name` | VARCHAR(255) | Nombre del destino |
| `destination_lat` / `destination_lng` | DECIMAL(9,6) | Coordenadas del destino |
| `departure_time` | TIMESTAMPTZ | Fecha y hora de salida |
| `total_seats` | INTEGER | Asientos totales (1-7) |
| `available_seats` | INTEGER | Asientos disponibles |
| `price` | DECIMAL(10,2) | Precio por asiento |
| `status` | ENUM | `scheduled`, `in_progress`, `completed`, `cancelled` |

**Propósito:** Un conductor publica un viaje con origen, destino, hora y precio.

**Relación:** Un conductor puede tener muchos viajes. Un viaje pertenece a un conductor y un vehículo.

---

### 5. `bookings` — Reservas

| Columna | Tipo | Descripción |
|---|---|---|
| `id` | UUID | Identificador único |
| `trip_id` | UUID | Viaje reservado |
| `passenger_id` | UUID | Pasajero que reserva |
| `status` | ENUM | `pending`, `confirmed`, `cancelled`, `completed` |
| `meeting_point_name` | VARCHAR(255) | Punto de encuentro acordado |
| `meeting_point_lat` / `lng` | DECIMAL(9,6) | Coordenadas del punto de encuentro |

**Propósito:** Un pasajero reserva uno o más asientos en un viaje.

**Relación:** Un viaje puede tener muchas reservas. Un pasajero puede tener muchas reservas. Un viaje + un pasajero solo pueden tener una reserva (único).

---

### 6. `payments` — Pagos

| Columna | Tipo | Descripción |
|---|---|---|
| `id` | UUID | Identificador único |
| `booking_id` | UUID | Reserva asociada (uno a uno) |
| `amount` | DECIMAL(10,2) | Monto pagado |
| `method` | ENUM | `pse`, `card`, `sabana_points` |
| `status` | ENUM | `pending`, `success`, `failed`, `refunded` |
| `provider_reference` | VARCHAR(255) | ID de la transacción en MercadoPago |
| `provider_response` | JSONB | Respuesta completa del proveedor |

**Propósito:** Registra el pago de cada reserva.

**Relación:** Una reserva tiene un solo pago. Un pago pertenece a una sola reserva.

---

### 7. `reviews` — Reseñas

| Columna | Tipo | Descripción |
|---|---|---|
| `id` | UUID | Identificador único |
| `trip_id` | UUID | Viaje al que pertenece |
| `reviewer_id` | UUID | Quién califica |
| `reviewed_user_id` | UUID | Quién es calificado |
| `rating` | INTEGER | 1-5 estrellas |
| `comment` | TEXT | Comentario opcional |

**Propósito:** Después de un viaje, los usuarios se califican mutuamente.

**Relación:** Un viaje puede tener muchas reseñas.

---

### 8. `review_tags` — Etiquetas de Reseñas

| Columna | Tipo | Descripción |
|---|---|---|
| `id` | UUID | Identificador único |
| `name` | VARCHAR(50) | Nombre de la etiqueta |
| `category` | VARCHAR(50) | Categoría (comportamiento, seguridad) |

**Propósito:** Etiquetas predefinidas para calificar (puntual, seguro, amable, etc.).

**Datos iniciales (seed):** puntual, seguro, amable, ordenado, conversador, respetuoso, música alta, conductor responsable, vehículo limpio, flexible con horario.

---

### 9. `review_tag_mapping` — Mapeo Reseña-Etiqueta

| Columna | Tipo | Descripción |
|---|---|---|
| `review_id` | UUID | Reseña |
| `tag_id` | UUID | Etiqueta |

**Propósito:** Relaciona reseñas con etiquetas (muchos a muchos).

---

### 10. `sabana_coins_ledger` — Libro Mayor Sabana Coins

| Columna | Tipo | Descripción |
|---|---|---|
| `id` | UUID | Identificador único |
| `user_id` | UUID | Usuario |
| `amount` | INTEGER | Cantidad de monedas (+ ganadas, - gastadas) |
| `type` | ENUM | `earned`, `spent`, `redeemed`, `bonus` |
| `description` | VARCHAR(255) | Descripción de la transacción |
| `reference_id` | UUID | ID de referencia (viaje, reserva, etc.) |

**Propósito:** Registra todas las transacciones de Sabana Coins.

Hay una **vista materializada** (`user_sabana_coins_balance`) que calcula el balance actual de cada usuario de forma eficiente.

---

### 11. `notifications` — Notificaciones

| Columna | Tipo | Descripción |
|---|---|---|
| `id` | UUID | Identificador único |
| `user_id` | UUID | Usuario destinatario |
| `type` | ENUM | `booking_confirmed`, `booking_cancelled`, etc. |
| `title` | VARCHAR(255) | Título de la notificación |
| `message` | TEXT | Cuerpo del mensaje |
| `is_read` | BOOLEAN | Leída o no |

**Propósito:** Notificaciones dentro de la app y push notifications.

### 12. `user_devices` — Dispositivos

Registra los tokens de push notification para cada dispositivo (iOS/Android).

### 13. `saved_cards` — Tarjetas Guardadas

Tarjetas de crédito/débito guardadas para pagos rápidos (solo almacena últimos 4 dígitos, no el número completo).

## Relaciones Clave (Resumen)

```
users 1──N user_roles
users 1──N vehicles
users 1──N trips (como driver)
users 1──N bookings (como passenger)
users 1──N reviews (como reviewer)
users 1──N reviews (como reviewed_user)
users 1──N sabana_coins_ledger
users 1──N notifications
users 1──N saved_cards
users 1──N user_devices

vehicles 1──N trips
trips 1──N bookings
bookings 1──1 payments
trips 1──N reviews
reviews N──M review_tags (via review_tag_mapping)
```

## Vistas

**`user_sabana_coins_balance`** (materializada):
- Calcula el balance total, total ganado y total gastado por usuario.
- Se actualiza manualmente o se recrea periódicamente.

## Triggers Automáticos

| Trigger | Acción |
|---|---|
| `trigger_decrement_seats` | Cuando una reserva se confirma, descuenta un asiento disponible. |
| `trigger_increment_seats` | Cuando una reserva se cancela, recupera el asiento. |
| `trigger_update_average_rating` | Cuando se inserta una reseña, recalcula el promedio del usuario. |
| `trigger_increment_total_trips` | Cuando un viaje se completa, suma 1 al contador del conductor. |
| `trigger_*_updated_at` | Actualiza automáticamente `updated_at` en cada modificación. |

## Estado Actual en Nexus

| Elemento | Estado |
|---|---|
| Esquema completo (11 tablas) | ✅ Implementado en `database/schema.sql` |
| Enums (8 tipos) | ✅ `user_role_enum`, `trip_status_enum`, `booking_status_enum`, etc. |
| Vistas materializadas | ✅ `user_sabana_coins_balance` |
| Triggers | ✅ 10 triggers automáticos |
| Índices | ✅ 20+ índices para rendimiento |
| Seed data | ✅ 10 tags de reseñas predefinidos |
| Comentarios de documentación | ✅ En cada tabla |
| TypeORM entities | ✅ En `api/src/database/entities/` |

La base de datos es el corazón de Nexus. Cada transacción — desde que un estudiante se registra hasta que califica un viaje — queda registrada en estas tablas, garantizando integridad y trazabilidad.
