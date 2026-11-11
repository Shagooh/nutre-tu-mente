# Nutre tu mente

App móvil de Nutrimind, construida con Expo y React Native. Permite registrar cómo te sientes, consultar material de acompañamiento y ver tu árbol mensual. Guarda los datos en el dispositivo y ofrece sincronización opcional con Firebase.

## Probar la entrega

Con Docker Desktop iniciado, ejecuta desde la raíz:

~~~sh
docker compose up -d --build
~~~

Abre [la app](http://localhost:8080) en una ventana privada para recorrer el onboarding con un perfil nuevo. Elige el roble, termina el recorrido y busca la bellota en Inicio. La imagen local funciona sin configuración de Firebase, por lo que sus check-ins quedan provisionales.

Para explorar el crecimiento y los colores con datos ficticios, abre [el laboratorio del roble](http://localhost:8080/roble/). El laboratorio y la app tienen historiales independientes. Para detener el preview ejecuta `docker compose down`.

## Trabajar en el código

Usa Node 24.12 (consulta `.node-version`), instala dependencias con `npm ci` y ejecuta `npm start`. Para comprobar cambios, ejecuta `npm test -- --runInBand`, `npm run lint` y `npm run typecheck`. Las pruebas de seguridad utilizan Java 21 y el emulador local mediante `npm run test:rules`.

El [changelog](CHANGELOG.md) resume esta entrega y sus pendientes. Consulta el [plan V1](docs/PLAN-ACTUALIZACION-V1.md), el [contrato de sincronización y borrado](docs/BASE-SEGURA.md) y la [guía del laboratorio](roble/README.md) para revisar cada área.
