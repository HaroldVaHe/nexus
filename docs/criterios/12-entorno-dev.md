# 12. Entorno de Desarrollo — Para Dummies

## 1. ¿Qué es un entorno de desarrollo?

El entorno de desarrollo es el "taller" donde un programador construye y prueba el software. Así como un carpintero necesita un banco de trabajo, herramientas y materiales, un desarrollador necesita:

- **Código fuente** — los planos del software
- **Base de datos** — donde se guarda la información
- **Servidor local** — para probar que todo funciona
- **Variables de entorno** — configuraciones secretas (contraseñas, tokens)
- **Editor de código** — donde se escribe el código

## 2. ¿Por qué es importante?

Sin un entorno de desarrollo bien configurado:

- **Pierdes tiempo** — cada vez que alguien nuevo llega al proyecto, tarda horas o días en poder empezar a trabajar
- **Errores raros** — "en mi máquina funciona" es la frase más famosa (y peligrosa) del desarrollo. Si cada quien configura su máquina diferente, aparecen errores que solo le pasan a una persona
- **No puedes probar** — sin base de datos local no puedes probar si tus cambios funcionan

## 3. ¿Cómo se hace en la práctica?

### 3.1 Control de versiones (Git)

Git es como un "historial de cambios" del código. Permite:

- Guardar versiones del código (`commit`)
- Trabajar en equipo sin pisarse (`branch`, `merge`)
- Volver a una versión anterior si algo se rompe (`checkout`)

El proyecto vive en un repositorio Git. Para obtenerlo:

```bash
git clone <url-del-repositorio>
cd nexus
```

### 3.2 Variables de entorno (.env)

Las variables de entorno son datos que el programa necesita pero que **no se guardan en el código** porque varían según la máquina o son secretos:

```
DATABASE_HOST=localhost
DATABASE_PORT=5432
JWT_SECRET=mi-clave-secreta
```

En Nexus se usa un archivo `.env` que se crea copiando `.env.example`:

```bash
cp api/.env.example api/.env
```

Luego se edita `.env` con los valores reales de cada desarrollador.

### 3.3 Base de datos

Nexus usa PostgreSQL. Se puede instalar de dos formas:

**Opción A: Instalación directa**

```bash
sudo apt-get install postgresql   # Linux
# O descargar desde postgresql.org en Windows/Mac
psql -U postgres -c "CREATE DATABASE nexus;"
psql -U postgres -d nexus -f database/schema.sql
```

**Opción B: Docker Compose (recomendado)**

```bash
docker compose up -d    # Inicia PostgreSQL en un contenedor
```

El `docker-compose.yaml` ya está configurado para exponer PostgreSQL en el puerto `5433`.

### 3.4 Instalar dependencias

Cada proyecto tiene sus "librerías" (código escrito por otros que se reutiliza). Se instalan con:

```bash
cd api && npm install    # Backend
cd app && npm install    # Frontend
```

### 3.5 Iniciar el servidor

```bash
cd api && npm run start:dev    # Backend en http://localhost:3000
cd app && npx expo start       # Frontend (app móvil)
```

### 3.6 Hot-reload

El modo `start:dev` detecta cambios en los archivos y reinicia el servidor automáticamente. Cambias el código, guardas, y el servidor se actualiza solo.

## 4. Estado actual en Nexus

| Componente | Estado | Detalle |
|---|---|---|
| **Git configurado** | ✅ | Repositorio con `.gitignore`, ramas, historial |
| **.env.example** | ✅ | `api/.env.example` con todas las variables necesarias |
| **Docker Compose** | ✅ | `docker-compose.yaml` con PostgreSQL 16 en puerto `5433` |
| **npm scripts** | ✅ | `start:dev`, `build`, `start:prod` documentados |
| **AGENTS.md** | ✅ | Instrucciones detalladas en la raíz del proyecto |
| **README.md** | ✅ | Guía de instalación paso a paso |
| **TypeORM sync OFF** | ✅ | `synchronize: false` en `api/src/config/database.config.ts:8` |
| **Hot-reload** | ✅ | NestJS watch mode funcionando |
| **Base de datos** | ✅ | Schema en `database/schema.sql` — 12 tablas, índices, triggers |

**Archivos clave:**
- `AGENTS.md` — Instrucciones para el equipo de desarrollo
- `api/.env.example` — Plantilla con todas las variables requeridas
- `docker-compose.yaml` — PostgreSQL + JMeter en contenedores
- `api/src/config/database.config.ts` — Configuración de TypeORM

### 4.1 Variables de entorno requeridas

| Variable | Propósito |
|---|---|
| `DATABASE_HOST`/`DATABASE_PORT` | Conexión a PostgreSQL |
| `DATABASE_USERNAME`/`DATABASE_PASSWORD` | Credenciales de BD |
| `DATABASE_NAME` | Nombre de la base de datos (`nexus`) |
| `JWT_SECRET` | Clave para firmar tokens JWT |
| `JWT_EXPIRATION` | Duración del token (default `7d`) |
| `MP_PUBLIC_KEY`/`MP_ACCESS_TOKEN` | Credenciales de Mercado Pago |
| `FRONTEND_URL` | URL de la app para redirecciones de pago |
| `SENTRY_DSN` | DSN de Sentry para monitoreo de errores |

### 4.2 Flujo completo para un nuevo desarrollador

```bash
# 1. Clonar
git clone <url> nexus
cd nexus

# 2. Base de datos
docker compose up -d postgres
psql -U postgres -c "CREATE DATABASE nexus;"
psql -U postgres -d nexus -f database/schema.sql

# 3. Backend
cd api
cp .env.example .env          # Editar con datos reales
npm install
npm run start:dev

# 4. Frontend (otra terminal)
cd app
npm install
npx expo start
```

### 4.3 Lo que falta

- **Migraciones automáticas**: No hay migraciones TypeORM. El schema se aplica manualmente con `schema.sql`. Esto funciona pero requiere intervención manual cada vez que cambia la BD.
- **Script de setup automatizado**: No hay un solo comando (`make setup` o `npm run setup`) que haga todo automáticamente.
- **DevContainer**: No hay configuración de DevContainer para VS Code que permita entornos completamente aislados.

## Resumen

El entorno de desarrollo de Nexus está bien documentado y es fácil de configurar: clonas, copias `.env`, instalas, corres PostgreSQL con Docker, y listo. Lo más importante es **no olvidar crear el `.env`** y **no activar `synchronize: true`** en TypeORM (está explícitamente en `false` para no sobrescribir el schema manual).
