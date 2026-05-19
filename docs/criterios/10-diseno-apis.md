# Diseño de APIs — Para Dummies

## ¿Qué es una API?

**API** significa **Application Programming Interface** (Interfaz de Programación de Aplicaciones). En términos simples, es un **mensajero** que permite que dos aplicaciones se comuniquen entre sí.

Imagina que vas a un restaurante:
- Tú eres el **Frontend** (la app móvil).
- La cocina es el **Backend** (el servidor).
- El mesero es la **API**.

Tú le dices al mesero lo que quieres (menú, fotos, etc.), él va a la cocina, obtiene lo que pediste y te lo trae. No necesitas saber cómo funciona la cocina; solo confías en que el mesero te traerá lo correcto.

## ¿Qué es REST?

**REST** (Representational State Transfer) es un estilo de diseño de APIs. Se basa en:

- **Recursos:** Cada "cosa" (usuario, viaje, reserva) es un recurso con una URL.
- **Verbos HTTP:** Las acciones se representan con métodos HTTP:
  - `GET` → Obtener datos (leer)
  - `POST` → Crear datos (escribir)
  - `PUT` / `PATCH` → Actualizar datos (modificar)
  - `DELETE` → Eliminar datos (borrar)
- **Stateless:** Cada petición contiene toda la información necesaria. El servidor no guarda estado entre peticiones.

## La API de Nexus

Nexus expone una API RESTful en la URL base:

```
/api/v1
```

### Módulos Disponibles

La API está organizada en módulos, cada uno con su propio conjunto de rutas:

| Módulo | Ruta Base | Funcionalidad |
|---|---|---|
| **Auth** | `/api/v1/auth` | Registro, inicio de sesión, autenticación Microsoft |
| **Users** | `/api/v1/users` | Perfil de usuario, CRUD básico |
| **Vehicles** | `/api/v1/vehicles` | Registro y gestión de vehículos |
| **Trips** | `/api/v1/trips` | Publicación, búsqueda y gestión de viajes |
| **Bookings** | `/api/v1/bookings` | Reserva de asientos en viajes |
| **Payments** | `/api/v1/payments` | Procesamiento de pagos (MercadoPago) |
| **Reviews** | `/api/v1/reviews` | Calificaciones y reseñas post-viaje |
| **Sabana Coins** | `/api/v1/sabana-coins` | Saldo y transacciones de monedas |
| **Notifications** | `/api/v1/notifications` | Notificaciones push e in-app |
| **Cards** | `/api/v1/cards` | Tarjetas guardadas para pagos rápidos |
| **Health** | `/api/v1/health` | Estado del servidor (health check) |

### Ejemplos de Endpoints

| Método | Ruta | Descripción |
|---|---|---|
| `POST` | `/api/v1/auth/register` | Registrar un nuevo usuario |
| `POST` | `/api/v1/auth/login` | Iniciar sesión (devuelve JWT) |
| `GET` | `/api/v1/trips` | Listar viajes disponibles (con filtros) |
| `POST` | `/api/v1/trips` | Publicar un nuevo viaje |
| `GET` | `/api/v1/trips/:id` | Ver detalle de un viaje |
| `PUT` | `/api/v1/trips/:id` | Actualizar un viaje |
| `DELETE` | `/api/v1/trips/:id` | Cancelar un viaje |
| `POST` | `/api/v1/bookings` | Reservar un asiento |
| `GET` | `/api/v1/bookings/mine` | Ver mis reservas |
| `POST` | `/api/v1/payments/pay` | Procesar un pago |
| `GET` | `/api/v1/users/me` | Ver mi perfil |
| `GET` | `/api/v1/sabana-coins/balance` | Ver mi saldo de Sabana Coins |

### Formato de las Respuestas

Todas las respuestas siguen un formato JSON consistente:

**Éxito:**
```json
{
  "id": "uuid",
  "email": "maria@unisabana.edu.co",
  "full_name": "María José López"
}
```

**Error:**
```json
{
  "statusCode": 400,
  "message": "Only @unisabana.edu.co emails are allowed",
  "error": "Bad Request"
}
```

### Autenticación

La mayoría de los endpoints requieren autenticación. Se envía un **token JWT** en el encabezado HTTP:

```
Authorization: Bearer <token>
```

El token se obtiene al hacer login o registrarse.

## Cómo Leer la Documentación Swagger

Swagger es una herramienta que genera documentación interactiva de la API automáticamente.

### Swagger de Nexus

La documentación Swagger está disponible en:

```
http://localhost:3000/api/docs
```

(O la URL del servidor donde esté corriendo la API).

### Cómo usarla:

1. **Abre la URL** en tu navegador. Verás una página con todos los endpoints listados.
2. **Explora los módulos** haciendo clic para expandir cada uno (Auth, Trips, Bookings, etc.).
3. **Para cada endpoint** verás:
   - Método HTTP (GET, POST, PUT, DELETE)
   - Ruta (URL)
   - Parámetros requeridos
   - Formato de la respuesta
   - Códigos de error posibles
4. **Try it out:** Swagger te permite ejecutar peticiones directamente desde el navegador para probar la API.
5. **Authorize:** Hay un botón "Authorize" donde puedes pegar tu token JWT para probar endpoints protegidos.
6. **Schemas:** Al final de la página, Swagger lista todos los modelos de datos (DTOs) con sus propiedades.

### Ejemplo Práctico

Para probar el registro de usuario desde Swagger:

1. Ve a `Auth` → `POST /api/v1/auth/register`
2. Haz clic en "Try it out"
3. En el cuerpo JSON, escribe:
   ```json
   {
     "email": "estudiante@unisabana.edu.co",
     "password": "MiPassword123",
     "full_name": "Juan Pérez"
   }
   ```
4. Haz clic en "Execute"
5. Swagger te muestra la respuesta: el código HTTP, los headers y el cuerpo JSON.

## Por Qué es Importante Diseñar Bien las APIs

- **Consistencia:** Todos los endpoints siguen las mismas reglas. Fácil de aprender.
- **Documentación viva:** Swagger se genera del código. Siempre está actualizada.
- **Separación frontend-backend:** El equipo móvil y el equipo backend pueden trabajar en paralelo.
- **Escalabilidad:** Una API bien diseñada permite añadir nuevos clientes (app web, app Android, etc.) sin cambiar el backend.

## Cómo se Hace en la Práctica

1. **Diseña primero.** Define los endpoints antes de escribir código. Swagger/OpenAPI es el estándar.
2. **Sigue convenciones.** URLs en plural (`/trips`, no `/trip`), nombres en minúscula, guiones para separar palabras.
3. **Versiona.** Pon `/api/v1/` para poder hacer cambios sin romper clientes existentes.
4. **Documenta.** Los decoradores de NestJS generan Swagger automáticamente.
5. **Prueba.** Swagger UI, Postman, Insomnia.
6. **Asegura.** Usa JWT, validación de entrada, rate limiting.

## Estado Actual en Nexus

| Elemento | Estado |
|---|---|
| Documentación Swagger | ✅ Configurado en `api/src/main.ts:43-51` |
| URL de Swagger | `http://localhost:3000/api/docs` |
| 11 módulos implementados | ✅ `api/src/modules/` |
| Autenticación Bearer JWT | ✅ `api/src/modules/auth/strategies/` |
| Validación de entrada | ✅ `class-validator` + `ValidationPipe` global |
| Rate limiting | ✅ `@nestjs/throttler` configurado en `app.module.ts` |
| Endpoints RESTful | ✅ Convenciones REST estándar |
| Frontend conectado | ✅ `app/src/api/` con 9 clientes HTTP |

### API Clients del Frontend

En `app/src/api/` existen clientes listos para consumir cada módulo:

| Archivo | Módulo |
|---|---|
| `auth.ts` | Autenticación |
| `trips.ts` | Viajes |
| `bookings.ts` | Reservas |
| `payments.ts` | Pagos |
| `vehicles.ts` | Vehículos |
| `users.ts` | Usuarios |
| `routes.ts` | Rutas |
| `sabana-coins.ts` | Sabana Coins |
| `cards.ts` | Tarjetas |

## Resumen

La API de Nexus es RESTful, está documentada con Swagger, protegida con JWT, y organizada en 11 módulos. Cada módulo tiene endpoints CRUD estándar. El frontend consume estos endpoints a través de clients HTTP dedicados. Cualquier desarrollador puede entender y usar la API simplemente abriendo `http://localhost:3000/api/docs` en su navegador.
