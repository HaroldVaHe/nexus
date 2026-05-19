# 22. Feedback Loop — Para Dummies

## 1. ¿Qué es un feedback loop?

Un **feedback loop** (ciclo de retroalimentación) es el proceso mediante el cual los usuarios de una aplicación pueden **reportar problemas, sugerir mejoras, y recibir respuesta** del equipo de desarrollo.

Es como un buzón de sugerencias en un restaurante: los clientes escriben lo que piensan, y el restaurante lee los comentarios y mejora el servicio.

En una app moderna, el feedback loop tiene 3 partes:

```
Usuario reporta problema ──▶ Equipo analiza ──▶ Se implementa mejora ──▶ Se informa al usuario
         ▲                                                                    │
         └────────────────────── Cierre del ciclo ────────────────────────────┘
```

## 2. ¿Por qué es importante?

- **Los usuarios ven cosas que tú no ves**: Ellos usan la app en contextos que no imaginaste (con poco internet, en dispositivos viejos, de formas inesperadas)
- **Prioriza mejoras**: Saber qué es lo que más molestia causa a los usuarios ayuda a decidir qué arreglar primero
- **Fideliza usuarios**: Cuando un usuario reporta un bug y luego ve que lo arreglaste, siente que su opinión importa
- **Reduce tickets de soporte**: Una buena sección de ayuda (FAQ) responde preguntas comunes antes de que el usuario necesite contactar
- **Mejora continua**: Sin feedback externo, el equipo asume que todo está bien... hasta que los usuarios se van

## 3. ¿Cómo se hace en la práctica?

### 3.1 Canales de feedback

| Canal | Propósito | Ejemplo |
|---|---|---|
| **FAQ / Centro de ayuda** | Responder preguntas frecuentes | Pantalla con preguntas y respuestas |
| **Reporte de problemas** | Reportar bugs o incidentes | Formulario con categorías |
| **Encuestas** | Medir satisfacción | "¿Qué tan satisfecho estás?" |
| **Calificaciones en stores** | Feedback público | App Store / Google Play |
| **Contacto directo** | Soporte humano | Email, WhatsApp, chat |
| **Analytics** | Feedback implícito | Ver dónde abandonan los usuarios |

### 3.2 Qué debe incluir un reporte de bug

Un buen formulario de reporte debería pedir:

```
1. ¿Qué estabas haciendo? (ej: "iba a reservar un viaje")
2. ¿Qué esperabas que pasara? (ej: "que se confirmara la reserva")
3. ¿Qué pasó realmente? (ej: "la app mostró un error y me devolvió al inicio")
4. ¿En qué pantalla? (ej: "pantalla de detalle del viaje")
5. Captura de pantalla (opcional)
```

### 3.3 El ciclo completo

```
1. Usuario reporta problema
2. El equipo recibe el reporte (automatizado)
3. Se categoriza (bug, sugerencia, duda)
4. Se prioriza (crítico, alta, media, baja)
5. Se asigna a un desarrollador
6. Se implementa la solución
7. Se despliega la corrección
8. Se informa al usuario (opcional pero recomendado)
```

## 4. Estado actual en Nexus

| Componente | Estado | Evidencia |
|---|---|---|
| **Centro de ayuda (FAQ)** | 🟡 | `app/app/help.tsx` — Pantalla completa con búsqueda, categorías, FAQ expandible |
| **Pantalla de reportes** | 🟡 | `app/app/report/` — 2 pantallas (`index.tsx`, `[id].tsx`) pero con **datos mock** |
| **Botón de contacto** | 🟡 | `app/app/help.tsx:57-60` — Botón "Chatear con nosotros" sin handler real |
| **Email de contacto** | 🟡 | `app/app/help.tsx:96-99` — Ícono de email presente, sin acción real |
| **WhatsApp de contacto** | 🟡 | `app/app/help.tsx:107-112` — Ícono de WhatsApp presente, sin acción real |
| **Teléfono de contacto** | 🟡 | `app/app/help.tsx:101-105` — Ícono de teléfono presente, sin acción real |
| **Reporte de bug backend** | ❌ | No hay endpoint `POST /reports` en el backend |
| **Notificaciones de respuesta** | ❌ | No hay sistema para informar al usuario que su reporte fue atendido |
| **Analytics de abandonos** | ❌ | No hay seguimiento de dónde abandonan los usuarios |
| **Encuestas de satisfacción** | ❌ | No hay NPS ni encuestas in-app |

### 4.1 Archivos existentes

**Centro de ayuda:** `app/app/help.tsx`
- Búsqueda de FAQ
- Categorías (General, Pagos, Viajes, Cuenta)
- 7 preguntas frecuentes con respuestas expandibles
- Sección de contacto con íconos de email, teléfono, WhatsApp
- Diseño completo con theme, colores, tipografía Manrope

**Reportes:** `app/app/report/index.tsx`
- Lista de viajes recientes (MOCK_DATA)
- Selección de viaje para reportar
- Botón "Continuar" que navega a `report/[id]`

**Reporte detalle:** `app/app/report/[id].tsx`
- (no leído completamente pero presumiblemente formulario de reporte)

### 4.2 Lo que existe pero no funciona

Los botones de contacto en `app/app/help.tsx` están **sin handlers**:

```typescript
// help.tsx:57 — Botón "Chatear con nosotros"
<TouchableOpacity onPress={/* ❌ No hay handler */}>

// help.tsx:95-112 — Contacto email, teléfono, WhatsApp
<TouchableOpacity style={styles.contactOption}>
  {/* ❌ No hay Linking.openURL ni otra acción */}
```

Los reportes en `app/app/report/index.tsx` usan datos **mock**:

```typescript
const MOCK_RECENT_TRIPS = [
  { id: '1', driver_name: 'Carlos Martínez', ... },
  { id: '2', driver_name: 'María López', ... },
  // Datos simulados, no vienen del backend
];
```

### 4.3 Lo que falta implementar

**1. Backend para reportes**

Crear endpoint `POST /api/v1/reports`:
```typescript
// api/src/modules/reports/reports.controller.ts
@Post()
async create(@Body() createReportDto: CreateReportDto, @Req() req) {
  return this.reportsService.create(createReportDto, req.user.id);
}
```

**2. Conectar frontend de reportes con backend**
- Reemplazar `MOCK_RECENT_TRIPS` con datos reales del API
- Enviar el reporte al backend
- Mostrar confirmación de envío

**3. Activar canales de contacto**
- Email: `Linking.openURL('mailto:soporte@nexus.app')`
- Teléfono: `Linking.openURL('tel:+571234567')`
- WhatsApp: `Linking.openURL('https://wa.me/571234567')`

**4. Sistema de notificación de respuesta**
- Cuando el equipo responde a un reporte, enviar notificación push al usuario
- O al menos un mensaje in-app

**5. FAQ mantenible**
- Las preguntas y respuestas están en `app/src/i18n/translations/es.ts`
- Se podrían cargar desde el backend para actualizarlas sin publicar nueva versión

### 4.4 Traducciones existentes para ayuda

```typescript
// app/src/i18n/translations/es.ts (contenido parcial)
help: {
  title: 'Centro de Ayuda',
  faq: 'Preguntas Frecuentes',
  searchPlaceholder: 'Buscar ayuda...',
  needMoreHelp: '¿Necesitas más ayuda?',
  contactDesc: 'Estamos aquí para ayudarte',
  chatWithUs: 'Chatear con nosotros',
  // FAQ en i18n
  faqData: {
    publishTrip: { q: '¿Cómo publicar un viaje?', a: '...' },
    bookSeat: { q: '¿Cómo reservar un asiento?', a: '...' },
    sabanaCoins: { q: '¿Qué son Sabana Coins?', a: '...' },
    payment: { q: '¿Cómo funciona el pago?', a: '...' },
  }
}
```

## Resumen

El centro de ayuda tiene una interfaz bonita y completa (FAQ, búsqueda, categorías, contacto), pero los botones de contacto **no hacen nada**, los reportes usan **datos mock**, y no hay backend para recibir reportes. Para cerrar el feedback loop correctamente, se necesita: conectar contacto con Linking, implementar backend de reportes, y reemplazar datos mock con datos reales del API.
