# Uso y despliegue

En bienvenida, después del consentimiento, elige Él, Ella o Neutro. Puedes continuar sin elegir. Desde Perfil, selecciona una opción y pulsa Guardar cambios. La preferencia se aplica tras guardar y funciona sin cuenta y sin red mientras la app está abierta. No se requiere borrar cookies, reinstalar ni repetir la bienvenida. Recargar una web sin conexión requiere que el navegador tenga sus recursos disponibles; este cambio no añade una PWA.

## Compatibilidad

El campo opcional perfil.trato usa masculino/femenino/neutro. La clave nutre-tu-mente:v1 y todos los IDs se conservan. Clientes nuevos fusionan ausencia como falta de elección, no como eliminación; conflictos explícitos se muestran mediante el mecanismo existente. Un cliente antiguo que intente borrar trato por omisión recibe permission-denied con las reglas nuevas: actualizar el cliente, no borrar los datos para resolverlo. Cambiar el trato no reprograma ni activa recordatorios.

## Preparación

El usuario autorizó publicar esta entrega en su Vercel. La demo actual funciona solo con almacenamiento local, sin Firebase configurado. No habilitar Firebase ni publicar sus reglas remotas como efecto de este despliegue.

1. Aprobación clínica y técnica de matriz y aclaración de datos recibida del usuario el 2026-11-20; evidencia en revision-editorial.md.
2. Ejecutar lint, typecheck, npm test y validación OpenSpec estricta. Las reglas se verifican con Java 21 local y npm run test:rules.
3. Para una futura entrega con Firebase, publicar primero las reglas en el proyecto correcto mediante firebase deploy --only firestore:rules --project <ID-verificado>. El pipeline de Hosting no las publica. Probar staging autenticado y sincronización real antes de producción.
4. Para esta demo local, exportar web a .tools/trato-feria-web. Usar configuración estática con buildCommand null, framework null y rewrite a /index.html. Publicar con el proyecto nutre-tu-mente-feria y scope von-team1. Mantener https://nutre-tu-mente-feria.vercel.app para conservar el origen y las sesiones.
5. Comprobar en el dominio público bienvenida, Perfil de sesión antigua, tres opciones, recarga, guardado sin red y conservación de historial/cookies. Las pruebas locales no prueban el despliegue público.

## Rollback

Restaurar el despliegue anterior de Vercel manteniendo el dominio. No borrar almacenamiento ni cambiar su clave. El cliente anterior ignorará la preferencia. Si Firebase se habilita en otro entorno, conservar las reglas compatibles que impiden borrar trato por omisión.

## Cobertura móvil

Pruebas de componentes React Native y navegador Edge a 320 px. Android/iOS físicos y Expo Go pendientes: no se declara validación en dispositivos no disponibles. No hay dependencias nuevas ni cambios nativos.
