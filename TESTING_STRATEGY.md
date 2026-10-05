# Estrategia de pruebas DevOps — SportLike Mobile

Esta estrategia está alineada con React Native, Expo, GitFlow y versionamiento semántico. Distingue
lo que ya está automatizado de lo programado para las ramas de estabilización.

| Tipo | Herramienta | Momento | Estado |
| --- | --- | --- | --- |
| Análisis estático | ESLint, TypeScript, Expo Doctor y CodeQL | En cada `push` a `feature/**`, `develop` o `main`, y en PR a `develop` o `main` | Automatizado |
| Unitaria | Jest con `jest-expo` | Antes del commit y en cada ejecución de CI | Automatizado |
| Integración | Jest y React Native Testing Library | En cada `push` y PR; valida pantalla, servicio y navegación con límites externos simulados | Automatizado |
| Regresión | Suite completa de Jest con cobertura | En cada `push` y PR; obligatoria antes de integrar | Automatizado |
| Aceptación móvil | Maestro en emulador/simulador con un build de desarrollo | En `release/<versión>` y antes de etiquetar una versión candidata | Programado para Sprint 6; requiere configurar EAS/build e identificadores móviles |
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

## Criterios de seguridad

La prueba de esfuerzo se mantiene separada del CI frecuente porque genera tráfico real. El workflow
exige una URL de staging y una confirmación explícita. Sus umbrales iniciales son menos de 1 % de
errores y percentil 95 menor a 2 segundos; deben ajustarse con datos reales del proyecto.
