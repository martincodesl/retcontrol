"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Calendar, Lock, Unlock } from "lucide-react";

interface BarberoSession {
  id: string;
  nombre: string;
  barberiaSubdominio: string;
}

interface HorarioBloqueado {
  id: string;
  fecha: string;
  motivo: string | null;
}

export default function HorariosBarberoPage() {
  const params = useParams();
  const router = useRouter();
  const subdominio = params.subdominio as string;

  const [barbero, setBarbero] = useState<BarberoSession | null>(null);
  const [bloqueados, setBloqueados] = useState<HorarioBloqueado[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ fecha: "", motivo: "" });
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const session = localStorage.getItem("barbero_session");
    if (!session) {
      router.push(`/${subdominio}/barberos`);
      return;
    }
    const barberoData = JSON.parse(session);
    setBarbero(barberoData);
    cargarBloqueados(barberoData.id);
  }, []);

  const cargarBloqueados = async (barberoId: string) => {
    try {
      const res = await fetch(`/api/barberos/${barberoId}/horarios-bloqueados`);
      const data = await res.json();
      setBloqueados(data.bloqueados || []);
    } catch {
      console.error("Error al cargar horarios");
    } finally {
      setLoading(false);
    }
  };

  const bloquearDia = async () => {
    if (!form.fecha) {
      setError("Selecciona una fecha");
      return;
    }
    setGuardando(true);
    setError("");
    try {
      const res = await fetch(`/api/barberos/${barbero!.id}/horarios-bloqueados`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fecha: form.fecha, motivo: form.motivo || null }),
      });
      if (res.ok) {
        setForm({ fecha: "", motivo: "" });
        cargarBloqueados(barbero!.id);
      }
    } catch {
      setError("Error al bloquear el dia");
    } finally {
      setGuardando(false);
    }
  };

  const desbloquear = async (id: string) => {
    await fetch(`/api/barberos/${barbero!.id}/horarios-bloqueados`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bloqueadoId: id }),
    });
    cargarBloqueados(barbero!.id);
  };

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
        <div style={{ fontFamily: "var(--font-playfair)", fontWeight: 700 }}>Mis Horarios</div>
        <div style={{ width: 80 }} />
      </div>

      <div style={{ padding: "2rem", maxWidth: 700, margin: "0 auto" }}>

        {/* Bloquear dia */}
        <div className="dash-panel" style={{ marginBottom: "1.5rem" }}>
          <div className="dash-panel-title" style={{ marginBottom: "1.2rem" }}>
            Bloquear un dia
          </div>
          <p style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.45)", marginBottom: "1.2rem" }}>
            Si no podes trabajar un dia, bloquealo para que no se agenden turnos automaticamente.
          </p>

          {error && <div className="modal-error">{error}</div>}

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.8rem", marginBottom: "1rem" }}>
            <div className="auth-field">
              <label className="config-label">Fecha a bloquear</label>
              <input
                className="config-input"
                type="date"
                value={form.fecha}
                min={new Date().toISOString().split("T")[0]}
                onChange={(e) => setForm({ ...form, fecha: e.target.value })}
              />
            </div>
            <div className="auth-field">
              <label className="config-label">Motivo (opcional)</label>
              <input
                className="config-input"
                value={form.motivo}
                onChange={(e) => setForm({ ...form, motivo: e.target.value })}
                placeholder="Ej: Vacaciones"
              />
            </div>
          </div>

          <button
            className="dash-topbar-btn"
            onClick={bloquearDia}
            disabled={guardando}
            style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}
          >
            <Lock size={14} />
            {guardando ? "Bloqueando..." : "Bloquear dia"}
          </button>
        </div>

        {/* Dias bloqueados */}
        <div className="dash-panel">
          <div className="dash-panel-header">
            <div className="dash-panel-title">Dias bloqueados</div>
            <span className="dash-panel-action">{bloqueados.length} dias</span>
          </div>

          {loading ? (
            <div style={{ padding: "2rem", textAlign: "center", color: "rgba(255,255,255,0.3)" }}>
              Cargando...
            </div>
          ) : bloqueados.length === 0 ? (
            <div style={{ padding: "2rem", textAlign: "center", color: "rgba(255,255,255,0.3)", fontSize: "0.9rem" }}>
              <Calendar size={32} color="rgba(255,255,255,0.1)" style={{ margin: "0 auto 0.8rem" }} />
              No tenes dias bloqueados
            </div>
          ) : (
            bloqueados.map((b) => {
              const fecha = new Date(b.fecha).toLocaleDateString("es-AR", {
                weekday: "long", day: "numeric", month: "long", year: "numeric"
              });
              return (
                <div key={b.id} className="dash-turno">
                  <div style={{ fontSize: "1.2rem" }}>🔒</div>
                  <div className="dash-turno-info">
                    <div className="dash-turno-name" style={{ textTransform: "capitalize" }}>{fecha}</div>
                    <div className="dash-turno-service">{b.motivo || "Sin motivo especificado"}</div>
                  </div>
                  <button
                    className="svc-btn"
                    onClick={() => desbloquear(b.id)}
                    style={{ borderColor: "rgba(46,204,113,0.3)", color: "#2ECC71", display: "flex", alignItems: "center", gap: "0.3rem" }}
                  >
                    <Unlock size={12} />
                    Desbloquear
                  </button>
                </div>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
}