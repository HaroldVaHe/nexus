# 16. QA de Interfaz — Para Dummies

## 1. ¿Qué es el QA de interfaz?

QA significa **Quality Assurance** (Aseguramiento de Calidad). El QA de interfaz es el proceso de verificar que la aplicación se vea bien y funcione correctamente en diferentes dispositivos, sistemas operativos y tamaños de pantalla.

Es como probar un videojuego en diferentes consolas: puede que funcione perfecto en PlayStation pero tenga errores en Xbox. Lo mismo pasa con las apps móviles.

## 2. ¿Por qué es importante?

- **Cada dispositivo es diferente**: Android tiene miles de modelos con diferentes tamaños de pantalla, resoluciones y versiones del sistema operativo
- **iOS vs Android**: No solo se ven diferentes, sino que se comportan diferente (gestos, navegación, animaciones)
- **La primera impresión importa**: Si la app se ve mal en el celular del usuario, la desinstala y no vuelve
- **Errores de UI son los más visibles**: Un error de backend puede pasar desapercibido, pero un botón que no funciona se nota inmediatamente
- **Fragilidad del layout**: Un texto que cabe en tu teléfono puede desbordarse en otro con letra más grande

## 3. ¿Cómo se hace en la práctica?

### 3.1 Pruebas manuales vs automáticas

**Pruebas manuales:**
- Un ser humano abre la app y la usa como lo haría un usuario real
- Toca todos los botones, llena formularios, navega entre pantallas
- Verifica que todo se vea bien y funcione correctamente

**Pruebas automáticas (UI Testing):**
- Scripts que imitan el comportamiento del usuario
- Frameworks como Detox (React Native), Appium o Maestro
- Más rápidas de ejecutar pero más difíciles de escribir

### 3.2 ¿Qué se debe probar en QA de interfaz?

| Aspecto | Qué revisar |
|---|---|
| **Responsividad** | ¿La interfaz se ve bien en diferentes tamaños de pantalla? |
| **Navegación** | ¿Puedo ir de A a B sin errores? ¿El botón "atrás" funciona? |
| **Formularios** | ¿Los campos validan correctamente? ¿Los mensajes de error se ven bien? |
| **Estados vacíos** | ¿Qué se ve cuando no hay datos? ¿Una pantalla en blanco o un mensaje amigable? |
| **Manejo de errores** | ¿Qué pasa si no hay internet? ¿Si el servidor responde con error? |
| **Carga/Spinners** | ¿Se muestra un indicador mientras los datos se cargan? |
| **Accesibilidad** | ¿Los botones son suficientemente grandes? ¿El contraste de colores es adecuado? |
| **Orientación** | ¿La app se ve bien en vertical y horizontal? |

### 3.3 Matriz de dispositivos

Idealmente, una app debería probarse en:

- **Android**: 3-4 modelos representativos (gama baja, media, alta) con versiones recientes de Android
- **iOS**: iPhone SE (pantalla pequeña), iPhone 15/16 (pantalla estándar), iPhone Pro Max (pantalla grande)
- **Tablets**: Si la app las soporta
- **Web**: Chrome, Firefox, Safari

## 4. Estado actual en Nexus

| Aspecto | Estado | Evidencia |
|---|---|---|
| **Pruebas en Android** | 🟡 Manual, solo emulador | Probado en Android Emulator, no en dispositivos físicos |
| **Pruebas en iOS** | ❌ No probado | Requiere Mac + Xcode + cuenta de desarrollador |
| **Pruebas en Web** | 🟡 Funciona vía `react-native-web` | `app/package.json:33` — `react-native-web: ^0.21.0` instalado |
| **Pruebas automatizadas de UI** | ❌ No existen | No hay Detox, Appium, ni Maestro configurados |
| **Matriz de dispositivos** | ❌ No definida | No hay lista de dispositivos objetivo para QA |
| **Pruebas de regresión** | ❌ No existen | Cada cambio requiere probar todo manualmente |

### 4.1 Pantallas existentes en la app

La app tiene **~20 pantallas** que deberían pasar por QA:

| Ruta | Pantalla | Estado estimado |
|---|---|---|
| `(auth)/login.tsx` | Inicio de sesión | 🟡 Probada en Android |
| `(auth)/register.tsx` | Registro | 🟡 Probada en Android |
| `(tabs)/home.tsx` | Inicio | 🟡 Probada en Android |
| `(tabs)/search.tsx` | Buscar viajes | 🟡 Probada en Android |
| `(tabs)/publish.tsx` | Publicar viaje | 🟡 Probada en Android |
| `(tabs)/profile.tsx` | Perfil | 🟡 Probada en Android |
| `trip/*.tsx` | Detalle viaje | 🟡 Probada en Android |
| `bookings.tsx` | Reservas | 🟡 Probada en Android |
| `my-vehicles.tsx` | Mis vehículos | 🟡 Probada en Android |
| `my-publications.tsx` | Mis publicaciones | 🟡 Probada en Android |
| `notifications.tsx` | Notificaciones | 🟡 Probada en Android |
| `help.tsx` | Centro de ayuda | 🟡 Probada en Android |
| `settings/*.tsx` | Configuración (6 pantallas) | 🟡 Probada en Android |
| `report/*.tsx` | Reportes (2 pantallas) | 🟡 Probada en Android |
| `payment/*.tsx` | Pago (3 pantallas) | 🟡 Probada en Android |
| `payments/*.tsx` | Métodos de pago (2 pantallas) | 🟡 Probada en Android |

### 4.2 Riesgos identificados

1. **Notch y status bar**: Las pantallas usan `useSafeAreaInsets()` para manejar el notch, pero solo se probó en Android
2. **Teclado**: En iOS, el teclado se comporta diferente y puede tapar campos de texto
3. **Gestos**: iOS tiene gestos de navegación (swipe back) que pueden conflictuar con la app
4. **Rendimiento**: Sin pruebas en dispositivos de gama baja, no se sabe si la app es usable en ellos
5. **Web**: `react-native-web` tiene limitaciones: algunos componentes nativos no funcionan igual

### 4.3 Configuración actual para web

```json
// app/package.json:33
"react-native-web": "^0.21.0"
```

Esto permite que la app funcione en navegador usando `npx expo start --web`, pero no todos los componentes de React Native tienen equivalente web.

### 4.4 Recomendaciones para mejorar QA de interfaz

1. **Probar en dispositivo físico Android** (no solo emulador): El emulador no replica exactamente el comportamiento real, especialmente en rendimiento y sensores
2. **Conseguir acceso a iOS**: Usar macOS con Xcode o un servicio como BrowserStack
3. **Crear checklist de QA**: Una lista de verificación para cada pantalla antes de cada lanzamiento
4. **Probar casos borde**: Sin internet, servidor caído, datos vacíos, sesión expirada
5. **Probar en web**: La app se puede ejecutar en navegador, pero no hay garantía de que todas las pantallas funcionen correctamente

## Resumen

Nexus solo se ha probado manualmente en Android Emulator. No hay pruebas en iOS, no hay pruebas automatizadas de UI, y la web solo funciona parcialmente con `react-native-web`. Para un lanzamiento real, se necesita probar en dispositivos físicos Android e iOS, y establecer un proceso de QA más riguroso.
