# 14. Integración con Terceros — Para Dummies

## 1. ¿Qué es una integración con terceros?

Es cuando tu aplicación usa servicios de **otras empresas** para añadir funcionalidades sin tener que inventarlas desde cero. En lugar de construir tu propio sistema de pagos, usas Mercado Pago; en lugar de hacer tu propio mapa, usas Google Maps.

Piénsalo como armar un computador: no fabricas el procesador tú mismo, le compras uno a Intel. Las integraciones son eso mismo: componentes ya hechos que conectas a tu app.

## 2. ¿Por qué es importante?

- **Ahorra tiempo**: Implementar un sistema de pagos desde cero toma meses. Usar Mercado Pago toma horas.
- **Es más seguro**: Las empresas de terceros se especializan en seguridad. Ellos manejan datos sensibles (tarjetas de crédito) mejor que nosotros.
- **Es lo que el usuario espera**: Los usuarios ya confían en Mercado Pago, Google, Microsoft. Usar estas plataformas da credibilidad.
- **Reduce el mantenimiento**: El tercero se encarga de actualizar y mantener su servicio.

## 3. Tipos de integraciones en Nexus

Nexus necesita conectarse con **4 servicios externos** para funcionar correctamente:

### 3.1 Mercado Pago (Pagos)

**¿Para qué sirve?**
- Procesar pagos con tarjeta de crédito/débito
- Generar links de pago (pasarela)
- Recibir confirmación de pago exitoso/fallido

**¿Cómo funciona?**
1. La app envía una solicitud al backend para crear un pago
2. El backend se comunica con la API de Mercado Pago y obtiene una URL de pago
3. El usuario es redirigido a la pasarela de Mercado Pago (dentro de un WebView)
4. Mercado Pago procesa el pago y redirige al usuario de vuelta a la app
5. El backend verifica el estado del pago con Mercado Pago

**¿Qué necesitamos de Mercado Pago?**
- `MP_PUBLIC_KEY`: Identificador público (no secreto)
- `MP_ACCESS_TOKEN`: Token secreto para hacer llamadas API

**Integración backend:**
- `api/src/modules/payments/payments.service.ts:26-36` — Configura el cliente de Mercado Pago SDK
- `api/src/modules/payments/payments.service.ts:38-152` — Crea preferencia de pago
- `api/src/modules/payments/payments.service.ts:154-199` — Verifica el pago

### 3.2 Microsoft OAuth (Inicio de sesión)

**¿Para qué sirve?**
- Permitir que los estudiantes inicien sesión con su cuenta institucional de Microsoft (Office 365)
- Obtener datos del perfil automáticamente (nombre, email)
- No tener que recordar otra contraseña

**¿Cómo funciona?**
1. El usuario hace clic en "Iniciar sesión con Microsoft"
2. Microsoft muestra una pantalla de login (el usuario ingresa su email `@unisabana.edu.co`)
3. Microsoft redirige a la app con un token
4. El backend valida ese token contra Microsoft Graph API

**¿Qué necesitamos de Microsoft?**
- **CLIENT_ID**: Identificador de la aplicación registrada en Azure AD
- **TENANT_ID**: Identificador del dominio institucional

**Estado actual:**
- `api/src/modules/auth/auth.service.ts:205-211` — El método `verifyMicrosoftToken` es un **stub**: siempre devuelve `mockuser@unisabana.edu.co`
- `app/src/utils/config.ts:4-11` — El `CLIENT_ID` dice `YOUR_CLIENT_ID_HERE`

### 3.3 Mapas (Leaflet / Google Maps)

**¿Para qué sirve?**
- Mostrar el mapa con los viajes disponibles
- Seleccionar origen y destino en un mapa
- Ver la ruta del viaje

**Estado actual:**
- Se usa **Leaflet** (librería de mapas open-source) Solo en web (react-native-web)
- En la app móvil **no hay mapas nativos** (no se usa Google Maps SDK ni Apple Maps)
- No hay integración con Google Maps API para calcular rutas o tiempos de viaje

### 3.4 Notificaciones Push (Expo Push)

**¿Para qué sirve?**
- Enviar notificaciones al celular del usuario aunque la app esté cerrada
- Alertar cuando alguien reserva un viaje
- Notificar cambios en viajes programados

**¿Cómo funciona?**
1. La app obtiene un "token de dispositivo" de Expo
2. El backend guarda ese token en la tabla `user_devices`
3. Cuando ocurre un evento, el backend envía una notificación a través de Expo Push API

**Estado actual:**
- La tabla `user_devices` existe en `database/schema.sql:205-215`
- El módulo `notifications` solo guarda en BD, no envía push
- No hay integración con Expo Push API

## 4. Estado actual en Nexus

| Integración | Estado | Archivos relevantes |
|---|---|---|
| **Mercado Pago** | ✅ Completo | `api/src/modules/payments/payments.service.ts`, `.env` con `MP_PUBLIC_KEY` y `MP_ACCESS_TOKEN` |
| **Microsoft OAuth** | 🟡 Stub — requiere registro en Azure AD | `api/src/modules/auth/auth.service.ts:205-211` (stub), `app/src/utils/config.ts:4` (`CLIENT_ID` pendiente) |
| **Mapas (Leaflet)** | 🟡 Solo web, sin mapa nativo móvil | Dependencia `react-native-web`, sin Google Maps SDK |
| **Notificaciones Push** | ❌ No implementado | `api/src/modules/notifications/notifications.service.ts` (solo BD), sin Expo Push API |

### 4.1 Lo que hay que hacer para completar cada integración

**Microsoft OAuth:**
1. Registrar la app en Azure AD del dominio `unisabana.edu.co`
2. Obtener `CLIENT_ID` y configurarlo en `app/src/utils/config.ts:4`
3. Implementar `verifyMicrosoftToken` en `api/src/modules/auth/auth.service.ts:205` usando Microsoft Graph API

**Mapas:**
1. Decidir si usar Google Maps SDK (más preciso) o continuar con Leaflet
2. Obtener API Key de Google Maps
3. Integrar mapa nativo en las pantallas de búsqueda y publicación de viajes

**Notificaciones Push:**
1. Instalar `expo-notifications` en el frontend
2. Implementar lógica de registro de token de dispositivo
3. Conectar el backend con Expo Push API para enviar notificaciones
4. La tabla `user_devices` y el módulo `notifications` ya están listos para recibir esta funcionalidad

### 4.2 Dependencias instaladas

```json
// api/package.json — Dependencias de terceros
"mercadopago": "^2.12.0",     // SDK de Mercado Pago (✅ implementado)
"@sentry/nestjs": "^10.53.1", // Sentry para monitoreo (✅ implementado)

// app/package.json
"sentry-expo": "^7.2.0",      // Sentry para Expo (✅)
"expo-auth-session": "~7.0.11", // OAuth para Microsoft (parcial)
"expo-web-browser": "~15.0.11", // Navegador para OAuth (parcial)
"react-native-webview": "13.15.0", // WebView para Mercado Pago (✅)
```

## Resumen

De 4 integraciones externas necesarias, solo **Mercado Pago** está completa. Microsoft OAuth tiene el código base pero falta el registro en Azure AD. Mapas solo funciona en web. Notificaciones push no están implementadas. Las más críticas para el MVP son Microsoft OAuth y notificaciones push.
