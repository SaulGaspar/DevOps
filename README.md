# SportLike Mobile

Aplicación móvil de la tienda deportiva SportLike, desarrollada con React Native y Expo.
La aplicación adapta las funciones de la plataforma web para dispositivos Android y iOS.

## Requisitos

- Node.js 22.13 o superior
- Git
- Expo Go o un emulador compatible

## Instalación

```powershell
git clone https://github.com/SaulGaspar/DevOps.git
cd DevOps
git switch develop
npm ci
Copy-Item .env.example .env
npx expo start
```

Antes de probar autenticación, sustituye `EXPO_PUBLIC_API_URL` y las rutas de autenticación
del archivo `.env` por los valores del backend real. Las variables `EXPO_PUBLIC_` forman parte
del paquete de la aplicación y nunca deben contener secretos.

## Estructura principal

- `src/app`: rutas y navegadores de Expo Router.
- `src/screens`: pantallas de la aplicación.
- `src/context`: sesión y estado de autenticación.
- `src/services`: comunicación con la API.
- `src/utils`: validaciones reutilizables.
- `__tests__`: pruebas unitarias, de integración y de regresión.
- `tests/performance`: pruebas de rendimiento y esfuerzo controlado sobre la API.
- `.github/workflows`: integración continua y análisis de seguridad.

## Validaciones locales

```powershell
npm run lint
npm run typecheck
npm run test:unit
npm run test:integration
npm run test:regression
npx expo-doctor
npm run export:android
```

El comando `npm run validate` ejecuta todas las comprobaciones anteriores de forma consecutiva.

## Pipeline CI/CD

GitHub Actions ejecuta automáticamente estas etapas en cada `push` a `develop`, `main` o
`feature/**`, y en cada Pull Request dirigido a `develop` o `main`:

1. Análisis estático: ESLint, TypeScript y diagnóstico de Expo.
2. Pruebas unitarias: Jest valida funciones aisladas de autenticación y catálogo.
3. Pruebas de integración: React Native Testing Library valida la colaboración entre pantalla,
   servicio y navegación, con dependencias externas simuladas.
4. Regresión: se ejecuta toda la suite de Jest y se conserva la cobertura.
5. Seguridad: `npm audit` y CodeQL.
6. Validación de entrega Android: genera `dist/` sólo cuando pasan las etapas anteriores.

Las pruebas móviles de aceptación de extremo a extremo se realizarán con Maestro sobre un build
Android/iOS en el Sprint 6. El workflow manual `Rendimiento y esfuerzo de API` usa k6 únicamente
contra un entorno de pruebas expresamente confirmado; no debe apuntarse a producción.

La selección de herramientas, el momento de ejecución y los criterios de salida se documentan en
[`TESTING_STRATEGY.md`](TESTING_STRATEGY.md).

El flujo también puede ejecutarse manualmente desde la pestaña **Actions**. Los artefactos se
conservan durante 14 días como evidencia de pruebas y entrega.

## Flujo de ramas

- `main`: versión estable y protegida.
- `develop`: integración de funcionalidades terminadas.
- `feature/<nombre>`: una rama por historia de usuario o tarea.
- `release/<version>`: estabilización previa a una publicación.
- `hotfix/<nombre>`: corrección urgente de producción.

Todos los cambios deben integrarse mediante Pull Request, con revisión de otro integrante y
el pipeline de GitHub Actions aprobado.

## Equipo

- SaulGaspar
- MontseAlvarez09

Consulta [CONTRIBUTING.md](CONTRIBUTING.md) antes de comenzar una tarea.
