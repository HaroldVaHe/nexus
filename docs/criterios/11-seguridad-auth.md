# Seguridad y Autenticación — Para Dummies

## ¿Qué es la Autenticación?

**Autenticación** es el proceso de verificar que un usuario es quien dice ser. Es como mostrar tu cédula en la entrada de un edificio: demuestras que eres quien dices ser.

En el mundo digital, la autenticación suele hacerse con:
- **Algo que sabes:** Contraseña.
- **Algo que tienes:** Teléfono, token físico.
- **Algo que eres:** Huella digital, reconocimiento facial.

Nexus usa el primer método (contraseña) más un filtro adicional (correo institucional).

## ¿Qué es la Autorización?

**Autorización** es diferente a autenticación. Mientras autenticación verifica **quién eres**, autorización verifica **qué puedes hacer**.

Ejemplo:
- Entras al edificio (autenticación ✅).
- Pero no puedes entrar al laboratorio de profesores porque no tienes permiso (autorización ❌).

En Nexus, hay dos roles: `driver` (conductor) y `passenger` (pasajero). Cada rol tiene permisos diferentes.

## ¿Qué es JWT?

**JWT** (JSON Web Token) es un formato de token que permite transmitir información de forma segura entre el frontend y el backend.

Funciona así:

1. El usuario inicia sesión con email + contraseña.
2. El backend verifica las credenciales y crea un **JWT** (un string largo encriptado).
3. El frontend guarda ese JWT (en `expo-secure-store` en el celular).
4. En cada petición posterior, el frontend envía el JWT en el encabezado HTTP.
5. El backend verifica el JWT y sabe quién es el usuario sin necesidad de consultar la base de datos cada vez.

El JWT contiene información como: ID del usuario, email, roles, y fecha de expiración. Todo firmado digitalmente para que nadie pueda modificarlo.

## El Flujo de Autenticación en Nexus (Paso a Paso)

### Registro

```
Usuario                    Frontend (App)              Backend (API)          Base de Datos
   │                            │                          │                       │
   │  Llena formulario          │                          │                       │
   │  (email, nombre, pass)     │                          │                       │
   ├───────────────────────────►│                          │                       │
   │                            │  POST /auth/register     │                       │
   │                            │  {email, full_name,      │                       │
   │                            │   password, faculty}     │                       │
   │                            ├─────────────────────────►│                       │
   │                            │                          │  Verifica:            │
   │                            │                          │  • ¿Email @unisabana? │
   │                            │                          │  • ¿Ya existe?        │
   │                            │                          │  • Hash password      │
   │                            │                          │  (bcrypt, 10 rounds)  │
   │                            │                          ├──────────────────────►│
   │                            │                          │  INSERT INTO users    │
   │                            │                          │◄──────────────────────┤
   │                            │                          │                       │
   │                            │                          │  Genera JWT           │
   │                            │  {accessToken,           │                       │
   │                            │   expiresIn, id, email,  │                       │
   │                            │   full_name, ...}        │                       │
   │                            │◄─────────────────────────┤                       │
   │                            │                          │                       │
   │  Guarda JWT en             │                          │                       │
   │  SecureStore + navega      │                          │                       │
   │◄───────────────────────────┤                          │                       │
```

### Inicio de Sesión

1. El usuario ingresa email y contraseña.
2. La app envía `POST /api/v1/auth/login` con esas credenciales.
3. El backend busca al usuario por email.
4. Compara la contraseña usando `bcrypt.compare()` (la contraseña original NUNCA se guarda, solo su hash).
5. Si coincide, genera un JWT con los datos del usuario.
6. La app recibe el JWT y lo guarda en `expo-secure-store` (almacenamiento encriptado del teléfono).
7. El usuario queda autenticado y puede navegar.

### Cada Petición Posterior

1. La app lee el JWT del almacén seguro.
2. Lo añade al encabezado: `Authorization: Bearer <token>`.
3. El backend tiene un **guard** (JwtAuthGuard) que intercepta la petición.
4. El guard verifica la firma del JWT, que no haya expirado, y extrae los datos del usuario.
5. Si el token es válido, la petición continúa al controlador. Si no, devuelve 401 (No autorizado).

## Medidas de Seguridad Específicas

### 1. Validación de Dominio Institucional

En `api/src/modules/auth/auth.service.ts:23-25`:

```typescript
validateInstitutionalDomain(email: string): boolean {
  return email.toLowerCase().endsWith('@unisabana.edu.co');
}
```

- Solo correos `@unisabana.edu.co` pueden registrarse.
- Se valida tanto en registro como en login.
- También se valida en el frontend (`config.ts:24-26`).

### 2. Hash de Contraseñas (bcrypt)

- Las contraseñas nunca se guardan en texto plano.
- Se usa `bcrypt.hash(password, 10)` — 10 rondas de encriptación.
- Al iniciar sesión, se compara con `bcrypt.compare(password, hash)`.
- Incluso si alguien robara la base de datos, no podría obtener las contraseñas.

### 3. JWT con Fecha de Expiración

- El token JWT incluye un campo `exp` (expiration).
- Configurado en el módulo JWT de NestJS.
- Si un token es robado, solo sirve por tiempo limitado.

### 4. Almacenamiento Seguro del Token

- En el celular: `expo-secure-store` (usa Keychain en iOS, EncryptedSharedPreferences en Android).
- En web: `localStorage` (menos seguro, es una limitación conocida de web).
- El token nunca se guarda en variables de estado global que puedan ser accedidas por scripts maliciosos.

### 5. Roles y Guards

Dos tipos de guards protegen los endpoints:

| Guard | Propósito |
|---|---|
| **JwtAuthGuard** (`jwt-auth.guard.ts`) | Verifica que el usuario tenga un JWT válido |
| **RolesGuard** (`common/roles.guard.ts`) | Verifica que el usuario tenga el rol necesario (driver/passenger) |

Ejemplo: Solo los conductores (role `driver`) pueden crear viajes.

### 6. Rate Limiting (Límite de Peticiones)

Configurado con `@nestjs/throttler`:
- Límite de peticiones por minuto desde una misma IP.
- Previene ataques de fuerza bruta (intentar muchas contraseñas rápido).
- Aplicado globalmente y por endpoint (ej: login tiene un límite más restrictivo).

### 7. Validación de Entrada

- `ValidationPipe` global con `whitelist: true` y `forbidNonWhitelisted: true`.
- Solo los campos definidos en los DTOs (Data Transfer Objects) son aceptados.
- Previene inyección de datos maliciosos.

## Arquitectura de Seguridad en el Código

```
Petición HTTP entrante
         │
         ▼
┌─────────────────┐
│  Rate Limiter    │ ← Límite de peticiones por IP
│  (Throttler)     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  ValidationPipe  │ ← Valida formato de datos
│  (class-validator)│
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  JwtAuthGuard    │ ← Verifica JWT (si aplica)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  RolesGuard      │ ← Verifica rol (si aplica)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Controlador     │ ← Ejecuta la lógica
│  + Servicio      │
└─────────────────┘
```

## Cómo se Hace en la Práctica

1. **Nunca guardes contraseñas en texto plano.** Siempre hash con bcrypt, argon2, o similar.
2. **Usa HTTPS en producción.** Todas las comunicaciones encriptadas.
3. **Valida toda entrada del usuario.** Asume que cualquier dato enviado por el usuario es malicioso.
4. **Usa tokens con expiración.** No tokens eternos.
5. **Principio de mínimo privilegio.** Cada usuario solo tiene acceso a lo que necesita.
6. **Rate limiting.** Protege contra ataques automatizados.
7. **Logs de seguridad.** Registra intentos de acceso fallidos.

## Estado Actual en Nexus

| Medida de Seguridad | Ubicación en el Código | Estado |
|---|---|---|
| Validación de dominio institucional | `auth.service.ts:23-25` + `config.ts:24-26` | ✅ |
| Hash de contraseñas (bcrypt) | `auth.service.ts:40` | ✅ |
| JWT con expiración | `api/src/modules/auth/strategies/jwt.strategy.ts` | ✅ |
| Almacenamiento seguro (SecureStore) | `AuthContext.tsx` | ✅ |
| JwtAuthGuard | `api/src/modules/auth/guards/jwt-auth.guard.ts` | ✅ |
| RolesGuard | `api/src/common/roles.guard.ts` | ✅ |
| Rate limiting | `app.module.ts:27` + `auth.controller.ts` (Throttle) | ✅ |
| ValidationPipe global | `main.ts:32-41` | ✅ |
| Microsoft OAuth (stub) | `auth.service.ts` (función `verifyMicrosoftToken` mock) | ⚠️ Parcial |
| Refresh tokens | No implementados | ❌ Futuro |
| CORS configurado | `main.ts:26-30` | ✅ |
| Sentry (errores) | `main.ts:10-16` | ✅ |

## Resumen para tu Proyecto

La seguridad no es un añadido — es parte fundamental del diseño. En Nexus, desde el primer día se implementó:
- Solo estudiantes Unisabana pueden registrarse.
- Contraseñas encriptadas con bcrypt.
- Tokens JWT para sesiones seguras.
- Guards para proteger cada ruta.
- Rate limiting para evitar abusos.

El flujo completo (registro → login → JWT → peticiones autenticadas) permite que un estudiante use la app de forma segura, sabiendo que su información está protegida y que solo otros estudiantes de Unisabana están en la plataforma.
