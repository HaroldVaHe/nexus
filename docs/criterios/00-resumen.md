# 📊 Nexus — Estado del Proyecto

> **Fecha**: 19 de mayo de 2026
> **Propósito**: Saber exactamente en qué vamos y qué falta.

---

## Leyenda

| Símbolo | Significado |
|---|---|
| ✅ Completo | Funciona, probado y documentado |
| 🟡 Parcial | Existe pero incompleto |
| ❌ Pendiente | No se ha empezado |

---

## Resumen general

| # | Criterio | Estado | Documentación |
|---|----------|--------|--------|
| 1 | Definición del Problema | ✅ Completo | Basado en `1.1 Definición del Problema.docx` |
| 2 | Buyer Persona | ✅ Completo | Basado en `1.2 Buyer Persona.docx` |
| 3 | Propuesta de Valor (UVP) | ✅ Completo | Basado en `1.3 Propuesta de Valor.docx` |
| 4 | Alcance MVP (MoSCoW) | ✅ Completo | Basado en `1.4 Alcance MVP.docx` |
| 5 | User Flow | 🟡 Parcial | Sin documento fuente |
| 6 | Wireframes / Prototipo | 🟡 Parcial | Sin documento fuente |
| 7 | UI Kit / Guía de Estilos | ✅ Completo | Basado en código (`colors.ts`) |
| 8 | Stack Tecnológico | ✅ Completo | Basado en `3.1 Stack Tecnologico.docx` + código |
| 9 | Modelo de Datos (DER) | ✅ Completo | Basado en `database/schema.sql` |
| 10 | Diseño de APIs / Webhooks | ✅ Completo | Swagger + módulos |
| 11 | Seguridad y Auth | ✅ Completo | JWT + guards + validación |
| 12 | Entorno de Dev (Setup) | ✅ Completo | AGENTS.md + scripts |
| 13 | Implementación Core | ✅ Completo | Todos los módulos |
| 14 | Integración de Terceros | 🟡 Parcial | MP ✅, OAuth 🟡, Maps 🟡, Notif ❌ |
| 15 | Pruebas Unitarias | ❌ Pendiente | Sin tests |
| 16 | QA de Interfaz | 🟡 Parcial | Solo Android |
| 17 | Pruebas de Carga | ✅ Completo | JMeter + scripts |
| 18 | Despliegue (Deploy) | 🟡 Parcial | Sin CI/CD, sin Dockerfile |
| 19 | Analytics & Monitoreo | ✅ Completo | Sentry + Winston + Health |
| 20 | Backup & Recovery | ❌ Pendiente | Sin scripts |
| 21 | Protección de Datos | 🟡 Parcial | Sin Habeas Data |
| 22 | Feedback Loop | 🟡 Parcial | Help Center OK, reports mock |

**Totales**: 14 ✅ · 6 🟡 · 2 ❌

---

## Detalle por criterio

### ✅ 1. Definición del Problema
- **Documento fuente**: `1.1 Definición del Problema.docx`
- Contexto: congestión en corredor Chía-Bogotá
- Problema: movilidad ineficiente afecta calidad de vida de estudiantes Unisabana
- Reto: ¿cómo reducir el impacto con una solución tecnológica?
- Solución: app de carpooling universitario con Sabana Coins
- **Archivo**: `docs/criterios/01-definicion-problema.md`

### ✅ 2. Buyer Persona
- **Documento fuente**: `1.2 Buyer Persona.docx`
- 2 perfiles: Laura Gómez (pasajero, 20-24) y Juan Pérez (conductor, 20-26)
- Dolor principal: costos, tiempo, desconfianza, ineficiencia
- **Archivo**: `docs/criterios/02-buyer-persona.md`

### ✅ 3. Propuesta de Valor (UVP)
- **Documento fuente**: `1.3 Propuesta de Valor.docx`
- 5 pilares: ecosistema cerrado, matching inteligente, reputación avanzada, Sabana Coins, sostenibilidad
- **Archivo**: `docs/criterios/03-propuesta-valor.md`

### ✅ 4. Alcance MVP (MoSCoW)
- **Documento fuente**: `1.4 Alcance MVP.docx`
- 8 Must Have: MH-01 a MH-08 (registro, publicar viaje, reservar, perfil, pago, notificaciones, historial, calificaciones)
- 2 excluidos: Sabana Points completo y moderación de reportes
- **Archivo**: `docs/criterios/04-alcance-mvp.md`

### 🟡 5. User Flow
- Sin documento fuente específico
- Flujo implementado en expo-router: `app/app/` con screens de auth, tabs, settings
- Pendiente: diagrama formal de navegación
- **Archivo**: `docs/criterios/05-user-flow.md`

### 🟡 6. Wireframes / Prototipo
- Sin documento fuente específico
- Diseño implementado directamente en código
- Pendiente: documentar mockups vs implementación real
- **Archivo**: `docs/criterios/06-wireframes.md`

### ✅ 7. UI Kit / Guía de Estilos
- Colores en `app/src/theme/colors.ts`
- Tipografía: Manrope (regular, medium, semibold, bold, extrabold)
- Componentes: TabHeader, HeaderMenu, etc.
- **Archivo**: `docs/criterios/07-ui-kit.md`

### ✅ 8. Stack Tecnológico
- **Documento fuente**: `3.1 Stack Tecnologico.docx`
- Frontend: Expo SDK 54 + React Native 0.81 + TypeScript 5.9
- Backend: NestJS 10 + TypeORM + PostgreSQL
- Diferencia notable: documento propone Wompi, código usa Mercado Pago
- **Archivo**: `docs/criterios/08-stack-tecnologico.md`

### ✅ 9. Modelo de Datos (DER)
- Schema completo: `database/schema.sql`
- 11 tablas + 3 vistas
- **Archivo**: `docs/criterios/09-modelo-datos.md`

### ✅ 10. Diseño de APIs / Webhooks
- Swagger en `GET /api/v1/docs`
- Módulos RESTful con prefijo `/api/v1/`
- **Archivo**: `docs/criterios/10-diseno-apis.md`

### ✅ 11. Seguridad y Auth
- JWT + bcrypt + email institucional + guards de roles + rate limiting
- **Archivo**: `docs/criterios/11-seguridad-auth.md`

### ✅ 12. Entorno de Dev (Setup)
- Git + scripts npm + Docker Compose + AGENTS.md
- **Archivo**: `docs/criterios/12-entorno-dev.md`

### ✅ 13. Implementación Core
- Módulos: auth, trips, bookings, payments, reviews, sabana-coins, vehicles, cards, health
- **Archivo**: `docs/criterios/13-implementacion-core.md`

### 🟡 14. Integración de Terceros
- Mercado Pago ✅, Microsoft OAuth 🟡 (stub), Maps 🟡 (Leaflet web), Notificaciones ❌
- **Archivo**: `docs/criterios/14-integracion-terceros.md`

### ❌ 15. Pruebas Unitarias
- Sin tests, sin framework, sin scripts
- **Archivo**: `docs/criterios/15-pruebas-unitarias.md`

### 🟡 16. QA de Interfaz
- Probado en Android (emulador Pixel API 35)
- iOS sin probar, web funcional
- **Archivo**: `docs/criterios/16-qa-interfaz.md`

### ✅ 17. Pruebas de Carga
- JMeter + Node.js simulator + Docker + scripts npm
- **Archivo**: `docs/criterios/17-pruebas-carga.md`

### 🟡 18. Despliegue (Deploy)
- Dominio stubbed, sin Dockerfile, sin CI/CD, sin nginx, sin SSL
- **Archivo**: `docs/criterios/18-despliegue.md`

### ✅ 19. Analytics & Monitoreo
- Sentry (frontend + backend) + Winston logs + Health Check
- **Archivo**: `docs/criterios/19-analytics-monitoreo.md`

### ❌ 20. Backup & Recovery
- Sin pg_dump, sin cron, sin migraciones, sin DR plan
- **Archivo**: `docs/criterios/20-backup-recovery.md`

### 🟡 21. Protección de Datos
- Menús UI sin contenido, sin Habeas Data, sin consentimiento real
- **Archivo**: `docs/criterios/21-proteccion-datos.md`

### 🟡 22. Feedback Loop
- Help Center completo, Report con mock data, contactos sin handlers
- **Archivo**: `docs/criterios/22-feedback-loop.md`

---

## Prioridades sugeridas

| Prioridad | Criterio | Esfuerzo |
|---|---|---|
| 🔴 Alta | Backup & Recovery | 1 día |
| 🔴 Alta | Protección de Datos (Habeas Data) | 2 días |
| 🟡 Media | Pruebas Unitarias | 3 días |
| 🟡 Media | User Flow + Wireframes (diagramas) | 1 día |
| 🟡 Media | Despliegue (Dockerfile + CI/CD) | 2 días |
| 🟡 Media | Integración Microsoft OAuth | 1 día |
| 🟢 Baja | QA de Interfaz (iOS) | Depende de Mac |

---

*Documento actualizado el 19 de mayo de 2026*
