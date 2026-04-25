"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Calendar, DollarSign, Clock, LogOut } from "lucide-react";

interface BarberoSession {
  id: string;
  nombre: string;
  usuario: string;
  especialidad: string | null;
  barberiaId: string;
  barberiaNombre: string;
  barberiaSubdominio: string;
}

interface Turno {
  id: string;
  fecha: string;
  estado: string;
  clienteNombre: string;
  servicio: { nombre: string; precio: number; duracion: number };
}

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

export default function DashboardBarberoPage() {
  const params = useParams();
  const router = useRouter();
  const subdominio = params.subdominio as string;

  const [barbero, setBarbero] = useState<BarberoSession | null>(null);
  const [turnos, setTurnos] = useState<Turno[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const session = localStorage.getItem("barbero_session");
    if (!session) {
      router.push(`/${subdominio}/barberos`);
      return;
    }
    const barberoData = JSON.parse(session);
    setBarbero(barberoData);
    cargarTurnos(barberoData.id);
  }, []);

  const cargarTurnos = async (barberoId: string) => {
    try {
      const hoy = new Date().toISOString().split("T")[0];
      const res = await fetch(`/api/barberos/${barberoId}/mis-turnos?fecha=${hoy}`);
      const data = await res.json();
      setTurnos(data.turnos || []);
    } catch {
      console.error("Error al cargar turnos");
    } finally {
      setLoading(false);
    }
  };

  const cerrarSesion = () => {
    localStorage.removeItem("barbero_session");
    router.push(`/${subdominio}/barberos`);
  };

  if (!barbero) return null;

  const turnosHoy = turnos.length;
  const ingresoHoy = turnos
    .filter((t) => t.estado === "COMPLETADO")
    .reduce((acc, t) => acc + t.servicio.precio, 0);

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
        <div>
          <div style={{ fontFamily: "var(--font-playfair)", color: "var(--gold)", fontWeight: 700, fontSize: "1.1rem" }}>
            Hola, {barbero.nombre} 👋
          </div>
          <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.35)", marginTop: "0.1rem" }}>
            {barbero.barberiaNombre} · @{barbero.usuario}
          </div>
        </div>
        <button
          onClick={cerrarSesion}
          style={{ background: "none", border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.5)", padding: "0.5rem 1rem", borderRadius: 6, cursor: "pointer", display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.82rem", fontFamily: "var(--font-dm-sans)" }}
        >
          <LogOut size={14} />
          Salir
        </button>
      </div>

      <div style={{ padding: "2rem", maxWidth: 900, margin: "0 auto" }}>

        {/* KPIs */}
        <div className="dash-cards" style={{ marginBottom: "1.5rem" }}>
          <div className="dash-card">
            <div className="dash-card-top">
              <div className="dash-card-label">Turnos hoy</div>
              <div className="dash-card-icon"><Calendar size={16} color="var(--gold)" /></div>
            </div>
            <div className="dash-card-val">{turnosHoy}</div>
            <div className="dash-card-sub dash-neu">para hoy</div>
          </div>
          <div className="dash-card">
            <div className="dash-card-top">
              <div className="dash-card-label">Ingresos hoy</div>
              <div className="dash-card-icon"><DollarSign size={16} color="var(--gold)" /></div>
            </div>
            <div className="dash-card-val" style={{ color: "#2ECC71", fontSize: "1.6rem" }}>
              ${ingresoHoy.toLocaleString("es-AR")}
            </div>
            <div className="dash-card-sub dash-up">turnos completados</div>
          </div>
        </div>

        {/* Navegacion rapida */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1rem", marginBottom: "1.5rem" }}>
          {[
            { label: "Mis Turnos",  icon: Calendar,  href: `/${subdominio}/barberos/dashboard/turnos`   },
            { label: "Horarios",    icon: Clock,      href: `/${subdominio}/barberos/dashboard/horarios`  },
            { label: "Finanzas",    icon: DollarSign, href: `/${subdominio}/barberos/dashboard/finanzas`  },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                href={item.href}
                style={{ textDecoration: "none" }}
              >
                <div className="dash-card" style={{ textAlign: "center", cursor: "pointer", transition: "border-color 0.2s" }}>
                  <Icon size={24} color="var(--gold)" style={{ margin: "0 auto 0.5rem" }} />
                  <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>{item.label}</div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Turnos de hoy */}
        <div className="dash-panel">
          <div className="dash-panel-header">
            <div className="dash-panel-title">Mis turnos de hoy</div>
          </div>
          {loading ? (
            <div style={{ padding: "2rem", textAlign: "center", color: "rgba(255,255,255,0.3)" }}>
              Cargando...
            </div>
          ) : turnos.length === 0 ? (
            <div style={{ padding: "2rem", textAlign: "center", color: "rgba(255,255,255,0.3)", fontSize: "0.9rem" }}>
              No tenes turnos para hoy
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
                    <div className="dash-turno-service">{t.servicio.nombre} · {t.servicio.duracion} min</div>
                  </div>
                  <StatusBadge estado={t.estado} />
                </div>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
}