import { Boton, Tarjeta, Texto } from './ui';
import { cuidadoDisponible } from '../cuidado-disponible';

// Misma respuesta para el cierre durable y la consulta del registro guardado.
export default function CuidadoCheckin({ registro, onAbrirCuidado }) {
  const respuesta = cuidadoDisponible(registro.emocion, registro.necesidad, registro.intensidad);
  if (!respuesta) return null;
  return <>
    <Texto suave>Contenido en revisión clínica</Texto>
    <Tarjeta tono="verde"><Texto>{respuesta.validacion}</Texto></Tarjeta>
    {respuesta.accion ? <Tarjeta><Texto>{respuesta.accion}</Texto></Tarjeta> : null}
    {onAbrirCuidado ? respuesta.recursos.map((recurso) => <Boton key={recurso.href} titulo={recurso.titulo} variante="suave" onPress={() => onAbrirCuidado(recurso.href)} />) : null}
    {respuesta.apoyo && onAbrirCuidado ? <Tarjeta tono="acento">
      <Texto>{respuesta.apoyo.texto}</Texto>
      <Boton titulo={respuesta.apoyo.titulo} variante="acento" onPress={() => onAbrirCuidado(respuesta.apoyo.href)} />
    </Tarjeta> : null}
  </>;
}
