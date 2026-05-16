interface Insumo {
  tipo: string;
  porcentaje?: number | null;
  precioTotal?: number | null;
  cantidadTotal?: number | null;
  cantidadPorCorte?: number | null;
  montoFijo?: number | null;
  precioMaquina?: number | null;
  cortesDeVida?: number | null;
  servicios: { servicioId: string }[];
}

export interface DesgloseCosto {
  nombreInsumo: string;
  tipo: string;
  costoCalculado: number;
  detalle: string;
}

export interface ResultadoCostos {
  ingresosBrutos: number;
  costoTotal: number;
  gananciaNeta: number;
  porcentajeGanancia: number;
  desglose: DesgloseCosto[];
}

export function calcularCostoPorInsumo(
  insumo: Insumo & { nombre: string },
  precioCorte: number
): DesgloseCosto | null {
  switch (insumo.tipo) {

    case "PORCENTAJE": {
      if (!insumo.porcentaje) return null;
      const costo = (precioCorte * insumo.porcentaje) / 100;
      return {
        nombreInsumo: insumo.nombre,
        tipo: "PORCENTAJE",
        costoCalculado: costo,
        detalle: `${insumo.porcentaje}% del corte ($${precioCorte.toLocaleString("es-AR")})`,
      };
    }

    case "UNIDAD": {
      if (!insumo.precioTotal || !insumo.cantidadTotal || !insumo.cantidadPorCorte) return null;
      const precioPorUnidad = insumo.precioTotal / insumo.cantidadTotal;
      const costo = precioPorUnidad * insumo.cantidadPorCorte;
      return {
        nombreInsumo: insumo.nombre,
        tipo: "UNIDAD",
        costoCalculado: costo,
        detalle: `${insumo.cantidadPorCorte} ${insumo.unidad || "u"} x $${precioPorUnidad.toFixed(2)}/${insumo.unidad || "u"}`,
      };
    }

    case "FIJO": {
      if (!insumo.montoFijo) return null;
      return {
        nombreInsumo: insumo.nombre,
        tipo: "FIJO",
        costoCalculado: insumo.montoFijo,
        detalle: `Costo fijo por corte`,
      };
    }

    case "AMORTIZACION": {
      if (!insumo.precioMaquina || !insumo.cortesDeVida) return null;
      const costo = insumo.precioMaquina / insumo.cortesDeVida;
      return {
        nombreInsumo: insumo.nombre,
        tipo: "AMORTIZACION",
        costoCalculado: costo,
        detalle: `$${insumo.precioMaquina.toLocaleString("es-AR")} / ${insumo.cortesDeVida.toLocaleString("es-AR")} cortes de vida`,
      };
    }

    default:
      return null;
  }
}

export function calcularGananciaTurno(
  precioServicio: number,
  servicioId: string,
  insumos: (Insumo & { nombre: string })[]
): ResultadoCostos {
  // Filtrar insumos que aplican a este servicio
  const insumosAplicables = insumos.filter(
    (ins) =>
      ins.servicios.length === 0 ||
      ins.servicios.some((s) => s.servicioId === servicioId)
  );

  const desglose: DesgloseCosto[] = [];

  for (const insumo of insumosAplicables) {
    const resultado = calcularCostoPorInsumo(insumo, precioServicio);
    if (resultado) desglose.push(resultado);
  }

  const costoTotal = desglose.reduce((acc, d) => acc + d.costoCalculado, 0);
  const gananciaNeta = precioServicio - costoTotal;
  const porcentajeGanancia = precioServicio > 0
    ? (gananciaNeta / precioServicio) * 100
    : 0;

  return {
    ingresosBrutos: precioServicio,
    costoTotal,
    gananciaNeta,
    porcentajeGanancia,
    desglose,
  };
}