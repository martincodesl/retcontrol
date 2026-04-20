import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { TrendingUp, TrendingDown, DollarSign, BarChart2 } from "lucide-react";

async function getFinanzasData(barberiaId: string) {
  const ahora = new Date();
  const inicioMes = new Date(ahora.getFullYear(), ahora.getMonth(), 1);
  const inicioMesAnterior = new Date(ahora.getFullYear(), ahora.getMonth() - 1, 1);
  const finMesAnterior = new Date(ahora.getFullYear(), ahora.getMonth(), 0);

  const [turnosMes, turnosMesAnterior, barberos] = await Promise.all([
    prisma.turno.findMany({
      where: {
        barberiaId,
        fecha: { gte: inicioMes },
        estado: "COMPLETADO",
      },
      include: {
        servicio: { select: { precio: true, nombre: true } },
        barbero: { select: { nombre: true } },
      },
      orderBy: { fecha: "desc" },
    }),
    prisma.turno.findMany({
      where: {
        barberiaId,
        fecha: { gte: inicioMesAnterior, lte: finMesAnterior },
        estado: "COMPLETADO",
      },
      include: {
        servicio: { select: { precio: true } },
      },
    }),
    prisma.barbero.findMany({
      where: { barberiaId, activo: true },
    }),
  ]);

  const ingresosMes = turnosMes.reduce((acc, t) => acc + t.servicio.precio, 0);
  const ingresosMesAnterior = turnosMesAnterior.reduce((acc, t) => acc + t.servicio.precio, 0);
  const variacion = ingresosMesAnterior > 0
    ? Math.round(((ingresosMes - ingresosMesAnterior) / ingresosMesAnterior) * 100)
    : 0;

  const ticketPromedio = turnosMes.length > 0
    ? Math.round(ingresosMes / turnosMes.length)
    : 0;

  // Ingresos por barbero
  const porBarbero = barberos.map((b) => {
    const turnosBarbero = turnosMes.filter((t) => t.barberoId === b.id);
    const ingreso = turnosBarbero.reduce((acc, t) => acc + t.servicio.precio, 0);
    return { ...b, turns: turnosBarbero.length, ingreso };
  }).sort((a, b) => b.ingreso - a.ingreso);

  // Ultimos movimientos
  const movimientos = turnosMes.slice(0, 5);

  return { ingresosMes, variacion, ticketPromedio, turnosMes, porBarbero, movimientos };
}

export default async function FinanzasPage() {
  const session = await auth();
  if (!session) return null;

  const {
    ingresosMes,
    variacion,
    ticketPromedio,
    turnosMes,
    porBarbero,
    movimientos,
  } = await getFinanzasData(session.user.id);

  const formatPrecio = (n: number) => `$${n.toLocaleString("es-AR")}`;

  const kpis = [
    {
      label: "Ingresos del mes",
      value: formatPrecio(ingresosMes),
      sub: `${variacion > 0 ? "+" : ""}${variacion}% vs mes anterior`,
      trend: variacion >= 0 ? "up" : "down",
      icon: TrendingUp,
    },
    {
      label: "Turnos cobrados",
      value: turnosMes.length.toString(),
      sub: "completados este mes",
      trend: "neu",
      icon: BarChart2,
    },
    {
      label: "Ticket promedio",
      value: formatPrecio(ticketPromedio),
      sub: "por turno",
      trend: "neu",
      icon: DollarSign,
    },
    {
      label: "Proyeccion mensual",
      value: formatPrecio(ingresosMes * 1.1),
      sub: "estimado fin de mes",
      trend: "up",
      icon: TrendingUp,
    },
  ];

  return (
    <div className="dash-content">

      {/* Topbar */}
      <div className="dash-topbar">
        <div className="dash-topbar-title">Finanzas</div>
        <button className="dash-topbar-btn">+ Registrar gasto</button>
      </div>

      {/* KPIs */}
      <div className="dash-cards">
        {kpis.map((k) => {
          const Icon = k.icon;
          return (
            <div key={k.label} className="dash-card">
              <div className="dash-card-top">
                <div className="dash-card-label">{k.label}</div>
                <div className="dash-card-icon">
                  <Icon size={16} color="var(--gold)" />
                </div>
              </div>
              <div
                className="dash-card-val"
                style={{
                  color: k.trend === "up" ? "#2ECC71"
                       : k.trend === "down" ? "#E74C3C"
                       : "var(--white)",
                  fontSize: "1.6rem",
                }}
              >
                {k.value}
              </div>
              <div className={`dash-card-sub dash-${k.trend}`}>{k.sub}</div>
            </div>
          );
        })}
      </div>

      <div className="dash-two-col">

        {/* Ingresos por barbero */}
        <div className="dash-panel">
          <div className="dash-panel-header">
            <div className="dash-panel-title">Ingresos por barbero — este mes</div>
          </div>
          {porBarbero.length === 0 ? (
            <div style={{ padding: "2rem", textAlign: "center", color: "rgba(255,255,255,0.3)", fontSize: "0.9rem" }}>
              No hay ingresos registrados este mes
            </div>
          ) : (
            <table className="svc-table">
              <thead>
                <tr>
                  <th>Barbero</th>
                  <th style={{ textAlign: "center" }}>Turnos</th>
                  <th style={{ textAlign: "right" }}>Ingreso</th>
                </tr>
              </thead>
              <tbody>
                {porBarbero.map((b) => (
                  <tr key={b.id}>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                        <div className="dash-barber-av" style={{
                          background: "rgba(201,168,76,0.15)",
                          color: "var(--gold)",
                          width: 28, height: 28, fontSize: "0.7rem"
                        }}>
                          {b.nombre.slice(0, 2).toUpperCase()}
                        </div>
                        {b.nombre}
                      </div>
                    </td>
                    <td style={{ textAlign: "center" }}>{b.turns}</td>
                    <td style={{ textAlign: "right", color: "#2ECC71", fontWeight: 600, fontFamily: "monospace" }}>
                      {formatPrecio(b.ingreso)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Ultimos movimientos */}
        <div className="dash-panel">
          <div className="dash-panel-header">
            <div className="dash-panel-title">Ultimos ingresos</div>
          </div>
          {movimientos.length === 0 ? (
            <div style={{ padding: "2rem", textAlign: "center", color: "rgba(255,255,255,0.3)", fontSize: "0.9rem" }}>
              No hay movimientos este mes
            </div>
          ) : (
            movimientos.map((t) => (
              <div key={t.id} className="fin-mov-item">
                <div className="fin-mov-icon fin-mov-in">↑</div>
                <div className="fin-mov-info">
                  <div className="fin-mov-desc">{t.servicio.nombre} · {t.clienteNombre}</div>
                  <div className="fin-mov-sub">
                    {new Date(t.fecha).toLocaleDateString("es-AR")} · {t.barbero.nombre}
                  </div>
                </div>
                <div className="fin-mov-monto" style={{ color: "#2ECC71" }}>
                  +{formatPrecio(t.servicio.precio)}
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}