# Wireframes y Prototipos — Para Dummies

## ¿Qué son los Wireframes?

Un **wireframe** es un boceto básico de una pantalla. Es como el plano de arquitectura de una casa antes de construirla: muestra la estructura, la posición de los elementos, pero no los colores, las imágenes ni los detalles finales.

Los wireframes pueden ser:
- **Baja fidelidad:** Dibujados a mano o con formas simples (rectángulos, líneas). Rápidos de hacer, baratos de cambiar.
- **Alta fidelidad:** Casi idénticos al producto final, con colores, tipografía e imágenes reales. También se llaman **prototipos** o **mockups**.

## Diferencia entre Wireframe, Mockup y Prototipo

| Término | Descripción | ¿Interactivo? |
|---|---|---|
| **Wireframe** | Boceto estructural. Cajas y texto placeholder. | No |
| **Mockup** | Diseño visual estático. Colores, fuentes, imágenes. | No |
| **Prototipo** | Mockup interactivo. Puedes hacer clic y navegar. | Sí |

Un buen flujo de trabajo es: Wireframe → Mockup → Prototipo → Código.

## Por Qué son Importantes

- **Baratos de cambiar.** Mover un botón en un wireframe toma 2 segundos. Moverlo en código puede tomar horas.
- **Comunican ideas.** Un dibujo vale más que mil palabras. Todos (diseñadores, desarrolladores, clientes) ven lo mismo.
- **Detectan problemas temprano.** ¿El botón de pago está muy pequeño? ¿La información está mal organizada? Se detecta antes de programar.
- **Pruebas con usuarios.** Puedes probar un prototipo con usuarios reales antes de invertir en desarrollo.

## Cómo se Hacen en la Práctica

1. **Lista las pantallas del user flow.** Identifica cada pantalla necesaria.
2. **Wireframe de baja fidelidad.** Dibuja cada pantalla en papel o en herramientas digitales. Solo estructura.
3. **Revisa con el equipo.** ¿La navegación tiene sentido? ¿Falta alguna pantalla?
4. **Mockup de alta fidelidad.** Aplica colores, tipografía, imágenes reales.
5. **Prototipo interactivo.** Conecta las pantallas con enlaces/clics para simular la navegación real.
6. **Prueba con usuarios.** Siéntate con 5 estudiantes y obsérvalos usar el prototipo.
7. **Itera.** Basado en la retroalimentación, ajusta y repite.

### Herramientas Populares

| Herramienta | Ideal para | ¿Gratis? |
|---|---|---|
| **Figma** | Diseño colaborativo en tiempo real | Sí (plan gratuito) |
| **Adobe XD** | Prototipado y diseño vectorial | Sí (plan gratuito limitado) |
| **Balsamiq** | Wireframes de baja fidelidad rápidos | Pago |
| **Sketch** | Diseño de interfaces macOS | Pago |
| **Lápiz y papel** | Ideas rápidas, brainstorming | ¡Gratis! |

## Lo que se Evalúa en un Wireframe

Cuando pruebas wireframes con usuarios, debes verificar:

- **Claridad:** ¿El usuario entiende qué hacer en cada pantalla sin instrucciones?
- **Navegación:** ¿Puede el usuario completar la tarea principal sin perderse?
- **Jerarquía visual:** ¿La información más importante es la más visible?
- **Consistencia:** ¿Los botones, colores y tipografía son consistentes en todas las pantallas?
- **Accesibilidad:** ¿Los textos son legibles? ¿Los botones son suficientemente grandes?

## Estado Actual en Nexus

Los wireframes y prototipos de Nexus existen como **archivos .docx** en la raíz del repositorio:

| Archivo | Contenido Estimado |
|---|---|
| `1.1 Definición del Problema.docx` | Contexto del problema, posiblemente incluye wireframes iniciales |
| `1.2 Buyer Persona.docx` | Perfil del usuario, que guía el diseño visual |
| `1.3 Propuesta de Valor.docx` | Diferenciadores que influyen en el diseño |

Además, los archivos de diseño también pueden estar documentados junto con el stack tecnológico en `3.1 Stack Tecnologico.docx`.

### ¿Dónde están los prototipos?

Actualmente, los prototipos interactivos **no están en el repositorio de código** (no se versionan archivos de Figma en Git). Se recomienda que los diseñadores mantengan los prototipos en **Figma** o **Adobe XD** y exporten capturas de pantalla al repositorio para referencia.

### La UI real en el código

El diseño final (que debió empezar como wireframes) está implementado en:

| Ubicación | Contenido |
|---|---|
| `app/app/*.tsx` y `app/app/**/*.tsx` | Pantallas completas de la app |
| `app/src/components/` | Componentes reutilizables (TabHeader, HeaderMenu, etc.) |
| `app/src/theme/colors.ts` | Paleta de colores completa |
| `app/src/theme/` | Configuración de tema |

## Flujo de Trabajo Recomendado para Diseño en Nexus

```
1. Definición del Problema (documento)
       │
       ▼
2. Buyer Persona (documento)
       │
       ▼
3. User Flow (documento + diagrama)
       │
       ▼
4. Wireframes (papel o Figma)
       │
       ▼
5. Prototipo interactivo (Figma)
       │
       ▼
6. Pruebas con usuarios (5-10 estudiantes)
       │
       ▼
7. Implementación en código (React Native / Expo)
       │
       ▼
8. QA y pruebas de usabilidad
```

## Resumen

Los wireframes son el puente entre una idea y el código. Son baratos de crear, fáciles de cambiar y esenciales para validar que el diseño tiene sentido antes de invertir horas de programación. En Nexus, los diseños iniciales están documentados en archivos .docx, y la UI final está implementada en el código de la app. Para futuras iteraciones, se recomienda usar Figma para crear prototipos interactivos y probarlos con estudiantes antes de codificar.
