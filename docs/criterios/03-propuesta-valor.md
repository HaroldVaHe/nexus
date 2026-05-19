# Propuesta de Valor — Para Dummies

> **Documento fuente**: `1.3 Propuesta de Valor.docx` (raíz del proyecto)
> **Autor**: Juan Esteban Ocampo Manrique

---

## ¿Qué es una Propuesta Única de Valor (UVP)?

La **Propuesta Única de Valor** (Unique Value Proposition, UVP) responde a la pregunta más importante de tu producto:

> **¿Por qué el usuario debería usar esto y no otra cosa?**

No es un eslogan bonito. Es la razón concreta por la que tu solución es diferente y mejor que las alternativas.

---

## ¿Por qué es importante?

Porque si no tienes una UVP clara:
- El usuario no entiende para qué sirve tu app
- No hay razón para elegirte frente a Uber, inDriver o el bus
- No puedes comunicar tu valor en 5 segundos (que es todo el tiempo que tienes)

---

## ¿Cómo se hace?

1. Analizas a la competencia (¿qué ofrecen?)
2. Identificas qué les falta (¿qué dolor no resuelven?)
3. Defines tu diferencial (¿qué haces mejor o diferente?)
4. Lo resumes en una frase clara

---

## Estado actual en Nexus

La UVP oficial del documento (`1.3 Propuesta de Valor.docx`) se estructura en **5 pilares diferenciales**:

### 🌐 1. Ecosistema cerrado universitario

Solo estudiantes verificados con correo `@unisabana.edu.co` pueden acceder. Esto reduce significativamente el riesgo percibido, genera confianza inicial y facilita la adopción del servicio al compartir un contexto común.

> **Diferencial vs Uber/indriver**: No es anónimo. Todos son compañeros de universidad.

### 🧠 2. Matching inteligente de rutas

La plataforma agrupa usuarios según ubicación, horarios y patrones de movilidad, optimizando trayectos colectivos en lugar de simplemente asignar viajes individuales.

> **Diferencial**: No es solo "pedir un viaje", es coordinar grupos con destinos y horarios compatibles.

### ⭐ 3. Sistema de reputación avanzado

A diferencia de plataformas como Uber que dependen principalmente de calificaciones numéricas, Nexus incorpora un sistema híbrido:

- Calificación numérica (1-5 estrellas)
- Comentarios detallados por viaje
- Etiquetas específicas (puntualidad, seguridad, comportamiento)
- Historial visible de cada usuario

> **Diferencial**: Sabes el contexto detrás de cada calificación, no solo un número.

### 🪙 4. Sistema de incentivos (Sabana Coins)

Los usuarios reciben recompensas por compartir trayectos y utilizar transporte sostenible. Estos incentivos pueden traducirse en beneficios dentro del campus, fomentando la adopción y retención.

> **Diferencial**: No solo ahorras dinero, también ganas puntos canjeables en la universidad.

### 🌱 5. Enfoque en sostenibilidad

La solución contribuye a la reducción del número de vehículos en circulación, disminuyendo la congestión y el impacto ambiental, alineándose con objetivos institucionales y el ODS 11.

### 📋 Conclusión del documento

> Nexus conecta a estudiantes para compartir trayectos de forma segura e inteligente, reduciendo costos, tráfico y estrés, mientras se incentiva la movilidad sostenible dentro del entorno universitario.

### En la app (código)

| Pilar | Implementación |
|---|---|
| Ecosistema cerrado | `auth.service.ts` — validación de email `@unisabana.edu.co` |
| Matching de rutas | `trips.service.ts` — búsqueda por origen, destino, fecha |
| Reputación | `reviews.module.ts` — calificaciones + comentarios por viaje |
| Sabana Coins | `sabana-coins.module.ts` — ledger de transacciones |
| Sostenibilidad | Transversal — reducción de viajes individuales |

---

## Referencias

- Documento original: `1.3 Propuesta de Valor.docx`
- Implementación: módulos `auth`, `trips`, `reviews`, `sabana-coins`
- ODS 11: Ciudades y Comunidades Sostenibles
