# Plan estandarizado de pruebas y evidencias - SportLike

## Alcance y honestidad de la evidencia
Las pruebas Jest de integración verifican el contrato del cliente HTTP contra `fetch` simulado. **No** son pruebas contra un backend real, de carga, de aceptación en dispositivo ni pruebas de seguridad penetrantes. El artefacto `dist/` de Expo es una exportación, **no un APK**.

## Datos de prueba
- `__tests__/fixtures/scenarios.js`: cuentas ficticias, productos sin datos personales y respuestas HTTP.
- Los casos incluyen credenciales válidas, inválidas, campos vacíos, stock agotado, páginas límite, errores HTTP 401/503, falta de token y error de conexión.
- No subir claves, cuentas reales o tokens auténticos. Para entornos externos usar secretos y datos aislados.

## Matriz de ejecución por evento
| Evento | Paralelo: calidad / PU / PI / dependencias / CodeQL / seguridad funcional | Secuencia | Resultado |
|---|---|---|---|
| push feature/**, develop, main | Sí | regresión con cobertura → exportación | Aprobado o rechazado |
| pull_request hacia develop o main | Sí | regresión con cobertura → exportación | Aprobado o rechazado |
| workflow_dispatch | Sí | regresión con cobertura → exportación | Aprobado o rechazado |

Los seis jobs iniciales se ejecutan en paralelo. La seguridad funcional ejecuta casos `SEG-HU1` a `SEG-HU5` con datos sintéticos. Después, en secuencia, se ejecutan regresión y exportación únicamente si todas las compuertas previas aprobaron. El job **Veredicto del pipeline** se ejecuta siempre y muestra el resultado final de la cadena. Las ejecuciones canceladas, omitidas o sin reporte no son aprobaciones.

## Criterios
1. Cada job obligatorio termina en éxito; no se aceptan fallos ni ausencia de reportes.
2. Jest devuelve cero fallos y al menos un test; su JSON es transformado a Markdown con casos y cantidades, y se conserva JSON + Markdown como artefactos.
3. Regresión ejecuta toda la suite con cobertura, no únicamente los tests nuevos.
4. La exportación se publica solo cuando las validaciones previas aprobaron.
5. Si falla alguna etapa: job rojo, mensaje de RECHAZADO en resumen, sin exportación de entrega; corregir y volver a ejecutar.
6. La auditoría de dependencias publica todas las severidades. La política vigente bloquea vulnerabilidades críticas y deja las demás visibles como deuda técnica; no se presentan como inexistentes.

## Dónde consultar
Ir a **Actions → CI/CD SportLike → ejecución → Summary** para el veredicto; abrir los jobs para diagnósticos; descargar los artefactos `qa-unitarias-*`, `qa-integracion-*`, `qa-dependencias-*`, `qa-seguridad-funcional-*` y `qa-regresion-*`. Añadir el enlace a cada historia/tarea de GitHub Projects junto con fecha, rama, commit, resultado, números de casos, cobertura y corrección si falla.

## Registro estandarizado por historia de usuario
- Historia HU y criterios de aceptación.
- Casos (identificador, datos de entrada, resultado esperado y obtenido).
- Tipo de prueba y herramienta.
- Fecha, rama, SHA, job y enlace a ejecución.
- Aprobadas / fallidas / omitidas y cobertura aplicable.
- Veredicto y enlace al artefacto; si falló, incidente y evidencia de la repetición.
- Validación manual de aceptación (dispositivo/emulador), rendimiento o esfuerzo: responsable, entorno, metodología, métricas, capturas y hallazgos. **No marcarlas como ejecutadas hasta aportar evidencia.**

## Prueba controlada de la compuerta
En una rama de práctica crear temporalmente una aserción errónea y abrir un PR: el job de pruebas debe fallar y la exportación no debe ejecutarse. Después corregir la aserción y comprobar una segunda ejecución exitosa. **No introducir fallos deliberados en develop/main.** Para bloquear el merge se deben configurar además las comprobaciones requeridas en las reglas de protección de ramas de GitHub.

## Trabajo adicional pendiente
- Pruebas extremo a extremo con un backend de pruebas desplegado.
- Criterios de cobertura por módulo basados en una medición real y objetivos acordados.
- Rendimiento con medidas repetibles en web o dispositivo, y esfuerzo contra ambiente controlado con autorización.
- APK mediante una compilación Android apropiada (por ejemplo, EAS Build); la exportación actual no genera APK.
