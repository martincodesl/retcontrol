"use client";

import { useState, useEffect } from "react";
import { Globe, Bell, Calendar, CreditCard, Shield, Save } from "lucide-react";

interface Barberia {
  nombre: string;
  slogan: string;
  descripcion: string;
  direccion: string;
  telefono: string;
  subdominio: string;
  plan: string;
}

export default function ConfiguracionPage() {
  const [barberia, setBarberia] = useState<Barberia | null>(null);
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [guardado, setGuardado] = useState(false);
  const [recordatorios, setRecordatorios] = useState(true);
  const [confirmManual, setConfirmManual] = useState(false);
  const [turnosOnline, setTurnosOnline] = useState(true);
  const [form, setForm] = useState({
    nombre: "",
    slogan: "",
    descripcion: "",
    direccion: "",
    telefono: "",
  });

  useEffect(() => {
    const cargar = async () => {
      try {
        const res = await fetch("/api/barberia/perfil");
        const data = await res.json();
        if (data.barberia) {
          setBarberia(data.barberia);
          setForm({
            nombre: data.barberia.nombre || "",
            slogan: data.barberia.slogan || "",
            descripcion: data.barberia.descripcion || "",
            direccion: data.barberia.direccion || "",
            telefono: data.barberia.telefono || "",
          });
        }
      } catch {
        console.error("Error al cargar barberia");
      } finally {
        setLoading(false);
      }
    };
    cargar();
  }, []);

  const guardar = async () => {
    setGuardando(true);
    try {
      const res = await fetch("/api/barberia/perfil", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setGuardado(true);
        setTimeout(() => setGuardado(false), 3000);
      }
    } catch {
      console.error("Error al guardar");
    } finally {
      setGuardando(false);
    }
  };

  if (loading) {
    return (
      <div className="dash-content">
        <div style={{ padding: "3rem", textAlign: "center", color: "rgba(255,255,255,0.3)" }}>
          Cargando...
        </div>
      </div>
    );
  }

  return (
    <div className="dash-content">

      <div className="dash-topbar">
        <div className="dash-topbar-title">Configuracion</div>
        <button className="dash-topbar-btn" onClick={guardar} disabled={guardando}>
          <Save size={14} style={{ display: "inline", marginRight: 4 }} />
          {guardando ? "Guardando..." : guardado ? "Guardado ✓" : "Guardar cambios"}
        </button>
      </div>

      <div className="config-layout">

        {/* Mi Sitio */}
        <div className="dash-panel">
          <div className="config-section-title">
            <Globe size={16} color="var(--gold)" />
            Mi Sitio Publico
          </div>

          <div style={{
            background: "rgba(46,204,113,0.08)",
            border: "1px solid rgba(46,204,113,0.2)",
            borderRadius: 8, padding: "0.9rem 1rem",
            display: "flex", alignItems: "center", gap: "0.8rem",
            marginBottom: "1.2rem"
          }}>
            <div style={{ fontSize: "1.2rem" }}>✅</div>
            <div>
              <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>Tu sitio esta online</div>
              <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.4)", fontFamily: "monospace" }}>
                {barberia?.subdominio}.retcontrol.app
              </div>
            </div>
          </div>

          <div className="config-fields">
            <div className="config-field">
              <label className="config-label">Nombre del negocio</label>
              <input
                className="config-input"
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              />
            </div>
            <div className="config-field">
              <label className="config-label">Slogan</label>
              <input
                className="config-input"
                value={form.slogan}
                onChange={(e) => setForm({ ...form, slogan: e.target.value })}
                placeholder="Tu estilo, nuestra pasion"
              />
            </div>
            <div className="config-field">
              <label className="config-label">Direccion</label>
              <input
                className="config-input"
                value={form.direccion}
                onChange={(e) => setForm({ ...form, direccion: e.target.value })}
                placeholder="Av. Corrientes 1234, CABA"
              />
            </div>
            <div className="config-field">
              <label className="config-label">WhatsApp</label>
              <input
                className="config-input"
                value={form.telefono}
                onChange={(e) => setForm({ ...form, telefono: e.target.value })}
                placeholder="+54 11 1234-5678"
              />
            </div>
          </div>

          <div className="config-field" style={{ marginTop: "0.5rem" }}>
            <label className="config-label">Descripcion</label>
            <textarea
              className="config-input config-textarea"
              value={form.descripcion}
              onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
              placeholder="Contales a tus clientes quienes son..."
            />
          </div>
        </div>

        {/* Notificaciones */}
        <div className="dash-panel">
          <div className="config-section-title">
            <Bell size={16} color="var(--gold)" />
            Notificaciones
          </div>
          <div className="config-toggle-item">
            <div>
              <div className="config-toggle-label">Recordatorios automaticos</div>
              <div className="config-toggle-desc">Email al cliente 24hs antes del turno</div>
            </div>
            <div
              className={`config-toggle ${recordatorios ? "toggle-on" : "toggle-off"}`}
              onClick={() => setRecordatorios(!recordatorios)}
            >
              <div className="config-toggle-knob" />
            </div>
          </div>
          <div className="config-toggle-item">
            <div>
              <div className="config-toggle-label">Confirmacion manual</div>
              <div className="config-toggle-desc">Debas aprobar cada reserva antes de confirmarla</div>
            </div>
            <div
              className={`config-toggle ${confirmManual ? "toggle-on" : "toggle-off"}`}
              onClick={() => setConfirmManual(!confirmManual)}
            >
              <div className="config-toggle-knob" />
            </div>
          </div>
          <div className="config-toggle-item">
            <div>
              <div className="config-toggle-label">Turnos online activos</div>
              <div className="config-toggle-desc">Tus clientes pueden reservar desde tu sitio</div>
            </div>
            <div
              className={`config-toggle ${turnosOnline ? "toggle-on" : "toggle-off"}`}
              onClick={() => setTurnosOnline(!turnosOnline)}
            >
              <div className="config-toggle-knob" />
            </div>
          </div>
        </div>

        {/* Horarios */}
        <div className="dash-panel">
          <div className="config-section-title">
            <Calendar size={16} color="var(--gold)" />
            Horarios de atencion
          </div>
          <div className="config-horarios">
            {[
              { dia: "Lunes",     desde: "09:00", hasta: "20:00", activo: true  },
              { dia: "Martes",    desde: "09:00", hasta: "20:00", activo: true  },
              { dia: "Miercoles", desde: "09:00", hasta: "20:00", activo: true  },
              { dia: "Jueves",    desde: "09:00", hasta: "20:00", activo: true  },
              { dia: "Viernes",   desde: "09:00", hasta: "20:00", activo: true  },
              { dia: "Sabado",    desde: "09:00", hasta: "17:00", activo: true  },
              { dia: "Domingo",   desde: "",       hasta: "",      activo: false },
            ].map((h) => (
              <div key={h.dia} className="config-horario-row">
                <span className="config-horario-dia">{h.dia}</span>
                {h.activo ? (
                  <div className="config-horario-inputs">
                    <input className="config-input config-time-input" defaultValue={h.desde} type="time" />
                    <span style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.8rem" }}>a</span>
                    <input className="config-input config-time-input" defaultValue={h.hasta} type="time" />
                  </div>
                ) : (
                  <span className="config-horario-cerrado">Cerrado</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Suscripcion */}
        <div className="dash-panel">
          <div className="config-section-title">
            <CreditCard size={16} color="var(--gold)" />
            Suscripcion
          </div>
          <div className="config-plan">
            <div className="config-plan-info">
              <div className="config-plan-name">Plan {barberia?.plan}</div>
              <div className="config-plan-price">
                {barberia?.plan === "STARTER" ? "$15" : barberia?.plan === "PRO" ? "$25" : "$40"} USD / mes
              </div>
              <div className="config-plan-next">Administra tu suscripcion desde el panel de pagos</div>
            </div>
            <button className="barbero-btn-outline">Cambiar plan</button>
          </div>
          <div className="config-plan-features">
            {[
              barberia?.plan === "STARTER" ? "Hasta 2 barberos" : barberia?.plan === "PRO" ? "Hasta 5 barberos" : "Barberos ilimitados",
              "Subdominio propio",
              "Turnos online ilimitados",
              barberia?.plan !== "STARTER" ? "Notificaciones por email" : null,
            ].filter(Boolean).map((f) => (
              <div key={f!} className="config-plan-feat">
                <Shield size={12} color="var(--gold)" />
                {f}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}