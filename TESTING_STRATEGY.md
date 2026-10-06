# Estrategia de pruebas DevOps — SportLike Mobile

Esta estrategia está alineada con React Native, Expo, GitFlow y versionamiento semántico. Distingue
lo que ya está automatizado de lo programado para las ramas de estabilización.

| Tipo | Herramienta | Momento | Estado |
| --- | --- | --- | --- |
| Análisis estático | ESLint, TypeScript, Expo Doctor y CodeQL | En cada `push` a `feature/**`, `develop` o `main`, y en PR a `develop` o `main` | Automatizado |
| Unitaria | Jest con `jest-expo` | Antes del commit y en cada ejecución de CI | Automatizado |
| Integración | Jest y React Native Testing Library | En cada `push` y PR; valida pantalla y contrato del cliente HTTP con límites externos simulados | Automatizado; no equivale a validar el backend real |
| Regresión | Suite completa de Jest con cobertura | En cada `push` y PR; obligatoria antes de integrar | Automatizado |
| Aceptación móvil | Maestro en emulador/simulador con build instalable | Antes de aprobar `release/<versión>` | Configuración en `.eas/workflows/acceptance.yml`; ejecución pendiente de vincular EAS e identificadores |
| Rendimiento móvil | Métricas del build y perfilado en dispositivo Android/iOS | En la estabilización de `release/<versión>` | Programado para Sprint 6 |
| Rendimiento y esfuerzo de API | k6 con umbrales de latencia y errores | Manualmente sobre staging antes de una versión candidata; nunca contra producción sin autorización | Workflow manual disponible |

## Relación con el versionamiento

- `feature/<nombre>`: análisis estático, unitarias, integración y regresión.
- `develop`: repite todas las validaciones y genera el artefacto Android de integración.
- `release/<versión>`: añade aceptación E2E, rendimiento móvil y rendimiento/esfuerzo de la API.
- `main`: sólo recibe una versión aprobada mediante Pull Request; se etiqueta con SemVer
  (`vMAYOR.MENOR.PARCHE`).
- `hotfix/<nombre>`: ejecuta la misma batería de regresión antes de crear una versión de parche.

Las versiones candidatas pueden identificarse como `v1.0.0-rc.1`; después de aprobar aceptación,
rendimiento y esfuerzo se publica `v1.0.0`. Una corrección compatible incrementa PARCHE, una nueva
función compatible incrementa MENOR y un cambio incompatible incrementa MAYOR.

El CI también se activa en `release/**`, `hotfix/**` y etiquetas `v*`. Los jobs 1–6 se
ejecutan en paralelo; la exportación Android espera a que todos aprueben. `dist/` es una
exportación de JavaScript y recursos, no un APK ni una publicación en tienda.

## Activación de aceptación y rendimiento móvil

1. Vincular el proyecto con Expo/EAS y configurar `android.package` e `ios.bundleIdentifier`
   con los identificadores acordados por el equipo.
2. Definir `APP_ID` en los jobs Maestro con el identificador correspondiente a cada plataforma
   y configurar la API de staging en el ambiente `preview` de EAS.
3. Ejecutar `npx eas-cli@latest workflow:run .eas/workflows/acceptance.yml` antes de aprobar release.
   Conservar el reporte y evidencia de Android/iOS. El flujo actual comprueba navegación y
   validación del login; ampliar catálogo y compra cuando estén implementados.
4. Medir en build de release tiempos de apertura, respuesta al navegar, fluidez del catálogo
   y memoria con React Native DevTools/Android Studio Profiler e Instruments en iOS. Registrar
   dispositivo, sistema, commit, condiciones de red y línea base para comparar regresiones.

La aceptación del usuario exige además revisar los criterios de cada HU y registrar la aprobación
del equipo. Maestro automatiza recorridos, pero no reemplaza esa revisión. El perfilado móvil no
queda cubierto por k6, que mide exclusivamente la API.

## Evidencia y pendientes

Las pruebas del cliente HTTP simulan únicamente `fetch` y ejecutan el servicio real de la app.
Comprueban sesión, rutas, filtros y errores. Una prueba contra staging debe añadirse cuando el
equipo disponga de ese ambiente. No hay evidencia todavía de ejecución Maestro ni de esfuerzo;
la configuración disponible no constituye una prueba aprobada.

El run 37382996166 aprobó análisis estático, unitarias, integración, regresión y CodeQL,
pero falló en auditoría de dependencias. Se conserva el bloqueo y se publica el reporte de
auditoría como evidencia. La entrega no está aprobada hasta resolver las vulnerabilidades
altas/críticas mediante versiones compatibles y volver a validar Expo Doctor y las pruebas.

## Criterios de seguridad

## PU por funcionalidad y PI al cierre del sprint

Las PU se ejecutan durante el desarrollo de cada funcionalidad: `npm run test:unit:auth`
para validaciones de autenticación y `npm run test:unit:catalog` para lógica del catálogo.
Las funcionalidades nuevas deben agregar sus casos; estos comandos no acreditan HU aún sin pruebas.

Al finalizar cada sprint, después de integrar sus HU en `develop` o `release/*`, ejecutar
en Actions **PI de cierre de sprint**, seleccionar esa rama y el número del sprint.
El workflow conserva resultados asociados al sprint y al commit por 90 días.
Primero ejecuta PI y, sólo si aprueba, ejecuta regresión en secuencia. El CI frecuente conserva
PI preventivas: no reemplazan la ejecución identificada de cierre.

En el CI habitual los controles se ejecutan en paralelo y la exportación espera a todos.
Un workflow atiende los eventos push y pull_request sin crear un workflow por tipo de prueba.
El merge produce un push a la rama destino; `git pull` sólo actualiza la copia local y no
dispara Actions. Revisar origen y destino del PR y los checks antes de integrar.

La PI actual usa límites externos simulados. Para aprobar integración real falta configurar
un backend de staging y casos con datos de prueba; no se debe afirmar aprobación extremo a extremo.
Maestro requiere vinculación EAS e identificadores del equipo; k6 requiere staging autorizado.
No se inventan estos valores ni se ejecuta carga contra producción.

La prueba de esfuerzo se mantiene separada del CI frecuente porque genera tráfico real. El workflow
exige una URL de staging y una confirmación explícita. Sus umbrales iniciales son menos de 1 % de
errores y percentil 95 menor a 2 segundos; deben ajustarse con datos reales del proyecto.
