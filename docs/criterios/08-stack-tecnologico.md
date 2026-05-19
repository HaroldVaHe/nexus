# Stack Tecnológico — Para Dummies

> **Documento fuente**: `3.1 Stack Tecnologico.docx` (raíz del proyecto)
> **Autor**: Juan Esteban Ocampo Manrique

---

## ¿Qué es un Stack Tecnológico?

El **stack tecnológico** (o pila tecnológica) es el conjunto de tecnologías que usas para construir una aplicación. Es como elegir los materiales para construir una casa: ladrillos, cemento, madera, tuberías. Cada material tiene un propósito y una razón de ser.

En Nexus, el stack se divide en:

```
┌──────────────────────────────────────────┐
│           APLICACIÓN MÓVIL                │
│    React Native + Expo SDK 51+           │
│    TypeScript / Expo Router              │
├──────────────────────────────────────────┤
│           API BACKEND                     │
│    Node.js + NestJS 10 + TypeScript       │
├──────────────────────────────────────────┤
│           BASE DE DATOS                   │
│    PostgreSQL 16 + TypeORM                │
├──────────────────────────────────────────┤
│           AUTENTICACIÓN                   │
│    Azure AD + MSAL + Passport.js (JWT)    │
├──────────────────────────────────────────┤
│           PAGOS                           │
│    Wompi (Bancolombia) — PSE + Tarjeta    │
├──────────────────────────────────────────┤
│           NOTIFICACIONES                  │
│    Expo Push + FCM + Nodemailer           │
├──────────────────────────────────────────┤
│           INFRAESTRUCTURA                 │
│    Docker + Docker Compose                │
└──────────────────────────────────────────┘
```

---

## ¿Por qué es importante?

Porque define:
- **Lo que puedes construir** (ciertas cosas solo se pueden hacer con ciertas tecnologías)
- **Quién puede trabajar** (necesitas desarrolladores que sepan esas herramientas)
- **Cuánto cuesta mantenerlo** (tecnologías populares = más soporte, más barato)
- **Si funciona en el celular del usuario** (iOS y Android desde un solo código)

---

## Estado actual en Nexus

Basado en el documento oficial `3.1 Stack Tecnologico.docx` y el código real del proyecto.

### 📱 Frontend — Aplicación Móvil

| Decisión | Tecnología | Versión actual |
|---|---|---|
| **Framework** | React Native + Expo | SDK 54 / RN 0.81.5 |
| **Lenguaje** | TypeScript | 5.9 |
| **Navegación** | Expo Router | 6.0 |
| **Fuentes** | Manrope (Google Fonts) | vía `@expo-google-fonts/manrope` |
| **Mapas** | Leaflet (web) / react-native-maps (pendiente móvil) | — |
| **Pagos** | Expo WebBrowser / react-native-webview | — |

**¿Por qué React Native + Expo?**
- Misma base de código para iOS y Android (RNF-09)
- Compatibilidad con Microsoft Authentication Library (MSAL) para OAuth institucional
- Expo Router = navegación basada en archivos, menos código repetitivo
- Expo EAS Build para despliegues OTA (actualizaciones sin pasar por tiendas)
- El equipo ya sabe JavaScript/TypeScript (curva de aprendizaje cero)

### ⚙️ Backend — API REST

| Decisión | Tecnología | Versión actual |
|---|---|---|
| **Runtime** | Node.js | 24.15 |
| **Framework** | NestJS | 10 |
| **Lenguaje** | TypeScript | 5.3 |
| **ORM** | TypeORM | 0.3 |
| **Validación** | class-validator + class-transformer | — |
| **Auth** | Passport.js (JWT) + bcrypt | — |
| **Documentación** | Swagger (`/api/v1/docs`) | — |
| **Rate limiting** | @nestjs/throttler | — |

**¿Por qué NestJS?**
- Mismo lenguaje que el frontend (TypeScript) — menos fricción
- Arquitectura modular obligatoria (cada funcionalidad es un módulo)
- Guards nativos para autenticación y roles
- class-validator integrado: valida datos automáticamente
- Soporte para microservicios si escala más adelante

### 🗄️ Base de Datos

| Decisión | Tecnología | Versión actual |
|---|---|---|
| **Motor** | PostgreSQL | 16 |
| **ORM** | TypeORM | 0.3 |
| **Migraciones** | Manuales vía `schema.sql` | — |

**¿Por qué PostgreSQL (y no MongoDB)?**
- Transacciones ACID completas — esencial para pagos (si falla, se revierte todo)
- Foreign keys y constraints — consistencia entre viajes, reservas, pagos
- Cifrado en reposo con `pgcrypto`
- TypeORM tiene integración oficial con NestJS

### 🔐 Autenticación

| Decisión | Tecnología | Estado |
|---|---|---|
| **Identity Provider** | Azure AD B2C (Microsoft 365 Unisabana) | Pendiente |
| **SDK Móvil** | @azure/msal-react-native | Pendiente |
| **Backend** | Passport.js + JWT | ✅ Implementado |
| **Validación email** | `@unisabana.edu.co` en `auth.service.ts` | ✅ Implementado |

**Nota**: Actualmente la autenticación funciona con JWT propio (registro + login con email y contraseña). La integración con Microsoft OAuth está como stub. Cuando se active, el flujo será: Azure AD emite JWT → backend lo valida con Passport.js.

### 💳 Pagos

| Decisión | Tecnología | Estado |
|---|---|---|
| **Pasarela seleccionada (documento)** | Wompi (Bancolombia) | No implementado |
| **Pasarela real (código)** | Mercado Pago | ✅ Implementado |

**Nota**: El documento original seleccionó Wompi como pasarela. En la implementación real se usó **Mercado Pago** porque ofrece sandbox gratuito con soporte para PSE y tarjetas sin necesidad de aprobación comercial. Es un cambio deliberado respecto al documento original.

### 🔔 Notificaciones

| Decisión | Tecnología | Estado |
|---|---|---|
| **Push** | Expo Push Notifications + FCM | ❌ No implementado |
| **Email** | Nodemailer + SMTP Microsoft 365 | ❌ No implementado |

### 🐳 Infraestructura

| Decisión | Tecnología | Estado |
|---|---|---|
| **Contenerización** | Docker + Docker Compose | 🟡 Solo Postgres + JMeter |
| **Nube** | Railway (propuesto en doc) | ❌ No implementado |
| **CI/CD** | No definido | ❌ No implementado |

### 📊 Resumen del stack real (código vs documento)

| Capa | Documento (docx) | Código actual |
|---|---|---|
| Frontend | Expo SDK 51+ | ✅ Expo SDK 54 |
| Backend | NestJS 10 | ✅ NestJS 10 |
| DB | PostgreSQL 16 + TypeORM | ✅ PostgreSQL 16 + TypeORM |
| Autenticación | Azure AD + MSAL + Passport.js | 🟡 JWT propio (Azure AD pendiente) |
| Pagos | Wompi | 🔄 Mercado Pago |
| Notificaciones | Expo Push + FCM + Nodemailer | ❌ No implementado |
| Infraestructura | Docker + Compose | 🟡 Parcial |

---

## Referencias

- Documento original: `3.1 Stack Tecnologico.docx`
- Autor: Juan Esteban Ocampo Manrique — Abril 2026
- Código real: `api/package.json`, `app/package.json`, `docker-compose.yaml`
