# 21. Protección de Datos (Habeas Data) — Para Dummies

## 1. ¿Qué es la protección de datos?

La **protección de datos personales** es el conjunto de reglas y prácticas que garantizan que la información de los usuarios (nombre, email, teléfono, ubicación) sea tratada de manera segura, legal y transparente.

En Colombia, esto está regulado por la **Ley Estatutaria 1581 de 2012**, conocida como **Ley de Habeas Data**. Esta ley dice que:

- Las empresas deben **informar** qué datos recopilan y para qué
- Las empresas deben **pedir permiso** explícito antes de usar los datos
- Los usuarios tienen derecho a **acceder, corregir y eliminar** sus datos
- Los datos solo se pueden usar para el propósito informado

## 2. ¿Por qué es importante?

- **Es ley**: En Colombia, incumplir la Ley 1581 puede resultar en multas de hasta 2.000 salarios mínimos (más de $2.000 millones COP) y sanciones de la Superintendencia de Industria y Comercio (SIC)
- **Confianza del usuario**: La gente no usará una app que no cuide sus datos
- **Reputación**: Una filtración de datos puede destruir la imagen de la universidad y del proyecto
- **Datos sensibles**: Nexus maneja ubicación en tiempo real, pagos, y datos personales — información que requiere protección especial
- **Responsabilidad ética**: Como proyecto universitario, debe dar ejemplo de buenas prácticas

## 3. ¿Cómo se hace en la práctica?

### 3.1 Componentes de un sistema de protección de datos

**1. Aviso de Privacidad (Política de Tratamiento de Datos)**

Un documento claro que explica:
- Qué datos se recopilan (nombre, email, ubicación, vehículo, pagos)
- Para qué se usan (conectar conductores con pasajeros, procesar pagos)
- Con quién se comparten (Mercado Pago para pagos, Microsoft para OAuth)
- Derechos del usuario (acceso, corrección, eliminación, revocación)
- Tiempo de conservación de los datos
- Cómo contactar al responsable del tratamiento

**2. Consentimiento informado**

El usuario debe aceptar explícitamente la política de datos antes de registrarse. Esto se hace típicamente con:
- Un **checkbox** no marcado por defecto
- Un enlace a la política de privacidad completa
- Botón de "Aceptar" antes de crear la cuenta

No es legal usar cláusulas pre-marcadas ni esconder el consentimiento en términos y condiciones.

**3. Derechos del usuario (ARCO)**

La ley reconoce 5 derechos:
- **A**cceder: Saber qué datos tiene la empresa sobre ti
- **C**orregir: Actualizar datos incorrectos
- **S**olicitar prueba de la autorización: Que la empresa demuestre que pediste permiso
- **R**evocar: Cancelar la autorización para usar tus datos
- **E**liminar: Que borren tus datos (cuando corresponda)

**4. Medidas de seguridad**

- Encriptación en tránsito (HTTPS)
- Contraseñas almacenadas con hash (bcrypt)
- Tokens JWT con expiración
- No almacenar datos sensibles innecesarios

### 3.2 Requisitos específicos para Colombia (Ley 1581)

| Requisito | ¿Qué implica? |
|---|---|
| **Registro en SIC** | Las bases de datos deben registrarse en la Superintendencia de Industria y Comercio |
| **Aviso de privacidad** | Debe estar disponible antes de recoger datos |
| **Consentimiento previo** | El usuario debe autorizar explícitamente |
| **Finalidad clara** | Solo usar datos para lo que se informó |
| **Seguridad** | Medidas técnicas para proteger los datos |
| **Supresión** | Borrar datos cuando ya no sean necesarios |
| **Reclamos** | Tener un canal para recibir quejas |

### 3.3 Ejemplo de consentimiento

```typescript
// En la pantalla de registro
const [acceptPrivacy, setAcceptPrivacy] = useState(false);

// El botón de registro solo se habilita si aceptó
<Button
  disabled={!acceptPrivacy}
  onPress={handleRegister}
>
  Crear cuenta
</Button>

<Checkbox
  checked={acceptPrivacy}
  onPress={() => setAcceptPrivacy(!acceptPrivacy)}
/>
<Text>
  He leído y acepto la{" "}
  <Text onPress={() => router.push('/privacy-policy')}>
    Política de Protección de Datos
  </Text>
  {""} de Nexus
</Text>
```

## 4. Estado actual en Nexus

| Componente | Estado | Evidencia |
|---|---|---|
| **Aviso de privacidad (UI)** | 🟡 | `app/app/settings/about.tsx:84-88` — Menú "Privacidad" existe pero **sin contenido** |
| **Términos y condiciones (UI)** | 🟡 | `app/app/settings/about.tsx:78-82` — Menú "Términos" existe pero **sin contenido** |
| **Checkbox de consentimiento** | ❌ | No hay checkbox en la pantalla de registro |
| **Política de datos visible** | ❌ | No hay pantalla con el texto de la política |
| **Referencia a Habeas Data** | ❌ | No se menciona la Ley 1581 de 2012 en ningún lado |
| **Enlace a SIC** | ❌ | No hay registro ni referencia a la Superintendencia |
| **Opción de eliminar cuenta** | ❌ | No hay funcionalidad para que el usuario solicite eliminación de datos |
| **Exportar datos** | 🟡 | `app/app/settings/security.tsx:90-95` — Menú existe pero muestra alerta "coming soon" |

### 4.1 Archivos relevantes

| Archivo | Qué contiene |
|---|---|
| `app/app/settings/about.tsx:84-88` | Botón "Política de Privacidad" sin handler |
| `app/app/settings/about.tsx:78-82` | Botón "Términos y Condiciones" sin handler |
| `app/app/settings/security.tsx:90-95` | Opción "Exportar datos" con alerta "coming soon" |
| `app/app/(auth)/register.tsx` | Pantalla de registro sin checkbox de consentimiento |
| `app/src/api/auth.ts` | API de auth — envía datos sin verificar consentimiento |

### 4.2 Lo que falta implementar

**1. Pantalla de política de privacidad** (`app/app/privacy-policy.tsx`):
- Texto completo de la política de tratamiento de datos
- Explicación de derechos ARCO
- Datos de contacto del responsable
- Referencia a la Ley 1581 de 2012

**2. Checkbox en registro**:
- Checkbox obligatorio antes de crear cuenta
- Enlace a la política de privacidad
- El backend debería registrar que el usuario dio consentimiento

**3. Funcionalidad de eliminación de cuenta**:
- Endpoint `DELETE /users/me` en backend
- Botón "Eliminar mis datos" en configuración
- Proceso de confirmación (¿estás seguro?)

**4. Registro ante la SIC**:
- La base de datos debe registrarse en el Registro Nacional de Bases de Datos de la SIC
- Esto es responsabilidad de la universidad como entidad responsable

**5. Campo de consentimiento en BD**:
- La tabla `users` no tiene columna para registrar fecha/hora de consentimiento
- Se debería agregar: `privacy_accepted_at TIMESTAMPTZ`

### 4.3 Datos personales que maneja Nexus

| Dato | ¿Se recopila? | ¿Es sensible? |
|---|---|---|
| Nombre completo | ✅ Sí | No |
| Email institucional | ✅ Sí | No |
| Teléfono | ✅ Sí (opcional) | No |
| Ubicación (origen/destino) | ✅ Sí | Sí (revela rutinas) |
| Placa del vehículo | ✅ Sí | No |
| Historial de viajes | ✅ Sí | Sí (patrones de movimiento) |
| Método de pago (referencia) | ✅ Sí | Sí (datos financieros) |
| Calificaciones | ✅ Sí | No |
| Contraseña (hash) | ✅ Sí | Sí (bcrypt, segura) |
| Token de dispositivo | 🟡 (BD lista, no implementado) | No |

## Resumen

Nexus tiene menús de privacidad y términos en la interfaz, pero **no tienen contenido real**. No hay checkbox de consentimiento en el registro, no se menciona la Ley 1581 de 2012 (Habeas Data), y no hay funcionalidad para que el usuario elimine sus datos. Para cumplir con la ley colombiana, se necesita: una política de privacidad completa, consentimiento explícito en registro, y mecanismos para ejercer derechos ARCO.
