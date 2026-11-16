# Vista previa local con Docker

Con Docker Desktop iniciado, ejecutar desde la raíz del proyecto:

```powershell
docker compose up -d --build
```

- App web en http://localhost:8080
- Laboratorio del roble animado en http://localhost:8080/roble/

El laboratorio permite explorar crecimiento, seleccionar hojas, cambiar emociones y ver los meses del bosque. Su integración con los check-ins de la app sigue pendiente.

Esta imagen se construye en modo local, con Firebase y reportes externos sin configurar. Los datos se guardan en el navegador. Usar siempre la misma dirección y navegador para conservar esa copia.

Después de editar el código, repetir `docker compose up -d --build` y recargar la página para ver la nueva compilación. La imagen compila con Node 24.12.0 y sirve los recursos con nginx.

Para revisar estado o detener la vista previa:

```powershell
docker compose ps
docker compose logs --tail 50 web
docker compose down
```

La vista previa se publica en el puerto 8080 del equipo local. Las notificaciones nativas y la experiencia completa de iOS/Android requieren sus pruebas móviles correspondientes.
