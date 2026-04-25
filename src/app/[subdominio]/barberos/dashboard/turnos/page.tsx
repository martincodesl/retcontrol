"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Calendar, CheckCircle, XCircle } from "lucide-react";

interface BarberoSession {
  id: string;
  nombre: string;
  barberiaSubdominio: string;
}

interface Turno {
  id: string;
  fecha: string;
  estado: string;
  clienteNombre: string;
  clienteEmail: string;
  servicio: { nombre: string; precio: number; duracion: number };
}

const DIAS = ["Lun", "Mar", "Mie", "Jue", "Vie", "Sab", "Dom"];

function StatusBadge({ estado }: { estado: string }) {
  const map: Record<string, { label: string; className: string }> = {
    PENDIENTE:  { label: "Pendiente",  className: "badge-pending" },
    CONFIRMADO: { label: "Confirmado", className: "badge-active"  },
    EN_CURSO:   { label: "En curso",   className: "badge-active"  },
    COMPLETADO: { label: "Listo",      className: "badge-done"    },
    CANCELADO:  { label: "Cancelado",  className: "badge-cancel"  },
  };
  const s = map[estado] ?? { label: estado, className: "badge-pending" };
  return <span className={`dash-badge ${s.className}`}>{s.label}</span>;
}

export default function TurnosBarberoPage() {
  const params = useParams();
  const router = useRouter();
  const subdominio = params.subdominio as string;

  const [barbero, setBarbero] = useState<BarberoSession | null>(null);
  const [turnos, setTurnos] = useState<Turno[]>([]);
  const [loading, setLoading] = useState(true);
  const [fechaSeleccionada, setFechaSeleccionada] = useState(
    new Date().toISOString().split("T")[0]
  );

  useEffect(() => {
    const session = localStorage.getItem("barbero_session");
    if (!session) {
      router.push(`/${subdominio}/barberos`);
      return;
    }
    const barberoData = JSON.parse(session);
    setBarbero(barberoData);
    cargarTurnos(barberoData.id, fechaSeleccionada);
  }, []);

  const cargarTurnos = async (barberoId: string, fecha: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/barberos/${barberoId}/mis-turnos?fecha=${fecha}`);
      const data = await res.json();
      setTurnos(data.turnos || []);
    } catch {
      console.error("Error al cargar turnos");
    } finally {
      setLoading(false);
    }
  };

  const cambiarFecha = (fecha: string) => {
    setFechaSeleccionada(fecha);
    if (barbero) cargarTurnos(barbero.id, fecha);
  };

  const cambiarEstado = async (turnoId: string, estado: string) => {
    await fetch(`/api/turnos/${turnoId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ estado }),
    });
    if (barbero) cargarTurnos(barbero.id, fechaSeleccionada);
  };

  const generarDias = () => {
    const dias = [];
    for (let i = -2; i <= 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      dias.push(d);
    }
    return dias;
  };

  const formatFechaLabel = (fecha: string) =>
    new Date(fecha + "T12:00:00").toLocaleDateString("es-AR", {
      weekday: "long", day: "numeric", month: "long",
    });

  if (!barbero) return null;

  return (
    <div style={{ minHeight: "100vh", background: "var(--dark)" }}>

      {/* Topbar */}
      <div style={{
        background: "var(--charcoal)",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
        padding: "1rem 2rem",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        position: "sticky", top: 0, zIndex: 50,
      }}>
        <button
          onClick={() => router.push(`/${subdominio}/barberos/dashboard`)}
          style={{ background: "none", border: "none", color: "var(--gold)", cursor: "pointer", fontSize: "0.9rem", fontFamily: "var(--font-dm-sans)" }}
        >
          ← Dashboard
        </button>
        <div style={{ fontFamily: "var(--font-playfair)", fontWeight: 700 }}>Mis Turnos</div>
        <div style={{ width: 80 }} />
      </div>

      <div style={{ padding: "2rem", maxWidth: 900, margin: "0 auto" }}>

        {/* Selector de fecha */}
        <div className="dash-panel" style={{ marginBottom: "1rem" }}>
          <div className="dash-panel-header">
            <div className="dash-panel-title">Selecciona un dia</div>
          </div>
          <div className="turnos-cal-strip">
            {generarDias().map((d) => {
              const iso = d.toISOString().split("T")[0];
              const esHoy = iso === new Date().toISOString().split("T")[0];
              const seleccionado = iso === fechaSeleccionada;
              return (
                <div
                  key={iso}
                  className={`turnos-cal-dia ${seleccionado ? "cal-dia-selected" : ""} ${esHoy && !seleccionado ? "cal-dia-hoy" : ""}`}
                  onClick={() => cambiarFecha(iso)}
                >
                  <div className="cal-dia-label">{DIAS[d.getDay() === 0 ? 6 : d.getDay() - 1]}</div>
                  <div className="cal-dia-num">{d.getDate()}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Lista de turnos */}
        <div className="dash-panel">
          <div className="dash-panel-header">
            <div className="dash-panel-title">{formatFechaLabel(fechaSeleccionada)}</div>
            <span className="dash-panel-action">{turnos.length} turnos</span>
          </div>

          {loading ? (
            <div style={{ padding: "2rem", textAlign: "center", color: "rgba(255,255,255,0.3)" }}>
              Cargando...
            </div>
          ) : turnos.length === 0 ? (
            <div style={{ padding: "2rem", textAlign: "center", color: "rgba(255,255,255,0.3)", fontSize: "0.9rem" }}>
              <Calendar size={32} color="rgba(255,255,255,0.1)" style={{ margin: "0 auto 0.8rem" }} />
              No tenes turnos para este dia
            </div>
          ) : (
            turnos.map((t) => {
              const hora = new Date(t.fecha).toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" });
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
                      {t.servicio.nombre} · {t.servicio.duracion} min
                    </div>
                    <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.3)" }}>
                      {t.clienteEmail}
                    </div>
                  </div>
                  <StatusBadge estado={t.estado} />
                  <div style={{ display: "flex", gap: "0.4rem", marginLeft: "0.5rem" }}>
                    {t.estado === "PENDIENTE" && (
                      <button
                        className="svc-btn"
                        onClick={() => cambiarEstado(t.id, "COMPLETADO")}
                        style={{ borderColor: "rgba(46,204,113,0.3)", color: "#2ECC71" }}
                        title="Marcar como completado"
                      >
                        <CheckCircle size={14} />
                      </button>
                    )}
                    {t.estado !== "CANCELADO" && t.estado !== "COMPLETADO" && (
                      <button
                        className="svc-btn"
                        onClick={() => cambiarEstado(t.id, "CANCELADO")}
                        style={{ borderColor: "rgba(231,76,60,0.3)", color: "#E74C3C" }}
                        title="Cancelar turno"
                      >
                        <XCircle size={14} />
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
}