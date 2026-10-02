# Guía de contribución

## Flujo de trabajo

1. Selecciona un issue asignado a ti y confirma su milestone.
2. Crea la rama desde `develop`: `feature/nombre-corto`.
3. Realiza cambios pequeños y relacionados con una sola tarea.
4. Ejecuta `npm run validate` antes de subir los cambios.
5. Realiza push de la rama y comprueba GitHub Actions.
6. Abre un Pull Request hacia `develop` y relaciónalo con el issue.
7. Solicita la aprobación de otro integrante.
8. Corrige los errores del pipeline o de la revisión.
9. Realiza merge solamente cuando las verificaciones estén aprobadas.

No se trabaja directamente sobre `main` ni `develop`.

## Formato de commits

Usa el formato `tipo: descripción corta`.

- `feat`: nueva funcionalidad.
- `fix`: corrección.
- `test`: pruebas.
- `docs`: documentación.
- `refactor`: reorganización sin cambiar funcionalidad.
- `chore`: configuración o mantenimiento.

Ejemplo: `feat: valida formulario de inicio de sesión`.

## Pull Requests

Cada Pull Request debe incluir:

- objetivo del cambio;
- lista de cambios realizados;
- pruebas funcionales y de seguridad ejecutadas;
- issue relacionado mediante `Closes #n`;
- evidencia del pipeline aprobado;
- aprobación de al menos otro integrante.
