
# Actividad 4 — Niveles de servicio y monitoreo de SportLike Mobile

## 1. Objetivo

Definimos los niveles de servicio y las métricas que permitirían evaluar la disponibilidad, el rendimiento y la confiabilidad de SportLike Mobile durante su operación.

Distinguimos los resultados ya medidos de los objetivos propuestos y del monitoreo que todavía debe implementarse.

## 2. Estado actual del proyecto

SportLike Mobile utiliza React Native, Expo, Jest y GitHub Actions.

El repositorio cuenta con un pipeline de integración continua que ejecuta análisis estático, pruebas automatizadas, verificaciones de seguridad, regresión y exportación de Expo.

Sin embargo, no hemos identificado un sistema de monitoreo continuo de la aplicación desplegada en producción.

Por lo tanto, los indicadores de operación que aparecen a continuación son objetivos académicos propuestos, no acuerdos de servicio formalmente establecidos.

## 3. Niveles de servicio propuestos

| Indicador | Objetivo propuesto | Método de verificación |
|---|---|---|
| Disponibilidad de la API | 99.5 % mensual | Solicitudes HTTP periódicas |
| Primera imagen del catálogo | Máximo 2 segundos | Mediciones en Android |
| Latencia de API | P95 menor o igual a 1 segundo | Registro de tiempos HTTP |
| Errores del servidor | Menos de 1 % de solicitudes | Respuestas HTTP 5xx |
| Recuperación de incidentes | Máximo 30 minutos | Registro del incidente |

Estos valores no son garantías de servicio. Se plantean como referencia para una futura etapa de despliegue y monitoreo.

## 4. Métricas de monitoreo

### 4.1 Disponibilidad

Mide el porcentaje de comprobaciones en las que el servicio responde correctamente.

Fórmula:

Disponibilidad (%) = (comprobaciones exitosas / comprobaciones totales) × 100

Frecuencia propuesta: cada 5 minutos.

Acción ante incumplimiento: revisar conectividad, estado del servidor y registros de error.

### 4.2 Latencia de respuesta

Mide cuánto tarda el servidor en responder a una solicitud.

Se propone registrar el promedio y el percentil 95 (P95).

Frecuencia propuesta: recopilación continua cuando exista un backend instrumentado.

Acción ante incumplimiento: revisar consultas lentas, carga del servidor y comunicación con la API.

### 4.3 Tasa de errores

Mide el porcentaje de solicitudes que finalizan con errores del servidor.

Fórmula:

Tasa de errores (%) = (respuestas HTTP 5xx / total de solicitudes HTTP) × 100

Frecuencia propuesta: evaluación cada 5 minutos.

Acción ante incumplimiento: consultar registros, identificar el módulo afectado y determinar si corresponde revertir una liberación.

### 4.4 Rendimiento del catálogo

Mide el tiempo percibido desde que se selecciona Catálogo hasta que aparece la primera imagen de un producto.

Objetivo preliminar propuesto: máximo 2 segundos en condiciones comparables.

Frecuencia propuesta: antes de cada liberación y después de cambios relevantes.

Acción ante incumplimiento: revisar tamaño de imágenes, comportamiento de la paginación, red y tiempos de respuesta de la API.

### 4.5 Tiempo de recuperación

Mide el intervalo transcurrido desde que se detecta una interrupción hasta que se restablece el servicio.

Objetivo propuesto: máximo 30 minutos.

Acción ante incumplimiento: documentar el incidente, analizar la causa y establecer acciones correctivas.

## 5. Evidencias disponibles

### 5.1 Pruebas automatizadas

La ejecución número 71 de GitHub Actions registró 124 pruebas de regresión aprobadas en 17 suites.

Estos resultados verifican funcionalidades del código, pero no representan disponibilidad mensual del servicio.

### 5.2 Rendimiento en Android

Realizamos cinco mediciones manuales en un teléfono Oppo A15 4G mediante Wi-Fi.

Resultados:

| Intento | Tiempo |
|---|---:|
| 1 | 1.30 s |
| 2 | 1.26 s |
| 3 | 1.28 s |
| 4 | 1.25 s |
| 5 | 1.26 s |
| Promedio | 1.27 s |

El promedio observado fue de 1.27 segundos.

La medición proporciona una línea base preliminar, pero no constituye una garantía de rendimiento para todos los dispositivos.

### 5.3 Pruebas de esfuerzo

Realizamos una prueba sostenida sobre un servidor HTTP local simulado.

Resultados principales:

- 7,226 solicitudes exitosas.
- 0 % de errores.
- Latencia promedio de 4.59 ms durante la fase elevada.
- P95 de 7.50 ms durante la fase elevada.
- Recuperación observada después de reducir la carga.

Estos resultados corresponden exclusivamente al servidor local simulado y no deben interpretarse como mediciones de la API real.

La evidencia reproducible se encuentra en `docs/QA_ACTIVIDAD4_ESFUERZO.md`.

## 6. Responsabilidades propuestas

| Responsable o rol | Actividad |
|---|---|
| Equipo de desarrollo | Revisar fallos del código y aplicar correcciones |
| Responsable de QA | Validar pruebas y documentar resultados |
| Responsable de integración | Revisar el pipeline y autorizar la liberación |
| Responsable de infraestructura | Revisar disponibilidad y recursos del servidor cuando exista un entorno desplegado |

Estas responsabilidades son una propuesta operativa; deberán acordarse formalmente antes de utilizarse como compromiso de servicio.

## 7. Alertas propuestas

Se recomienda establecer alertas cuando ocurra alguno de los siguientes eventos:

- La API deja de responder a comprobaciones consecutivas.
- El P95 supera 1 segundo durante un periodo definido.
- La tasa de errores HTTP 5xx alcanza o supera el 1 %.
- El catálogo supera el objetivo de carga en pruebas de liberación.
- Una ejecución obligatoria del pipeline termina con errores.

Las alertas de producción no están implementadas actualmente. GitHub Actions sí permite consultar el resultado de las verificaciones de integración continua.

## 8. Relación con la liberación continua

Antes de liberar una versión, verificamos el resultado del pipeline, las pruebas automatizadas y la evidencia de aceptación disponible.

Una liberación no debería aprobarse si existen pruebas obligatorias fallidas, errores críticos sin resolver o incumplimientos de los criterios de aceptación.

La exportación realizada mediante Expo representa la generación de recursos para distribución, no una publicación automática en producción ni la generación de un APK.

Cuando exista un entorno de producción, será necesario complementar este proceso con monitoreo, alertas y un procedimiento documentado de reversión.

## 9. Limitaciones

Actualmente no contamos con evidencia de:

- Disponibilidad mensual real de la API.
- Monitoreo permanente de usuarios o transacciones.
- Alertas automáticas de infraestructura.
- Tiempo real de recuperación ante incidentes productivos.
- Cumplimiento de un SLA contractual.
- Despliegue automático a producción.

Estos aspectos se consideran pendientes de implementación y validación.

## 10. Conclusión

Establecimos una propuesta de niveles de servicio y métricas de monitoreo para SportLike Mobile, relacionándola con las pruebas y evidencias disponibles.

El proyecto cuenta con un pipeline de integración continua y resultados verificables de calidad. Sin embargo, el monitoreo operativo permanente requiere una infraestructura desplegada y herramientas adicionales.

La separación entre resultados medidos y objetivos propuestos permite documentar el estado real del proyecto sin presentar como implementadas capacidades que todavía se encuentran pendientes.
