# Alcance del MVP (MoSCoW) — Para Dummies

> **Documento fuente**: `1.4 Alcance MVP.docx` (raíz del proyecto)
> **Autor**: Juan Esteban Ocampo Manrique

---

## ¿Qué es un MVP?

**MVP** significa **Producto Mínimo Viable** (Minimum Viable Product). Es la versión más simple de tu producto que aún resuelve el problema principal.

No es "la app con todo medio hecho". Es "la app con lo mínimo indispensable para que el usuario obtenga valor".

---

## ¿Qué es MoSCoW?

MoSCoW es un método para priorizar funcionalidades:

| Letra | Significado | ¿Qué pasa si no está? |
|---|---|---|
| **M**ust | Indispensable | El producto no sirve |
| **S**hould | Importante | Se puede lanzar, pero duele |
| **C**ould | Deseable | Sería bonito tenerlo |
| **W**on't | Fuera de alcance | No se hace (por ahora) |

---

## ¿Por qué es importante?

Porque sin un MVP definido:
- El proyecto nunca termina (siempre hay algo más que añadir)
- Gastas tiempo en funcionalidades que quizás nadie usa
- No puedes medir si la solución realmente funciona

---

## Estado actual en Nexus

El documento oficial (`1.4 Alcance MVP.docx`) define **8 Must Have** para el MVP, basados en el backlog priorizado y los requisitos funcionales (RF-01 a RF-10).

### 📋 Must Have (MVP) — Cerrados

| ID | Historia de Usuario | ¿Qué hace? | RF |
|---|---|---|---|
| **MH-01** | Registro con correo institucional | Solo `@unisabana.edu.co`. Error claro si credenciales inválidas. | RF-01 |
| **MH-02** | Publicar viaje | Origen, destino, fecha, hora, cupos, costo. Validación de campos obligatorios. Editar/cancelar antes de partir. | RF-02 |
| **MH-03** | Buscar y reservar cupo | Filtra por ruta y horario. Descuenta cupo automáticamente. Notifica al conductor. | RF-02, RF-10 |
| **MH-04** | Ver perfil y reputación | Nombre, foto, facultad, rating. Historial de viajes. Comentarios públicos. | RF-07 |
| **MH-05** | Pago en app | PSE, tarjeta, Sabana Points. Validación de fondos. Comprobante. Rollback si falla. | RF-03 |
| **MH-06** | Notificaciones en tiempo real | Push + email si cancelan o cambian viaje. Reembolso automático si aplica. | RF-10 |
| **MH-07** | Historial de viajes | Fecha, ruta, costo, estado. Filtros por fecha/tipo. | RF-05, RF-10 |
| **MH-08** | Calificaciones entre usuarios | Solo después del viaje. Escala 1-5 + comentario. Un solo voto por trayecto. | RF-08 |

### 📊 Cobertura por dimensión de valor

| Dimensión | Must Have | Objetivo |
|---|---|---|
| **Acceso seguro** | MH-01 | Ecosistema cerrado y confiable |
| **Coordinación de trayectos** | MH-02, MH-03 | Reducir congestión |
| **Confianza comunitaria** | MH-04, MH-08 | Confianza entre usuarios verificados |
| **Transacción económica** | MH-05 | Formalizar intercambio económico |
| **Experiencia y trazabilidad** | MH-06, MH-07 | Reducir incertidumbre |

### 🚫 Excluido del MVP (Post-MVP v1.1)

| ID | Funcionalidad | Razón |
|---|---|---|
| EX-01 | Sabana Points completo (redención) | Requiere acuerdos institucionales |
| EX-02 | Reportes con moderación admin | Requiere panel administrativo |

### En la app (código)

| MH | Implementado en |
|---|---|
| MH-01 | `api/src/modules/auth/` + validación email institucional |
| MH-02 | `api/src/modules/trips/` + `app/app/publish.tsx` |
| MH-03 | `api/src/modules/trips/` + `app/app/search.tsx` |
| MH-04 | `api/src/modules/users/` + `app/app/profile.tsx` |
| MH-05 | `api/src/modules/payments/` + Mercado Pago |
| MH-06 | No implementado (❌) |
| MH-07 | `api/src/modules/trips/` + historial |
| MH-08 | `api/src/modules/reviews/` |

---

## Referencias

- Documento original: `1.4 Alcance MVP.docx`
- Autor: Juan Esteban Ocampo Manrique — Abril 2026
- Backlog: Tabla VIII del artículo de diseño
