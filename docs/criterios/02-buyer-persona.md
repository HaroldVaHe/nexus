# Buyer Persona — Para Dummies

> **Documento fuente**: `1.2 Buyer Persona.docx` (raíz del proyecto)
> **Autor**: Juan Esteban Ocampo Manrique

---

## ¿Qué es un Buyer Persona?

Un **Buyer Persona** es un perfil ficticio pero realista del usuario ideal de tu producto. No es "cualquier persona" — es un personaje con nombre, edad, hábitos, frustraciones y metas.

En Nexus hay **2 tipos de usuarios** (personas), porque el producto conecta a quien ofrece el viaje con quien lo necesita:

| Tipo | Rol en la app |
|---|---|
| **Pasajero** | Busca y reserva cupos en viajes |
| **Conductor** | Publica sus trayectos y ofrece cupos |

---

## ¿Por qué es importante?

Porque no puedes construir algo para "todos". Si diseñas para todos, diseñas para nadie. El Buyer Persona te obliga a:

- Tomar decisiones concretas de diseño pensando en personas reales
- Priorizar funcionalidades según el perfil que más las necesita
- Validar tus suposiciones con usuarios reales similares al perfil

---

## ¿Cómo se hace?

1. **Investigar**: encuestas, entrevistas, observación de usuarios reales
2. **Identificar patrones**: frustraciones comunes, metas compartidas
3. **Crear perfiles**: darles nombre, edad, historia
4. **Validar**: probar el producto con personas que encajan en el perfil

---

## Estado actual en Nexus

El documento oficial (`1.2 Buyer Persona.docx`) define **2 personas**:

### 🚶 Pasajero — Laura Gómez

| Atributo | Detalle |
|---|---|
| **Nombre** | Laura Gómez |
| **Edad** | 20–24 años |
| **Rol** | Consumidor de viajes |
| **Objetivo** | Reducir costos y tiempo de desplazamiento |
| **Pain points** | Costos altos de transporte (Uber/múltiples medios), tráfico, incertidumbre en tiempos, desconfianza al compartir con desconocidos |
| **Qué valora** | Precio bajo, seguridad, facilidad de uso, disponibilidad de rutas |

### 🚗 Conductor — Juan Pérez

| Atributo | Detalle |
|---|---|
| **Nombre** | Juan Pérez |
| **Edad** | 20–26 años |
| **Rol** | Proveedor de viajes |
| **Objetivo** | Monetizar o compensar sus trayectos |
| **Pain points** | Gastos de gasolina, parqueadero y mantenimiento; viajar solo (ineficiencia); falta de incentivos; riesgo de llevar desconocidos |
| **Qué valora** | Seguridad, incentivos económicos o beneficios, control de horarios, facilidad de coordinación |

### 🎯 Resumen del documento

> El sistema tiene dos tipos de usuarios: estudiantes que necesitan movilizarse, optimizar costo y tiempo (pasajeros); y estudiantes que ya realizan el trayecto y pueden ofrecer cupos para optimizar sus recursos y obtener beneficios (conductores). La solución genera valor para ambos al aumentar la confianza mediante un **entorno cerrado y verificado** (solo comunidad Unisabana).

### En la app (código)

Los roles están implementados en:

- **`api/src/modules/auth/`**: Registro/login con验证 de email institucional (`@unisabana.edu.co`)
- **`api/src/database/entities/user-role.entity.ts`**: Tabla `user_roles` con tipos `passenger` y `driver`
- **`app/app/(tabs)/`**: Navegación condicional según rol (solo drivers ven "Publicar", solo passengers ven "Buscar")
- **`app/src/context/AuthContext.tsx`**: Manejo de sesión con datos del usuario y roles

---

## Referencias

- Documento original: `1.2 Buyer Persona.docx`
- Implementación en código: `api/src/modules/auth/`, `api/src/database/entities/user-role.entity.ts`
