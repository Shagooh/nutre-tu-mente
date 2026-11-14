# Changelog

## Sin publicar · 11 de noviembre de 2026

### Lo que se puede probar

- El onboarding presenta cuatro pantallas de bienvenida, permite saltarlas, pide consentimiento y ofrece la bellota de roble como única especie provisional. Conserva la flor de perfiles anteriores.
- Inicio y Progreso muestran el mismo roble para la cuenta y el mes. Cada fecha confirmada aporta un avance. Varios check-ins del mismo día cuentan una sola vez.
- El bosque determina el día con la hora de recepción en Firestore y la zona America/Santiago. Los registros tardíos o sin conexión conservan su fecha provisional en el historial.
- El laboratorio web permite explorar la animación, los grupos de hojas y sus colores. Docker sirve la app y el laboratorio en una sola vista previa local.

### Persistencia y cuentas

- El guardado espera la escritura en disco y permite reintentar tras un error. La sincronización usa identificadores estables, aísla cuentas y detecta conflictos de perfil.
- El borrado de la copia remota se puede reanudar. Las reglas de Firestore protegen los registros inmutables y la marca de tiempo confirmada. Los reportes de errores requieren consentimiento.

### Pendiente de validación o integración

- Probar las reglas nuevas en staging con dos dispositivos y una cuenta de prueba. Validar también Android e iOS reales.
- Conectar la emoción e intensidad del check-in al color del día. En la app las hojas se muestran verdes. El bosque anual y las seis especies finales siguen en el plan.
- Revisar los textos con el equipo clínico antes de activar el diagnóstico nuevo. La app usa por ahora las preguntas anteriores.
