# UI Kit / Guía de Estilo — Para Dummies

## ¿Qué es un UI Kit?

Un **UI Kit** (Kit de Interfaz de Usuario) es una colección de todos los elementos visuales que usa una aplicación: colores, textos, botones, tarjetas, inputs, iconos. Es como un **manual de estilo** para diseñadores y desarrolladores.

El UI Kit asegura que la app se vea consistente en todas las pantallas, sin importar quién la diseñe o programe.

## Por Qué es Importante

- **Consistencia.** El usuario ve la misma app en cada pantalla, no un Frankenstein visual.
- **Velocidad.** Los desarrolladores no tienen que inventar colores o tamaños cada vez.
- **Escalabilidad.** Cuando el equipo crece, todos siguen las mismas reglas.
- **Marca.** Una identidad visual sólida hace que la app sea reconocible.

## Componentes del UI Kit de Nexus

### 1. Colores

Definidos en `app/src/theme/colors.ts`:

#### Colores Primarios

| Token | Código Hex | Uso |
|---|---|---|
| `primary.default` | `#0F172A` | Fondo oscuro, encabezados, texto principal |
| `primary.light` | `#1E293B` | Variante clara del primario |
| `primary.dark` | `#020617` | Variante oscura del primario |
| `primary.contrast` | `#FFFFFF` | Texto sobre fondo primario |

#### Colores Secundarios

| Token | Código Hex | Uso |
|---|---|---|
| `secondary.default` | `#6366F1` | Botones principales, enlaces, acentos |
| `secondary.light` | `#818CF8` | Hover, variante clara |
| `secondary.dark` | `#4F46E5` | Presionado, variante oscura |
| `secondary.contrast` | `#FFFFFF` | Texto sobre fondo secundario |

#### Colores Terciarios

| Token | Código Hex | Uso |
|---|---|---|
| `tertiary.default` | `#0D9488` | Sabana Coins, éxito, badges |
| `tertiary.light` | `#14B8A6` | Variante clara |
| `tertiary.dark` | `#0F766E` | Variante oscura |
| `tertiary.contrast` | `#FFFFFF` | Texto sobre fondo terciario |

#### Colores Neutro

| Token | Código Hex | Uso |
|---|---|---|
| `neutral.default` | `#787778` | Texto secundario, íconos |
| `neutral.light` | `#D1D5DB` | Bordes suaves, separadores |
| `neutral.dark` | `#6B7280` | Texto placeholder |
| `neutral.lightest` | `#F3F4F6` | Fondos de tarjetas, secciones |

#### Colores de Fondo

| Token | Código Hex | Uso |
|---|---|---|
| `background.default` | `#F8FAFC` | Fondo general de la app |
| `background.card` | `#FFFFFF` | Fondo de tarjetas y modales |
| `background.overlay` | `rgba(15, 23, 42, 0.5)` | Overlay de modales |
| `background.elevated` | `#FFFFFF` | Fondo de elementos elevados |

#### Colores de Texto

| Token | Código Hex | Uso |
|---|---|---|
| `text.primary` | `#0F172A` | Texto principal |
| `text.secondary` | `#475569` | Texto secundario, descripciones |
| `text.muted` | `#94A3B8` | Texto deshabilitado, etiquetas |
| `text.inverse` | `#FFFFFF` | Texto sobre fondos oscuros |
| `text.link` | `#6366F1` | Enlaces |
| `text.success` | `#059669` | Mensajes de éxito |
| `text.error` | `#DC2626` | Mensajes de error |

#### Colores de Borde

| Token | Código Hex | Uso |
|---|---|---|
| `border.default` | `#E2E8F0` | Bordes generales |
| `border.dark` | `#CBD5E1` | Bordes más notorios |
| `border.focus` | `#6366F1` | Borde de input enfocado |
| `border.error` | `#FCA5A5` | Borde de input con error |
| `border.success` | `#6EE7B7` | Borde de input exitoso |

#### Colores de Estado

| Token | Código Hex | Uso |
|---|---|---|
| `status.error` | `#DC2626` | Alertas de error |
| `status.errorBg` | `#FEF2F2` | Fondo de alerta de error |
| `status.success` | `#059669` | Alertas de éxito |
| `status.successBg` | `#ECFDF5` | Fondo de alerta de éxito |
| `status.warning` | `#D97706` | Alertas de advertencia |
| `status.warningBg` | `#FFFBEB` | Fondo de alerta de advertencia |
| `status.info` | `#2563EB` | Alertas informativas |
| `status.infoBg` | `#EFF6FF` | Fondo de alerta informativa |

#### Colores Microsoft

| Token | Código Hex | Uso |
|---|---|---|
| `microsoft.blue` | `#0078D4` | Botón de login con Microsoft |
| `microsoft.hover` | `#106EBE` | Hover del botón Microsoft |

#### Sombras

| Token | Color | Uso |
|---|---|---|
| `shadow.sm` | `rgba(15, 23, 42, 0.08)` | Sombras pequeñas |
| `shadow.md` | `rgba(15, 23, 42, 0.12)` | Sombras medianas |
| `shadow.lg` | `rgba(15, 23, 42, 0.16)` | Sombras grandes |

---

### 2. Espaciado

| Token | px | Uso típico |
|---|---|---|
| `spacing.xs` | 4 | Espacio mínimo entre elementos |
| `spacing.sm` | 8 | Padding interno de tarjetas |
| `spacing.md` | 16 | Padding estándar, margen entre secciones |
| `spacing.lg` | 24 | Margen entre secciones grandes |
| `spacing.xl` | 32 | Padding de pantalla |
| `spacing.xxl` | 48 | Separación de bloques mayores |
| `spacing.xxxl` | 64 | Separación máxima |

---

### 3. Bordes Redondeados

| Token | px | Uso |
|---|---|---|
| `borderRadius.xs` | 4 | Inputs, botones pequeños |
| `borderRadius.sm` | 8 | Tarjetas, modales |
| `borderRadius.md` | 12 | Componentes medianos |
| `borderRadius.lg` | 16 | Tarjetas grandes |
| `borderRadius.xl` | 24 | Modales, bottomsheets |
| `borderRadius.xxl` | 32 | Elementos especiales |
| `borderRadius.full` | 9999 | Círculos, avatares |

---

### 4. Tipografía — Manrope

**Fuente:** Manrope (cargada via `@expo-google-fonts/manrope`)

#### Variantes (Font Family)

| Token | Nombre Técnico |
|---|---|
| `family.regular` | `Manrope_400Regular` |
| `family.medium` | `Manrope_500Medium` |
| `family.semibold` | `Manrope_600SemiBold` |
| `family.bold` | `Manrope_700Bold` |
| `family.extrabold` | `Manrope_800ExtraBold` |

#### Tamaños

| Token | px | Uso |
|---|---|---|
| `sizes.xs` | 12 | Etiquetas, texto pequeño |
| `sizes.sm` | 14 | Cuerpo pequeño, descripciones |
| `sizes.md` | 16 | Texto de cuerpo estándar |
| `sizes.lg` | 18 | Subtítulos |
| `sizes.xl` | 20 | Títulos de sección |
| `sizes.xxl` | 24 | Títulos de pantalla |
| `sizes.xxxl` | 32 | Títulos grandes |
| `sizes.heading` | 40 | Títulos principales |

#### Pesos

| Token | Valor | Uso |
|---|---|---|
| `weights.regular` | 400 | Texto de cuerpo |
| `weights.medium` | 500 | Énfasis suave |
| `weights.semibold` | 600 | Subtítulos |
| `weights.bold` | 700 | Títulos |
| `weights.extrabold` | 800 | Títulos grandes, números |

#### Altura de Línea (Line Height)

| Token | Valor | Uso |
|---|---|---|
| `lineHeight.tight` | 1.15 | Títulos |
| `lineHeight.normal` | 1.5 | Texto de cuerpo |
| `lineHeight.relaxed` | 1.75 | Texto largo, legibilidad |

---

### 5. Componentes Compartidos

Definidos en `app/src/components/`:

| Componente | Archivo | Función |
|---|---|---|
| **TabHeader** | `TabHeader.tsx` | Encabezado con pestañas para navegación entre secciones |
| **HeaderMenu** | `HeaderMenu.tsx` | Menú desplegable en el encabezado con opciones de navegación |
| **PageHeader** | `PageHeader.tsx` | Encabezado genérico de pantalla con título y botón de retroceso |
| **LoginButton** | `LoginButton.tsx` | Botón de inicio de sesión (email/password o Microsoft) |
| **PaymentButton** | `PaymentButton.tsx` | Botón de pago integrado con pasarela |
| **LocationSelector** | `LocationSelector.tsx` | Selector de ubicación con búsqueda y mapa |
| **MapPickerModal** | `MapPickerModal.tsx` | Modal para seleccionar punto en el mapa |
| **LeafletMap** | `LeafletMap.tsx` | Componente de mapa (Leaflet para web) |

## Cómo se Usa el UI Kit en el Código

Los componentes importan los colores, espaciados y tipografía desde `app/src/theme/colors.ts`:

```typescript
import { colors, spacing, borderRadius, typography } from 'src/theme/colors';

// Ejemplo: usar un color primario
<View style={{ backgroundColor: colors.primary.default }}>

// Ejemplo: usar espaciado estándar
<View style={{ padding: spacing.md }}>

// Ejemplo: usar tipografía
<Text style={{
  fontFamily: typography.family.semibold,
  fontSize: typography.sizes.lg,
}}>
```

## Cómo se Hace en la Práctica

1. **Define la paleta de colores.** 3-5 colores base y sus variantes.
2. **Elige una tipografía.** 1-2 fuentes con variantes de peso.
3. **Define espaciado y bordes.** Una escala numérica consistente.
4. **Crea componentes base.** Botón, Input, Tarjeta, Etiqueta.
5. **Documenta todo.** En un archivo de código (como `colors.ts`) y/o en Figma.
6. **Mantén la consistencia.** Revisa periódicamente que todos los desarrolladores sigan el UI Kit.

## Estado Actual en Nexus

El UI Kit de Nexus está **completamente implementado** en `app/src/theme/colors.ts` y `app/src/components/`.

| Elemento | Estado |
|---|---|
| Colores (paleta completa) | ✅ Implementado |
| Tipografía (Manrope + pesos) | ✅ Implementado |
| Espaciado (escala 4-64px) | ✅ Implementado |
| Bordes redondeados | ✅ Implementado |
| Sombras (web/native) | ✅ Implementado |
| Componentes UI compartidos | ✅ 8 componentes implementados |
| Documentación visual (Figma) | ❌ No en el repositorio (pendiente) |

El siguiente paso recomendado es crear un **Storybook** o una pantalla de galería de componentes dentro de la app para visualizar todos los componentes del UI Kit en un solo lugar.
