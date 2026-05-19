# 17. Pruebas de Carga — Para Dummies

## 1. ¿Qué son las pruebas de carga?

Una **prueba de carga** consiste en simular que muchos usuarios usan la aplicación al mismo tiempo para ver si el servidor aguanta. Es como probar un puente: no esperas a que 1000 personas lo crucen para ver si se cae; lo pruebas con 1000 personas de mentiras primero.

Ejemplo concreto: Simular que 50 pasajeros verifican su pago al mismo tiempo después de un viaje compartido.

## 2. ¿Por qué son importantes?

- **Saber cuándo se rompe**: El servidor puede funcionar perfecto con 1 usuario, pero fallar con 50 concurrentes
- **Identificar cuellos de botella**: ¿La base de datos es lenta? ¿El código tiene una consulta ineficiente?
- **Planificar infraestructura**: Si sabes que soportas 100 usuarios concurrentes, sabes que necesitas escalar cuando tengas 200
- **Evitar sorpresas en producción**: El día del lanzamiento, 100 personas entran a la app y el servidor se cae
- **Cumplir expectativas**: Los usuarios esperan que la app responda en menos de 2 segundos

## 3. ¿Cómo se hacen en la práctica?

### 3.1 Herramientas comunes

| Herramienta | Descripción |
|---|---|
| **Apache JMeter** | La herramienta más popular. Crea planes de prueba con interfaz gráfica |
| **k6** | Moderna, basada en JavaScript, código en lugar de interfaz |
| **Artillery** | Node.js, fácil de configurar |
| **Locust** | Python, programática |

### 3.2 Conceptos clave

| Término | Significado |
|---|---|
| **Hilos (threads)** | Usuarios virtuales simulados |
| **Ramp-up** | Tiempo en que los usuarios van apareciendo gradualmente (no todos a la vez) |
| **Loops** | Cuántas veces cada usuario repite la acción |
| **TPS** | Transacciones por segundo |
| **P95/P99** | El percentil 95/99 de tiempo de respuesta (el 95% de las solicitudes respondieron en X ms) |
| **SLI/SLO** | Métricas y objetivos de rendimiento |

### 3.3 Proceso típico

1. **Definir el escenario**: ¿Qué endpoint probar? ¿Cuántos usuarios? ¿Con qué datos?
2. **Preparar los datos**: Crear usuarios de prueba, tokens JWT, IDs de reserva
3. **Ejecutar la prueba**: JMeter envía solicitudes simultáneas
4. **Analizar resultados**: Tiempos de respuesta, tasa de error, TPS
5. **Optimizar**: Si algo es lento, mejorar el código o la BD
6. **Repetir**: Hasta alcanzar los objetivos de rendimiento

## 4. Estado actual en Nexus

| Componente | Estado | Evidencia |
|---|---|---|
| **Plan JMeter** | ✅ | `jmeter/payment-verify.jmx` — prueba de carga para `POST /payments/verify` |
| **Script de tráfico Node.js** | ✅ | `api/scripts/simulate-payment-traffic.js` — simulador alternativo |
| **Docker JMeter** | ✅ | `docker-compose.yaml:15-37` — servicio `jmeter` listo |
| **Script de ejecución** | ✅ | `jmeter/run-payments.ps1` — script PowerShell para Windows |
| **Generación de tokens de prueba** | ✅ | `api/scripts/create-test-jwt.js` — crea JWT para pruebas |
| **Resultados de pruebas** | ✅ | Directorio `jmeter/results/` con reportes previos |

### 4.1 Cómo ejecutar las pruebas de carga

**Opción 1: Docker Compose (recomendado)**

```bash
# Asegúrate de que el API esté corriendo en localhost:3000
cd api && npm run start:dev

# En otra terminal, ejecuta JMeter en Docker
docker compose --profile tools run jmeter
```

**Opción 2: Script npm (Windows)**

```bash
cd api
npm run traffic:jmeter
```

**Opción 3: Simulador Node.js (multiplataforma)**

```bash
cd api
node scripts/simulate-payment-traffic.js
```

### 4.2 Configuración del plan JMeter

El archivo `jmeter/payment-verify.jmx` prueba el endpoint de verificación de pagos con estos parámetros:

| Parámetro | Default | Descripción |
|---|---|---|
| `THREADS` | 10 | Usuarios concurrentes |
| `LOOPS` | 5 | Iteraciones por usuario |
| `RAMP_SECONDS` | 5 | Tiempo de rampa (segundos) |
| `API_BASE_URL` | `http://host.docker.internal:3000/api/v1` | URL del API |
| `TOKEN` | (auto-generado) | JWT para autenticación |
| `BOOKING_ID` | `66666666-6666-6666-6666-666666666666` | ID de reserva a verificar |

### 4.3 Resultados que genera JMeter

Después de ejecutar, JMeter produce:

```
jmeter/results/
├── payment-verify-compose.jtl           # Datos crudos (CSV)
└── payment-verify-compose-report/       # Reporte HTML navegable
    └── index.html                       # Abrir en navegador
```

El reporte HTML muestra:
- **Gráfico de tiempos de respuesta** (promedio, mediana, P90, P95, P99)
- **Throughput** (solicitudes por minuto)
- **Tasa de error** (porcentaje de solicitudes fallidas)
- **Gráfico de latencia** a lo largo del tiempo

### 4.4 Archivos existentes

```plaintext
jmeter/
├── payment-verify.jmx         # Plan de JMeter (XML)
├── run-payments.ps1           # Script de ejecución (PowerShell)
├── README.md                  # Documentación de las pruebas
└── results/                   # Resultados de ejecuciones anteriores

api/scripts/
├── simulate-payment-traffic.js  # Simulador Node.js alternativo
└── create-test-jwt.js           # Generador de JWT de prueba
```

### 4.5 Lo que falta

| Aspecto | Situación actual | Recomendación |
|---|---|---|
| **Cobertura de endpoints** | Solo prueba `payments/verify` | Agregar planes para auth, trips, bookings |
| **Script multiplataforma** | Solo Windows (PowerShell) | Crear versión bash para Linux/Mac |
| **Pruebas de escalabilidad** | No hay escenarios de escalado progresivo | 10 usuarios → 50 → 100 → 500 |
| **Integración CI/CD** | No hay pruebas automáticas en cada commit | Agregar a GitHub Actions |
| **Objetivos de rendimiento** | No hay SLIs/SLOs definidos | Definir máximos aceptables (ej: P95 < 2s) |

### 4.6 Cómo interpretar los resultados

```plaintext
# Ejemplo de salida esperada:
summary +   500 en 00:00:30 = 16.7/s
     resp: promedio=120ms, mediana=95ms, p90=210ms, p95=350ms
     errores: 0 (0.0%)
```

- **16.7/s**: 16.7 solicitudes por segundo
- **promedio=120ms**: Tiempo de respuesta promedio
- **p95=350ms**: El 95% de las solicitudes respondieron en menos de 350ms
- **errores: 0 (0.0%)**: Ninguna solicitud falló

**Señales de alerta:**
- Tasa de error > 1%
- P95 > 2000ms (2 segundos)
- Throughput decreciente (el servidor se satura)
- Errores 500 o timeout

## Resumen

Nexus tiene pruebas de carga funcionales usando JMeter para el endpoint de verificación de pagos. Se ejecutan con Docker Compose y hay un simulador alternativo en Node.js. Sin embargo, solo cubren un endpoint y están limitadas a Windows. Lo ideal sería expandir las pruebas a todos los endpoints críticos y automatizarlas en CI/CD.
