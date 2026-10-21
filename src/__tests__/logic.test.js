import { ETAPAS, FRASES } from '../content';
import {
  cambioCalma,
  cuestasUltimaSemana,
  diasDesde,
  etapaPlanta,
  fraseDelDia,
  hoyISO,
  logros,
  puntos,
  ultimos7,
} from '../logic';

const vacio = () => ({ checkins: [], cuestas: [], lecciones: [], mental: [], retornos: 0 });

describe('puntos de cuidado', () => {
  test('sin actividad son 0', () => {
    expect(puntos(vacio())).toBe(0);
  });

  test('varios check-ins el mismo día cuentan una sola vez', () => {
    const d = { ...vacio(), checkins: [{ fecha: '2026-10-01', animo: 3 }, { fecha: '2026-10-01', animo: 4 }] };
    expect(puntos(d)).toBe(1);
  });

  test('"Me está costando" suma como máximo 3 por día', () => {
    const cuestas = Array.from({ length: 6 }, () => ({ fecha: '2026-10-01' }));
    expect(puntos({ ...vacio(), cuestas })).toBe(3);
  });

  test('cada lección leída suma 2', () => {
    expect(puntos({ ...vacio(), lecciones: ['a', 'b'] })).toBe(4);
  });

  test('es una suma: nunca baja al agregar actividad', () => {
    const base = { ...vacio(), checkins: [{ fecha: '2026-10-01', animo: 3 }] };
    const mas = { ...base, lecciones: ['a'] };
    expect(puntos(mas)).toBeGreaterThanOrEqual(puntos(base));
  });
});

describe('planta', () => {
  test('empieza como semilla', () => {
    expect(etapaPlanta(0, 'girasol').nombre).toBe('Semilla');
  });

  test('la etapa nunca retrocede al subir los puntos', () => {
    let anterior = -1;
    for (let p = 0; p <= 40; p++) {
      const idx = ETAPAS.findIndex((e) => e.nombre === etapaPlanta(p, 'rosa').nombre);
      expect(idx).toBeGreaterThanOrEqual(anterior);
      anterior = idx;
    }
  });

  test('al florecer usa la flor elegida', () => {
    expect(etapaPlanta(15, 'rosa').emoji).toBe('🌹');
    expect(etapaPlanta(15, 'cerezo').emoji).toBe('🌸');
  });

  test('una flor desconocida cae al girasol', () => {
    expect(etapaPlanta(15, 'inexistente').emoji).toBe('🌻');
  });
});

describe('frase del día', () => {
  test('siempre devuelve una frase del estilo pedido', () => {
    Object.keys(FRASES).forEach((estilo) => {
      expect(FRASES[estilo]).toContain(fraseDelDia(estilo));
    });
  });

  test('un estilo desconocido no rompe', () => {
    expect(typeof fraseDelDia('nada')).toBe('string');
  });
});

describe('últimos 7 días', () => {
  test('devuelve 7 días, el último es hoy', () => {
    const dias = ultimos7(vacio());
    expect(dias).toHaveLength(7);
    expect(dias[6].fecha).toBe(hoyISO());
  });

  test('los días sin check-in quedan en blanco', () => {
    expect(ultimos7(vacio()).every((d) => d.animo === null && d.emoji === null)).toBe(true);
  });

  test('promedia el ánimo de varios check-ins del mismo día', () => {
    const d = { ...vacio(), checkins: [{ fecha: hoyISO(), animo: 2 }, { fecha: hoyISO(), animo: 4 }] };
    expect(ultimos7(d)[6].animo).toBe(3);
  });
});

describe('calma antes y después', () => {
  test('sin datos no hay resultado', () => {
    expect(cambioCalma(vacio())).toBeNull();
  });

  test('calcula el cambio promedio', () => {
    const d = {
      ...vacio(),
      cuestas: [
        { calmaAntes: 2, calmaDespues: 4 },
        { calmaAntes: 3, calmaDespues: 4 },
      ],
    };
    expect(cambioCalma(d)).toEqual({ promedio: 1.5, veces: 2 });
  });

  test('ignora registros incompletos', () => {
    const d = { ...vacio(), cuestas: [{ calmaAntes: 2 }, { calmaAntes: 1, calmaDespues: 3 }] };
    expect(cambioCalma(d).veces).toBe(1);
  });
});

describe('fechas', () => {
  test('hoy está a 0 días de distancia', () => {
    expect(diasDesde(hoyISO())).toBe(0);
  });

  test('sin fecha cuenta como infinito', () => {
    expect(diasDesde(null)).toBe(Infinity);
  });

  test('cuenta bien los usos de la última semana', () => {
    const viejo = new Date();
    viejo.setDate(viejo.getDate() - 30);
    const d = { ...vacio(), cuestas: [{ fecha: hoyISO() }, { fecha: hoyISO(viejo) }] };
    expect(cuestasUltimaSemana(d)).toBe(1);
  });
});

describe('logros', () => {
  test('al empezar no hay ninguno logrado', () => {
    expect(logros(vacio()).every((l) => !l.ok)).toBe(true);
  });

  test('se desbloquean con la actividad correspondiente', () => {
    const d = {
      ...vacio(),
      checkins: [{ fecha: '2026-10-01', animo: 3 }],
      cuestas: [{ fecha: '2026-10-01', respiro: true }],
      lecciones: ['a'],
      retornos: 1,
    };
    const ok = Object.fromEntries(logros(d).map((l) => [l.id, l.ok]));
    expect(ok).toMatchObject({ l1: true, l2: true, l4: true, l6: true, l3: false, l7: false });
  });

  test('ningún logro se basa en rachas, peso ni calorías', () => {
    const textos = logros(vacio()).map((l) => l.texto.toLowerCase()).join(' ');
    expect(textos).not.toMatch(/racha|peso|calor[ií]a|kilo|d[ií]as seguidos/);
  });
});

describe('contenido', () => {
  test('las frases evitan las palabras que el documento pide no usar', () => {
    const prohibidas = /deber[ií]as|dieta|prohibido|permitido|fuerza de voluntad|compensar|quemar|todo o nada/i;
    const todas = Object.values(FRASES).flat();
    todas.forEach((f) => expect(f).not.toMatch(prohibidas));
  });
});
