# Tasks

Tareas de menos de dos horas. No se introducen textos clínicos nuevos; su validación pendiente sigue a cargo del equipo clínico.

## 1. Identidad
- [x] 1.1 Consultar documentación de Expo SDK 57 antes de tocar sus APIs y configuración; integrar PNG en bienvenida e Inicio y comprobar visualmente proporción, legibilidad y nombre accesible a 320 px.
- [x] 1.2 Sustituir referencias visibles al producto y título web por Amía; comprobar mediante búsqueda y recorrido que las atribuciones a Nutrimind conservan significado y que no se modifican identificadores técnicos ni datos.

## 2. Acceso principal
- [x] 2.1 Hacer circular y centrado el botón de Inicio, con diámetro orientativo de 160 px; verificar texto completo con fuente ampliada y navegación al flujo actual, ejecutando la prueba existente de recorrido.

## 3. Verificación y demo
- [x] 3.1 Ejecutar npm run lint, npm run typecheck, npm test -- --ci --runInBand y npx @fission-ai/openspec@1.14.3 validate --all --strict; registrar resultados.
- [x] 3.2 Exportar la web y publicar en nutre-tu-mente-feria; verificar acceso sin autenticación, logo, nombre y botón en móvil, y conservar la URL del despliegue anterior para reversión.
