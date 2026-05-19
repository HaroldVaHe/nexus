# 15. Pruebas Unitarias — Para Dummies

## 1. ¿Qué son las pruebas unitarias?

Una **prueba unitaria** es un pequeño programa que verifica que una función específica de tu código funciona correctamente. Es como probar cada pieza de un motor antes de armarlo completo.

Imagina que tienes una función que suma dos números:

```typescript
function sumar(a: number, b: number): number {
  return a + b;
}
```

Una prueba unitaria sería:

```typescript
// Verificar que 2 + 3 = 5
test('sumar 2 + 3 = 5', () => {
  expect(sumar(2, 3)).toBe(5);
});

// Verificar que números negativos también funcionan
test('sumar -1 + 1 = 0', () => {
  expect(sumar(-1, 1)).toBe(0);
});
```

## 2. ¿Por qué son importantes?

- **Detectan errores temprano**: Encuentras el bug cuando lo escribes, no cuando el usuario lo reporta
- **Te da confianza**: Puedes hacer cambios sabiendo que si algo se rompe, las pruebas te avisan
- **Documentan el código**: Una prueba bien escrita dice "esto es lo que se espera que haga esta función"
- **Ahorran tiempo a largo plazo**: Arreglar un error en desarrollo toma minutos. En producción, horas o días
- **Permiten refactorizar**: Puedes reescribir código sin miedo a romper funcionalidad existente

## 3. ¿Cómo se hacen en la práctica?

### 3.1 Framework de pruebas

En el mundo Node.js, el framework más usado es **Jest**. También se puede usar **Mocha** + **Chai**. Para NestJS, Jest es el estándar.

```bash
# Instalar Jest en un proyecto NestJS
npm install --save-dev jest @types/jest ts-jest
```

### 3.2 Estructura de una prueba

```typescript
// auth.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('debería rechazar emails que no sean @unisabana.edu.co', () => {
    expect(service.validateInstitutionalDomain('test@gmail.com')).toBe(false);
    expect(service.validateInstitutionalDomain('test@unisabana.edu.co')).toBe(true);
  });
});
```

### 3.3 ¿Qué probar primero?

No todo el código merece pruebas con la misma prioridad. Lo que **debe** probarse primero:

1. **Lógica de negocio crítica**: Validación de dominio, cálculos de precios, reglas de negocio
2. **Servicios principales**: AuthService, TripsService, PaymentsService
3. **Validaciones**: DTOs, reglas de negocio (no más asientos disponibles que total, no reservar en viaje propio)
4. **Casos borde**: ¿Qué pasa si el email es nulo? ¿Si la fecha de viaje es pasada? ¿Si el saldo de Sabana Coins es insuficiente?

### 3.4 Mocks

Cuando pruebas un servicio que depende de la base de datos, no quieres usar la base de datos real (sería lento y frágil). En lugar de eso, creas un **mock** (un simulacro):

```typescript
// Mock del repositorio de usuarios
const mockUsersRepository = {
  findOne: jest.fn().mockResolvedValue(null),
  create: jest.fn().mockReturnValue({ id: '123' }),
  save: jest.fn().mockResolvedValue({ id: '123', email: 'test@unisabana.edu.co' }),
};
```

## 4. Estado actual en Nexus

| Aspecto | Estado | Evidencia |
|---|---|---|
| **Framework de pruebas instalado** | ❌ | `api/package.json` no tiene Jest ni ningún framework de testing |
| **Pruebas existentes** | ❌ | No hay ningún archivo `*.spec.ts` ni `*.test.ts` en el proyecto |
| **Configuración de testing** | ❌ | No hay `jest.config.js` ni `tsconfig.spec.json` |
| **Script de pruebas** | ❌ | No hay `npm run test` en `api/package.json` |
| **Cobertura** | ❌ | 0% |

**Evidencia en el código:**
- `api/package.json:46-54` — En `devDependencies` solo tiene compilación y tipos, **no hay Jest**
- No hay directorio `__tests__` en ningún módulo
- `AGENTS.md:31` — Dice explícitamente: "No tests — No test suites exist in either package"

### 4.1 ¿Qué se debería probar primero?

**Prioridad 1 — AuthService** (`api/src/modules/auth/auth.service.ts`):
- `validateInstitutionalDomain()` — ¿Rechaza correctamente emails no institucionales?
- `register()` — ¿Crea usuario, hashea contraseña, lanza error si email ya existe?
- `login()` — ¿Valida credenciales, verifica estado de cuenta?
- `verifyMicrosoftToken()` — ¿Stub devuelve el mock esperado?

**Prioridad 2 — TripsService** (`api/src/modules/trips/trips.service.ts`):
- `create()` — ¿Crea viaje con asientos correctos?
- `findAll()` — ¿Filtra por origen, destino, fecha, asientos?
- `cancelTrip()` — ¿Solo el conductor puede cancelar?
- `update()` — ¿Actualiza asientos disponibles correctamente?

**Prioridad 3 — PaymentsService** (`api/src/modules/payments/payments.service.ts`):
- `createPreference()` — ¿Valida que la reserva exista, pertenezca al usuario, no esté ya pagada?
- `verifyPayment()` — ¿Actualiza estado correctamente según collection_status?

**Prioridad 4 — BookingsService**:
- ¿No permite reservar más asientos de los disponibles?
- ¿No permite al conductor reservar su propio viaje?

### 4.2 Configuración mínima necesaria

```json
// api/package.json — Agregar:
"devDependencies": {
  "jest": "^29.7.0",
  "ts-jest": "^29.1.0",
  "@types/jest": "^29.5.0"
},
"scripts": {
  "test": "jest",
  "test:watch": "jest --watch",
  "test:cov": "jest --coverage"
}
```

### 4.3 Beneficios esperados para Nexus

Si se implementaran pruebas unitarias:

- **Menos bugs en producción**: Errores como permitir registros con email incorrecto se detectarían automáticamente
- **Desarrollo más rápido**: Los cambios en el código se podrían verificar en segundos sin necesidad de probar manualmente en la app
- **Mejor código**: Escribir pruebas obliga a escribir código mejor estructurado y más fácil de mantener
- **Documentación viva**: Las pruebas muestran cómo se espera que funcione cada parte del sistema

## Resumen

Nexus no tiene ninguna prueba unitaria. No hay framework instalado, no hay configuración, no hay scripts. Para un proyecto que maneja pagos, datos personales y transacciones, esto es un riesgo alto. Lo primero que debería probarse es `AuthService` (validación de dominio institucional) y `TripsService` (reglas de creación de viajes).
