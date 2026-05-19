# 20. Backup y Recuperación — Para Dummies

## 1. ¿Qué es backup y recuperación?

Un **backup** es una copia de seguridad de tu base de datos. Así como guardas una foto importante en la nube por si se pierde tu teléfono, un backup guarda los datos de la app por si algo sale mal.

La **recuperación** es el proceso de restaurar esos datos cuando ocurre un desastre.

**Tipos de desastres:**
- Alguien borra datos accidentalmente (`DELETE FROM users;`)
- Un bug corrompe la información
- El servidor se daña físicamente
- Un ataque ransomware encripta la base de datos
- Error humano durante un despliegue

## 2. ¿Por qué es importante?

- **Los datos son lo más valioso**: El código se puede reescribir, pero los datos de usuarios, viajes y pagos no se recuperan
- **Pérdida de confianza**: Si pierdes los datos de los usuarios, nunca volverán a usar la app
- **Obligación legal**: En Colombia, la Ley de Habeas Data exige proteger los datos personales
- **Tiempo de recuperación**: Sin backups, recuperarse de un desastre puede tomar días o semanas. Con backups, minutos
- **Regla 3-2-1**: 3 copias, en 2 medios diferentes, 1 fuera del sitio

## 3. ¿Cómo se hace en la práctica?

### 3.1 Backup de PostgreSQL

**Backup básico con pg_dump:**

```bash
# Backup de toda la base de datos
pg_dump -U postgres -h localhost nexus > backup_2026-05-19.sql

# Restaurar
psql -U postgres -h localhost nexus < backup_2026-05-19.sql
```

**Backup automático (scripts en el proyecto):**

| Script | Ubicación | Descripción |
|---|---|---|
| `backup.sh` | `scripts/backup.sh` | Bash — pg_dump + gzip + S3 + retención 30d |
| `backup.js` | `api/scripts/backup.js` | Node.js cross-platform (Win/WSL) |
| `restore.sh` | `scripts/restore.sh` | Bash — restaura con confirmación |
| `restore.js` | `api/scripts/restore.js` | Node.js — restaura con decompresión |

**npm scripts (api/):**
```bash
npm run backup              # Backup completo + S3 (si configurado)
npm run backup:now          # Solo local, sin cloud
npm run restore -- <file>   # Restaurar desde backup
```

**Programación automática:**
- **Linux/WSL**: `crontab/nexus-backup` — cron diario a las 3 AM
- **Windows**: `crontab/schedule-task.ps1` — Task Scheduler a las 3 AM

**Almacenamiento externo (S3-compatible):**
```bash
# Configurar en .env
BACKUP_S3_BUCKET=my-nexus-backups
BACKUP_S3_ENDPOINT=https://s3.amazonaws.com
BACKUP_AWS_ACCESS_KEY_ID=...
BACKUP_AWS_SECRET_ACCESS_KEY=...
```

### 3.2 Tipos de backup

| Tipo | Descripción | Tamaño | Velocidad |
|---|---|---|---|
| **Completo** | Toda la base de datos | Grande (100% de los datos) | Lento |
| **Incremental** | Solo cambios desde el último backup | Pequeño | Rápido |
| **Diferencial** | Solo cambios desde el último completo | Mediano | Medio |

### 3.3 Estrategias de recuperación

**RPO** (Recovery Point Objective): ¿Cuántos datos puedes perder? Si haces backups cada 24h, pierdes hasta 24h de datos.

**RTO** (Recovery Time Objective): ¿Qué tan rápido necesitas recuperarte? Idealmente < 1 hora.

Para Nexus, una estrategia razonable:
- Backup completo **cada 24 horas**
- Retención de **30 días**
- Almacenar en **2 lugares**: servidor local + cloud (S3, Google Drive)
- Probar la recuperación **1 vez al mes**

### 3.4 Migraciones de base de datos

Las migraciones son archivos que describen **cambios** en la estructura de la BD (agregar tablas, columnas, índices). En Nexus ahora se usa un enfoque híbrido: `database/schema.sql` sigue disponible, pero una migración inicial (`api/src/database/migrations/20260519000000-InitialSchema.ts`) captura todo el schema para que TypeORM pueda rastrear cambios futuros.

**Por qué son importantes:**
- Permiten versionar los cambios en la BD junto con el código
- Se pueden revertir si algo sale mal
- Cada desarrollador puede actualizar su BD local con un comando
- Evitan errores de "me olvidé de correr el script"

### 3.5 Ejemplo de migración (TypeORM)

```typescript
// api/src/database/migrations/1680000000000-AddFacultyToUsers.ts
import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFacultyToUsers1680000000000 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE users ADD COLUMN faculty VARCHAR(150)`);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE users DROP COLUMN faculty`);
  }
}
```

## 4. Estado actual en Nexus

| Componente | Estado | Evidencia |
|---|---|---|
| **Backup automático** | ✅ | `scripts/backup.sh` + `api/scripts/backup.js` |
| **Cron jobs / Task Scheduler** | ✅ | `crontab/nexus-backup` (Linux/WSL) + `crontab/schedule-task.ps1` (Windows) |
| **Migraciones** | ✅ | `api/src/database/migrations/20260519000000-InitialSchema.ts` |
| **Script de restore** | ✅ | `scripts/restore.sh` + `api/scripts/restore.js` |
| **Almacenamiento externo** | ✅ | S3-compatible vía `.env` (`BACKUP_S3_BUCKET`, `BACKUP_S3_ENDPOINT`, etc.) |
| **Pruebas de recuperación** | ❌ | Nunca se ha probado restaurar desde backup |
| **Documentación de DR** | ❌ | No hay plan de disaster recovery |

### 4.1 Lo que existe

- `database/schema.sql` — El schema completo de la BD (414 líneas). Se puede regenerar parte de la estructura, pero **los datos se perderían**
- `api/src/config/database.config.ts` — Configuración de TypeORM con `synchronize: false`
- `api/src/database/migrations/20260519000000-InitialSchema.ts` — Migración inicial con todo el schema (idempotente sobre BD existente)
- `api/scripts/backup.js` + `api/scripts/restore.js` — Scripts cross-platform (funcionan en Windows y WSL)
- `scripts/backup.sh` + `scripts/restore.sh` — Scripts Bash para Linux/WSL
- `crontab/nexus-backup` + `crontab/schedule-task.ps1` — Automatización diaria 3 AM
- Comandos en `api/package.json`:
  ```json
  "backup": "node scripts/backup.js",
  "backup:now": "node scripts/backup.js --no-upload",
  "restore": "node scripts/restore.js",
  "migration:generate": "typeorm migration:generate -d src/database/data-source.ts",
  "migration:run": "typeorm migration:run -d src/database/data-source.ts",
  "migration:revert": "typeorm migration:revert -d src/database/data-source.ts"
  ```

### 4.2 Datos críticos que perderías sin backup

| Tabla | Datos |
|---|---|
| `users` | Nombres, emails, hashes de contraseña (240+ registros potenciales) |
| `vehicles` | Placas, marcas, modelos registrados |
| `trips` | Viajes publicados con rutas y precios |
| `bookings` | Reservas de asientos |
| `payments` | Registros de pago con referencias de Mercado Pago |
| `reviews` | Calificaciones entre usuarios |
| `sabana_coins_ledger` | Saldo e historial de monedas virtuales |

### 4.3 Plan mínimo recomendado

```bash
#!/bin/bash
# scripts/backup.sh — Backup diario de Nexus
# 1. Crear el backup
BACKUP_FILE="/backups/nexus/nexus-$(date +%Y-%m-%d-%H%M%S).sql"

pg_dump \
  -h ${DATABASE_HOST:-localhost} \
  -U ${DATABASE_USERNAME:-postgres} \
  -d ${DATABASE_NAME:-nexus} \
  --no-owner \
  > "$BACKUP_FILE"

gzip "$BACKUP_FILE"

# 2. Subir a cloud (ejemplo con AWS S3)
# aws s3 cp "${BACKUP_FILE}.gz" "s3://nexus-backups/"

# 3. Limpiar backups antiguos (>30 días)
find /backups/nexus -name "*.sql.gz" -mtime +30 -delete

echo "Backup completado: ${BACKUP_FILE}.gz"
```

### 4.4 Estado de implementación

| # | Requisito | Estado |
|---|---|---|
| 1 | Script de backup (pg_dump + compresión) | ✅ `scripts/backup.sh` + `api/scripts/backup.js` |
| 2 | Automatización diaria (3 AM) | ✅ `crontab/nexus-backup` + `crontab/schedule-task.ps1` |
| 3 | Almacenamiento externo (S3) | ✅ Configurable vía `.env`, integrado en scripts |
| 4 | Script de restore documentado | ✅ `scripts/restore.sh` + `api/scripts/restore.js` |
| 5 | Migraciones TypeORM | ✅ Migración inicial creada, comandos en `package.json` |
| 6 | Prueba de recuperación trimestral | ❌ Pendiente — hay que ejecutar `npm run restore` y verificar |
| 7 | Documentación de disaster recovery | ❌ Pendiente — plan formal de DR

## Resumen

Nexus ya tiene scripts de backup y restore (bash + Node.js cross-platform), automatización diaria (cron para Linux/WSL, Task Scheduler para Windows), migraciones TypeORM, y soporte para almacenamiento externo S3-compatible. La infraestructura está lista. Lo que **falta**: probar una restauración real y documentar un plan formal de disaster recovery. Sin esos dos pasos, aún hay riesgo de no poder recuperarse correctamente cuando ocurra un incidente.
