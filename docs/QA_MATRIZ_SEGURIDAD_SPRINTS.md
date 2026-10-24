# Matriz ejecutable de seguridad por historia y tarea

Fecha de revisión: 24 de octubre de 2026  
Alcance: Sprint 1, Sprint 2 y Sprint 3 de SportLike Mobile.

## Regla de evidencia

Una prueba solo se considera realizada cuando existe un caso automatizado, una ejecución y un resultado. Las descripciones en los issues no sustituyen la ejecución. Los casos de este documento usan datos sintéticos de `__tests__/fixtures/scenarios.js` y se ejecutan con `npm run test:security`.

## Historias y subissues revisados

| Sprint | Historia / tarea | Riesgo comprobado | Casos automáticos | Estado local |
|---|---|---|---|---|
| 1 | HU1 #3 / seguridad #43 | Entradas ausentes, tipos incorrectos y credenciales excesivas | SEG-HU1-01, SEG-HU1-02 y contrato HTTP de `apiIntegration.test.js` | Aprobado |
| 1 | HU2 #4 / seguridad #52 | Registro incompleto, tipos manipulados, límites de correo, usuario y contraseña | SEG-HU1-01, SEG-HU1-02 y `authValidation.test.js` | Aprobado |
| 2 | HU3 #7 y #9 / seguridad #71 | Productos o precios corruptos, respuestas HTTP, parámetros codificados y regresión del catálogo | SEG-HU4-02, SEG-HU4-04, `apiIntegration.test.js`, `productCatalog.test.js` | Aprobado |
| 3 | HU4 #10 y tarea #11 / seguridad #75 | Búsquedas excesivas, Unicode, objetos hostiles, precios inválidos y rangos invertidos | SEG-HU4-01 a SEG-HU4-04 | Aprobado |
| 3 | HU5 #12 y tarea #13 / seguridad #79 | Producto nulo, precio o stock manipulado, cantidades no enteras y sobreventa | SEG-HU5-01 a SEG-HU5-03 | Aprobado |

`Aprobado` en esta tabla significa que los casos pasaron en la revisión local. El cierre definitivo del issue requiere además que el job **Seguridad funcional por HU** apruebe en GitHub Actions y que el Pull Request se integre en `develop`.

## Ejecución paralela y secuencial

En paralelo se ejecutan análisis estático, PU, PI, auditoría de dependencias, CodeQL y seguridad funcional. Si cualquiera queda en rojo, cancelado u omitido, la regresión no se habilita. En secuencia se ejecutan:

1. Regresión completa con cobertura.
2. Exportación Expo para Android.
3. Veredicto final, que siempre se muestra.

Si todo es correcto, el resumen dice **APROBADO**, se conservan JSON/Markdown y se publica la exportación. Si algo no es correcto, dice **RECHAZADO**, identifica la etapa y no publica la exportación; se corrige el hallazgo y se vuelve a ejecutar.

## Datos estandarizados

- Cuentas: dominios `example.com`; no contienen datos personales reales.
- Tokens: valores ficticios sin acceso a servicios.
- Productos: identificadores `sku-*`, precios y existencias controladas.
- Entradas negativas: nulos, tipos incorrectos, texto de 5000 caracteres, `NaN`, infinito, negativos, rangos invertidos y cantidades decimales.
- API de integración: `fetch` simulado; no se declara como backend real ni como prueba E2E.

## Límites de la validación

Estas pruebas validan defensas de la aplicación móvil y su cliente HTTP. No son pentesting, no atacan un servidor real y no sustituyen pruebas autorizadas del backend. La auditoría de dependencias bloquea severidad crítica; las severidades altas y moderadas se muestran como deuda técnica y no se ocultan.
