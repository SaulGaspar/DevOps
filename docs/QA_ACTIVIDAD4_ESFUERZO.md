
# Actividad 4 — Pruebas de esfuerzo de SportLike Mobile

## 1. Objetivo

Evaluamos la respuesta de un servicio HTTP simulado del catálogo de SportLike Mobile ante distintos niveles de carga, para comprobar la latencia, la tasa de errores y el comportamiento después de reducir la concurrencia.

La prueba se ejecutó únicamente en un servidor local aislado. No se realizaron solicitudes de esfuerzo al backend real ni a servicios de producción.

## 2. Herramientas y entorno

- Proyecto de referencia: SportLike Mobile.
- Herramienta: Node.js v24.13.0.
- Administrador de paquetes: npm 11.6.2.
- Sistema operativo: Windows.
- Servidor: HTTP local mediante el módulo `node:http`.
- Dirección: `http://127.0.0.1:3100/productos`.
- Datos: catálogo simulado de 100 productos.
- Instrumentación: `performance.now()`, `fetch` y `AbortSignal.timeout(5000)`.
- Entorno: equipo local; sin conexión a base de datos.

## 3. Procedimiento

Primero iniciamos el servidor mediante:

```powershell
node scripts\stress\mock-server.cjs
```

Comprobamos que la ruta `/productos` respondiera correctamente y devolviera 100 productos.

Después ejecutamos dos pruebas:

**Prueba inicial de ráfagas:**

```powershell
node scripts\stress\load-test.cjs
```

**Prueba sostenida:**

```powershell
node scripts\stress\load-test-sostenido.cjs
```

Cada solicitud se consideró exitosa únicamente cuando respondió con estado HTTP 200 y un arreglo de 100 productos.

## 4. Resultados de la prueba inicial

| Fase | Solicitudes | Concurrencia | Promedio | P95 | Errores |
|---|---:|---:|---:|---:|---:|
| Inicial | 30 | 2 | 4.32 ms | 18.52 ms | 0 |
| Media | 100 | 10 | 7.44 ms | 14.93 ms | 0 |
| Elevada | 300 | 30 | 18.18 ms | 32.33 ms | 0 |
| Recuperación | 30 | 2 | 1.04 ms | 3.22 ms | 0 |

**Resultado:** 460 solicitudes exitosas de 460 ejecutadas.

Esta prueba representó ráfagas breves y sirvió para validar el funcionamiento inicial del procedimiento.

## 5. Resultados de la prueba sostenida

| Fase | Duración | Concurrencia | Solicitudes | Promedio | P95 | Errores |
|---|---:|---:|---:|---:|---:|---:|
| Inicial | 10 s | 2 | 182 | 2.31 ms | 2.64 ms | 0 |
| Media | 15 s | 10 | 1,370 | 2.73 ms | 4.32 ms | 0 |
| Elevada | 20 s | 30 | 5,490 | 4.59 ms | 7.50 ms | 0 |
| Recuperación | 10.01 s | 2 | 184 | 1.39 ms | 1.70 ms | 0 |

**Resultado:** 7,226 solicitudes exitosas de 7,226 ejecutadas.

## 6. Criterios de evaluación

Se definieron los siguientes criterios preliminares exclusivamente para el servicio local:

| Criterio | Resultado | Evaluación |
|---|---|---|
| Tasa de errores del 0 % | 0 % | Cumplido |
| P95 inferior a 1,000 ms durante la carga elevada | 7.50 ms | Cumplido |
| Recuperación de la latencia al reducir la concurrencia | Promedio final de 1.39 ms frente a 2.31 ms inicial | Observada |

Estos valores no constituyen acuerdos formales de nivel de servicio de SportLike en producción.

## 7. Análisis e interpretación

Durante la prueba sostenida, la latencia promedio aumentó de 2.31 ms en la fase inicial a 4.59 ms durante la carga elevada.

El aumento indica un mayor tiempo de respuesta al incrementar el número de trabajadores. Sin embargo, no se registraron fallos HTTP ni respuestas con datos inválidos.

En la fase de recuperación, el promedio descendió a 1.39 ms. Esto indica que no se observó degradación persistente después de reducir la carga, durante la ventana medida.

La concurrencia especifica el máximo de trabajadores que ejecutan solicitudes. Debido al intervalo de 100 ms entre solicitudes por trabajador, no equivale a mantener exactamente 30 solicitudes HTTP activas simultáneamente.

## 8. Limitaciones

- Se utilizó un servidor HTTP simulado, no el backend real.
- No se realizaron consultas a una base de datos.
- Las pruebas no involucraron la aplicación Android.
- Las fases fueron de duración limitada.
- No se midieron CPU, memoria ni consumo de red.
- No se identificó el punto máximo de saturación.
- Las mediciones de rendimiento pueden variar según el equipo.
- No se ejecutó una prueba de carga contra producción.

Por lo tanto, estos resultados demuestran el comportamiento del servicio simulado bajo las condiciones documentadas, no la capacidad máxima de SportLike en producción.

## 9. Evidencias reproducibles

Archivos del procedimiento:

- `scripts/stress/mock-server.cjs`
- `scripts/stress/load-test.cjs`
- `scripts/stress/load-test-sostenido.cjs`

Resultados:

- `evidencias/stress/resultados-iniciales.json`
- `evidencias/stress/resultados.json`
- `evidencias/stress/resultados-sostenidos.json`

Los archivos JSON conservan la fecha de ejecución, fases, número de solicitudes, tasa de errores, tiempos promedio, P95 y rendimiento por segundo.

## 10. Conclusión

Realizamos dos pruebas controladas contra un servidor local que simula el catálogo de SportLike Mobile.

En ambas ejecuciones, todas las solicitudes fueron exitosas. La prueba sostenida permitió observar el comportamiento del servicio al aumentar la concurrencia y comprobar su recuperación posterior.

Estas evidencias fortalecen la documentación del proceso de aseguramiento de calidad de la Actividad 4 y establecen un procedimiento reproducible. Como trabajo posterior queda evaluar un backend de pruebas autorizado, con base de datos y métricas instrumentadas.
