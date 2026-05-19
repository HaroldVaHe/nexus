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

**Backup automático con cron (Linux):**

```bash
# /etc/cron.daily/nexus-backup
#!/bin/bash
DATE=$(date +%Y-%m-%d)
BACKUP_DIR=/backups/nexus
mkdir -p $BACKUP_DIR
pg_dump -U postgres nexus | gzip > $BACKUP_DIR/nexus-$DATE.sql.gz

# Eliminar backups mayores a 30 días
find $BACKUP_DIR -name "*.sql.gz" -mtime +30 -delete
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

Las migraciones son archivos que describen **cambios** en la estructura de la BD (agregar tablas, columnas, índices). En Nexus no se usan migraciones; el schema se aplica manualmente con `database/schema.sql`.

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
| **Backup automático** | ❌ | No hay scripts de backup en el proyecto |
| **Cron jobs** | ❌ | No hay tareas programadas |
| **Migraciones** | ❌ | `database/schema.sql` es el único fuente de verdad, no hay migraciones |
| **Script de restore** | ❌ | No hay documentación ni scripts para restaurar |
| **Almacenamiento externo** | ❌ | No hay integración con S3, Google Drive ni similar |
| **Pruebas de recuperación** | ❌ | Nunca se ha probado restaurar desde backup |
| **Documentación de DR** | ❌ | No hay plan de disaster recovery |

### 4.1 Lo que existe (pero no es suficiente)

- `database/schema.sql` — El schema completo de la BD (414 líneas). Se puede regenerar parte de la estructura, pero **los datos se perderían**
- `api/src/config/database.config.ts` — Configuración de TypeORM con `synchronize: false`
- Comandos en `api/package.json` para migraciones (no implementadas):
  ```json
  "migration:generate": "typeorm migration:generate -d src/database/data-source.ts",
  "migration:run": "typeorm migration:run -d src/database/data-source.ts",
  "schema:sync": "typeorm schema:sync -d src/database/data-source.ts"
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

### 4.4 Lo que hay que implementar

1. **Script de backup** (`scripts/backup.sh`) que haga pg_dump con compresión
2. **Cron job** que ejecute el backup diariamente a las 3 AM
3. **Almacenamiento externo** (AWS S3, Google Cloud Storage, o un segundo servidor)
4. **Script de restore** (`scripts/restore.sh`) documentado y probado
5. **Migraciones TypeORM** para reemplazar el schema.sql manual
6. **Prueba de recuperación** al menos una vez al trimestre

## Resumen

Nexus no tiene backups, no tiene migraciones, y no hay plan de recuperación ante desastres. Si la base de datos se pierde hoy, se pierden **todos los datos** de usuarios, viajes, pagos y calificaciones. La estructura se puede recrear con `database/schema.sql`, pero los datos son irrecuperables. Esto es el riesgo más crítico del proyecto.
