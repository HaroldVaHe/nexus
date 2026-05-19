# 18. Despliegue a Producción — Para Dummies

## 1. ¿Qué es el despliegue a producción?

El **despliegue** (deployment) es el proceso de llevar tu aplicación desde tu computadora personal a un servidor en internet donde los usuarios reales puedan usarla.

Es como la diferencia entre tener un restaurante en tu cocina (desarrollo) vs abrirlo al público en un local comercial (producción).

| Ambiente | Quién lo usa | Propósito |
|---|---|---|
| **Desarrollo** | Tú | Programar y probar cambios |
| **Staging** | El equipo | Validar que todo funciona antes de producción |
| **Producción** | Usuarios reales | El producto final funcionando |

## 2. ¿Por qué es importante?

- **Disponibilidad 24/7**: El servidor de producción debe estar siempre encendido
- **Seguridad**: Producción debe tener HTTPS, contraseñas fuertes, actualizaciones de seguridad
- **Rendimiento**: Los usuarios esperan respuestas rápidas
- **Recuperación**: Si algo falla, hay que poder volver a una versión anterior rápidamente
- **Dominio propio**: Los usuarios no van a escribir `http://192.168.1.2:3000` — necesitan `https://nexus.app`

## 3. ¿Cómo se hace en la práctica?

### 3.1 Componentes de un despliegue

```
Usuario ──▶ Internet ──▶ DNS ──▶ Nginx ──▶ App Server ──▶ Base de Datos
                           │         │
                        Dominio    SSL/HTTPS
```

| Componente | ¿Qué hace? | Ejemplo |
|---|---|---|
| **DNS** | Traduce `nexus.app` a una dirección IP | Cloudflare, Route53 |
| **Reverse Proxy (Nginx)** | Sirve archivos estáticos, maneja SSL, redirige tráfico | Nginx, Caddy |
| **SSL/HTTPS** | Encripta la comunicación | Let's Encrypt |
| **App Server** | Ejecuta tu código Node.js | Servidor VPS, AWS EC2 |
| **Base de Datos** | Guarda los datos | PostgreSQL en RDS o VPS |
| **CI/CD** | Automatiza el despliegue | GitHub Actions, GitLab CI |

### 3.2 Proceso típico de despliegue

1. **Compilar el código**: `npm run build` — convierte TypeScript a JavaScript
2. **Subir archivos al servidor**: `scp`, `rsync`, o Docker
3. **Instalar dependencias**: `npm install --production`
4. **Configurar variables de entorno**: `.env` con valores de producción
5. **Iniciar el servidor con PM2**: `pm2 start dist/main.js`
6. **Configurar Nginx**: Proxy reverso hacia el puerto del servidor
7. **Obtener SSL**: Certbot / Let's Encrypt
8. **Configurar dominio**: Apuntar DNS al servidor

### 3.3 Docker para producción

En lugar de instalar todo directamente en el servidor, se usa Docker:

```dockerfile
# Dockerfile para la API
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist/ ./dist/
EXPOSE 3000
CMD ["node", "dist/main.js"]
```

## 4. Estado actual en Nexus

| Componente | Estado | Evidencia |
|---|---|---|
| **Dockerfiles** | ❌ | No hay `api/Dockerfile` ni `app/Dockerfile` |
| **Dominio configurado** | 🟡 | `app/src/utils/config.ts:15` — `api.nexus.unisabana.edu.co` es un stub |
| **CI/CD** | ❌ | No hay GitHub Actions, GitLab CI ni similar |
| **Nginx configurado** | ❌ | No hay configuración de proxy reverso |
| **SSL/HTTPS** | ❌ | No hay certificados SSL |
| **Script de deploy** | ❌ | No hay `deploy.sh` ni automatización |
| **PM2 o similar** | ❌ | No hay gestor de procesos para producción |
| **Compilación producción** | 🟡 | `api/package.json:11` — `start:prod` existe pero nunca se ha usado en producción |

### 4.1 Lo que está listo para producción

- **Código compilable**: `npm run build` funciona y genera `dist/`
- **Variables de entorno**: El `.env.example` tiene todas las variables necesarias
- **CORS configurado**: `api/src/main.ts:26-30` — CORS habilitado para cualquier origen
- **Logging en producción**: `api/src/main.ts:19-21` — Modo producción silencia logs de debug
- **Swagger**: Documentación del API en `/api/docs`

### 4.2 Lo que falta para producción

**1. Dockerfiles**

Necesario para empaquetar la app y desplegarla consistentemente:

```dockerfile
# api/Dockerfile (no existe)
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json tsconfig*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY package*.json ./
EXPOSE 3000
CMD ["node", "dist/main.js"]
```

**2. CI/CD**

Un pipeline básico que:
- Ejecute lint al hacer push
- Compile el código
- (Opcional) Ejecute pruebas
- Despliegue automáticamente al hacer merge a `main`

**3. Nginx + SSL**

```nginx
# /etc/nginx/sites-available/nexus (no existe)
server {
    listen 443 ssl;
    server_name api.nexus.unisabana.edu.co;

    ssl_certificate /etc/letsencrypt/live/api.nexus.unisabana.edu.co/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.nexus.unisabana.edu.co/privkey.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

**4. PM2**

```bash
# Gestor de procesos para mantener la app corriendo
pm2 start dist/main.js --name nexus-api
pm2 save
pm2 startup
```

**5. Frontend build**

La app React Native/Expo requiere un proceso diferente:
- **Expo EAS Build** para generar APK/IPA
- O usar `expo export:web` para versión web

### 4.3 Costos estimados

| Recurso | Costo mensual estimado |
|---|---|
| **VPS/EC2** (2GB RAM, 2 vCPU) | ~$10-20 USD |
| **PostgreSQL** (o en el mismo VPS) | ~$0-15 USD |
| **Dominio** (.com, .app) | ~$10-15/año |
| **SSL** (Let's Encrypt) | $0 (gratis) |
| **Certificado Apple Developer** (para iOS) | $99/año |
| **Total** | **~$300-400/año** |

## Resumen

Nexus no está listo para producción. Le faltan componentes fundamentales: Dockerfiles, CI/CD, Nginx, SSL, y un proceso de despliegue automatizado. El dominio está stubeado y los scripts de producción (`start:prod`) nunca se han probado en un entorno real. Lo mínimo indispensable para desplegar sería crear un Dockerfile para la API, configurar Nginx con Let's Encrypt, y establecer un pipeline básico de CI/CD.
