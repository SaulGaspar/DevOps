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
- `__tests__`: pruebas funcionales y unitarias.
- `.github/workflows`: integración continua y análisis de seguridad.

## Validaciones locales

```powershell
npm run lint
npm run typecheck
npm test
npx expo-doctor
npm run export:android
```

El comando `npm run validate` ejecuta todas las comprobaciones anteriores de forma consecutiva.

## Pipeline CI/CD

GitHub Actions ejecuta automáticamente estas etapas en cada `push` a `develop`, `main` o
`feature/**`, y en cada Pull Request dirigido a `develop` o `main`:

1. Calidad de código: lint, tipos y diagnóstico de Expo.
2. Pruebas funcionales: Jest con reporte de cobertura descargable.
3. Seguridad de dependencias: bloquea vulnerabilidades altas o críticas.
4. Seguridad del código: análisis CodeQL para JavaScript y TypeScript.
5. Entrega Android: genera `dist/` y lo publica como artefacto cuando las etapas anteriores pasan.

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
