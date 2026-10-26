# Evidencia de rendimiento manual — HU3 #9 SportLike Mobile

**Proyecto:** SportLike Mobile  
**Historia de usuario:** HU3 #9 — Carga progresiva de imágenes y paginación del catálogo  
**Fecha de registro:** 18 de octubre de 2026  
**Ejecutor/a:** Montse Alvarez  
**Entorno:** Teléfono Android, aplicación abierta mediante Expo  
**Modelo del teléfono:** No registrado  
**Tipo de conexión y condiciones de caché:** No registrados

## Objetivo y procedimiento

Estimar el tiempo percibido desde que se toca la pestaña **Catálogo** hasta que aparecen las primeras imágenes de los productos. Se tomó el tiempo manualmente en tres repeticiones, comenzando desde otra pantalla de la aplicación.

**Instrumento:** cronometraje manual informado por la persona que realizó la prueba. No se utilizó un perfilador ni cronometraje automático de red.

## Resultados medidos

| Intento | Tiempo observado |
|---|---:|
| 1 | 1 segundo |
| 2 | 1 segundo |
| 3 | 1 segundo |
| **Promedio aritmético** | **1.00 segundos** |
| **Mínimo / máximo** | **1 / 1 segundo** |

Cálculo: (1 + 1 + 1) / 3 = **1.00 segundos**.

## Interpretación

Durante las tres repeticiones se reportó un tiempo percibido de alrededor de **1 segundo** para que aparecieran las primeras imágenes del catálogo. Las comprobaciones de aceptación confirmaron, por separado, que al desplazarse hacia abajo aparecieron más productos e imágenes.

**Resultado:** Satisfactorio para esta observación manual. No se estableció previamente un umbral numérico de aceptación; por tanto, no se declara cumplimiento de un SLA ni de un objetivo formal de desempeño.

## Limitaciones y trabajo pendiente

- Los tiempos se registraron en segundos enteros; la precisión efectiva de la medición no está documentada.
- No se midió tiempo hasta cargar todas las imágenes, latencia de API, memoria, CPU, FPS ni consumo de datos.
- No se documentaron modelo de teléfono, potencia del equipo, tipo de red, velocidad ni estado de caché.
- La muestra es de tres observaciones de una sola persona y un único teléfono.
- **Pruebas de estrés y rendimiento instrumentado:** pendientes. Para completarlas se recomienda repetir con caché limpia y red controlada, medir solicitudes/latencias, y evaluar listas grandes en varios dispositivos.

## Evidencia relacionada

- [Reporte de aceptación](QA_HU3_ACEPTACION.md) con capturas de la aplicación en dispositivo.
- [PR #105 — pruebas y pipeline](https://github.com/SaulGaspar/DevOps/pull/105), con resultados automatizados y artefactos de GitHub Actions.
