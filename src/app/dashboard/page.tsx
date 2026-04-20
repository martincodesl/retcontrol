import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Calendar, Users, TrendingUp, XCircle } from "lucide-react";

async function getDashboardData(barberiaId: string) {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const finHoy = new Date();
  finHoy.setHours(23, 59, 59, 999);

  const inicioSemana = new Date();
  inicioSemana.setDate(inicioSemana.getDate() - 7);

  const [
    turnosHoy,
    turnosSemana,
    barberos,
    cancelaciones,
  ] = await Promise.all([
    prisma.turno.findMany({
      where: {
        barberiaId,
        fecha: { gte: hoy, lte: finHoy },
      },
      include: {
        barbero: { select: { nombre: true } },
        servicio: { select: { nombre: true, duracion: true } },
      },
      orderBy: { fecha: "asc" },
    }),
    prisma.turno.count({
      where: {
        barberiaId,
        fecha: { gte: inicioSemana },
        estado: { not: "CANCELADO" },
      },
    }),
    prisma.barbero.findMany({
      where: { barberiaId, activo: true },
    }),
    prisma.turno.count({
      where: {
        barberiaId,
        fecha: { gte: hoy, lte: finHoy },
        estado: "CANCELADO",
      },
    }),
  ]);

  return { turnosHoy, turnosSemana, barberos, cancelaciones };
}

function StatusBadge({ estado }: { estado: string }) {
  const map: Record<string, { label: string; className: string }> = {
    PENDIENTE:   { label: "Pendiente",  className: "badge-pending" },
    CONFIRMADO:  { label: "Confirmado", className: "badge-active" },
    EN_CURSO:    { label: "En curso",   className: "badge-active" },
    COMPLETADO:  { label: "Listo",      className: "badge-done" },
    CANCELADO:   { label: "Cancelado",  className: "badge-cancel" },
  };
  const s = map[estado] ?? { label: estado, className: "badge-pending" };
  return <span className={`dash-badge ${s.className}`}>{s.label}</span>;
}

export default async function DashboardPage() {
  const session = await auth();
  if (!session) return null;

  const { turnosHoy, turnosSemana, barberos, cancelaciones } =
    await getDashboardData(session.user.id);

  const pendientes = turnosHoy.filter(
    (t) => t.estado === "PENDIENTE" || t.estado === "CONFIRMADO"
  ).length;

  const stats = [
    { label: "Turnos hoy",       value: turnosHoy.length.toString(),   sub: `${pendientes} pendientes`,   trend: "up",  icon: Calendar  },
    { label: "Esta semana",      value: turnosSemana.toString(),        sub: "ultimos 7 dias",             trend: "up",  icon: TrendingUp },
    { label: "Barberos activos", value: barberos.length.toString(),     sub: "en tu equipo",               trend: "neu", icon: Users     },
    { label: "Cancelaciones",    value: cancelaciones.toString(),       sub: "hoy",                        trend: cancelaciones > 0 ? "down" : "neu", icon: XCircle },
  ];

  return (
    <div className="dash-content">
      <div className="dash-topbar">
        <div className="dash-topbar-title">
          Bienvenido, {(session.user as any).nombre || session.user.email}
        </div>
        <button className="dash-topbar-btn">+ Nuevo turno</button>
      </div>

      {/* KPIs */}
      <div className="dash-cards">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="dash-card">
              <div className="dash-card-top">
                <div className="dash-card-label">{s.label}</div>
                <div className="dash-card-icon">
                  <Icon size={16} color="var(--gold)" />
                </div>
              </div>
              <div className="dash-card-val">{s.value}</div>
              <div className={`dash-card-sub dash-${s.trend}`}>{s.sub}</div>
            </div>
          );
        })}
      </div>

      <div className="dash-two-col">

        {/* Turnos del dia */}
        <div className="dash-panel">
          <div className="dash-panel-header">
            <div className="dash-panel-title">Turnos de hoy</div>
            <span className="dash-panel-action">Ver todos →</span>
          </div>

          {turnosHoy.length === 0 ? (
            <div style={{ padding: "2rem 0", textAlign: "center", color: "rgba(255,255,255,0.3)", fontSize: "0.9rem" }}>
              No hay turnos para hoy
            </div>
          ) : (
            turnosHoy.map((t) => {
              const hora = new Date(t.fecha).toLocaleTimeString("es-AR", {
                hour: "2-digit", minute: "2-digit"
              });
              const initials = t.clienteNombre.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
              return (
                <div key={t.id} className="dash-turno">
                  <div className="dash-turno-time">{hora}</div>
                  <div className="dash-turno-avatar" style={{ background: "rgba(201,168,76,0.15)", color: "var(--gold)" }}>
                    {initials}
                  </div>
                  <div className="dash-turno-info">
                    <div className="dash-turno-name">{t.clienteNombre}</div>
                    <div className="dash-turno-service">
                      {t.servicio.nombre} · {t.barbero.nombre}
                    </div>
                  </div>
                  <StatusBadge estado={t.estado} />
                </div>
              );
            })
          )}
        </div>

        {/* Equipo */}
        <div className="dash-panel">
          <div className="dash-panel-header">
            <div className="dash-panel-title">Tu equipo</div>
            <span className="dash-panel-action">Ver todos →</span>
          </div>

          {barberos.length === 0 ? (
            <div style={{ padding: "2rem 0", textAlign: "center", color: "rgba(255,255,255,0.3)", fontSize: "0.9rem" }}>
              No hay barberos cargados aun
            </div>
          ) : (
            barberos.map((b) => (
              <div key={b.id} className="dash-barber-row">
                <div className="dash-online-dot dot-online" />
                <div className="dash-barber-av" style={{ background: "rgba(201,168,76,0.15)", color: "var(--gold)" }}>
                  {b.nombre.slice(0, 2).toUpperCase()}
                </div>
                <div className="dash-barber-info">
                  <div className="dash-barber-name">{b.nombre}</div>
                  <div className="dash-barber-spec">{b.especialidad || "Sin especialidad"}</div>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}