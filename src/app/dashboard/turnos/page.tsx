"use client";

import { useState, useEffect } from "react";
import { Calendar, Plus, X } from "lucide-react";

interface Barbero {
  id: string;
  nombre: string;
}

interface Servicio {
  id: string;
  nombre: string;
  duracion: number;
  precio: number;
}

interface Turno {
  id: string;
  fecha: string;
  estado: string;
  clienteNombre: string;
  clienteEmail: string;
  barbero: { id: string; nombre: string };
  servicio: { id: string; nombre: string; duracion: number; precio: number };
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

export default function TurnosPage() {
  const [turnos, setTurnos] = useState<Turno[]>([]);
  const [barberos, setBarberos] = useState<Barbero[]>([]);
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [loading, setLoading] = useState(true);
  const [fechaSeleccionada, setFechaSeleccionada] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [modalAbierto, setModalAbierto] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    fecha: "",
    hora: "",
    barberoId: "",
    servicioId: "",
    clienteNombre: "",
    clienteEmail: "",
    clienteTelefono: "",
  });

  // Cargar turnos del dia seleccionado
  const cargarTurnos = async (fecha: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/turnos?fecha=${fecha}`);
      const data = await res.json();
      setTurnos(data.turnos || []);
    } catch {
      console.error("Error al cargar turnos");
    } finally {
      setLoading(false);
    }
  };

  // Cargar barberos y servicios para el modal
  const cargarOpciones = async () => {
    try {
      const [resBarberos, resServicios] = await Promise.all([
        fetch("/api/barberos"),
        fetch("/api/servicios"),
      ]);
      const dataBarberos = await resBarberos.json();
      const dataServicios = await resServicios.json();
      setBarberos(dataBarberos.barberos || []);
      setServicios(dataServicios.servicios || []);
    } catch {
      console.error("Error al cargar opciones");
    }
  };

  useEffect(() => {
    cargarTurnos(fechaSeleccionada);
    cargarOpciones();
  }, []);

  const cambiarFecha = (fecha: string) => {
    setFechaSeleccionada(fecha);
    cargarTurnos(fecha);
  };

  const abrirModal = () => {
    setForm({
      fecha: fechaSeleccionada,
      hora: "",
      barberoId: "",
      servicioId: "",
      clienteNombre: "",
      clienteEmail: "",
      clienteTelefono: "",
    });
    setError("");
    setModalAbierto(true);
  };

  const guardar = async () => {
    if (!form.fecha || !form.hora || !form.barberoId || !form.servicioId || !form.clienteNombre || !form.clienteEmail) {
      setError("Todos los campos son obligatorios");
      return;
    }
    setGuardando(true);
    setError("");
    try {
      const fechaCompleta = new Date(`${form.fecha}T${form.hora}:00`);
      const res = await fetch("/api/turnos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fecha: fechaCompleta.toISOString(),
          barberoId: form.barberoId,
          servicioId: form.servicioId,
          clienteNombre: form.clienteNombre,
          clienteEmail: form.clienteEmail,
          clienteTelefono: form.clienteTelefono || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Error al guardar");
        return;
      }
      setModalAbierto(false);
      cargarTurnos(fechaSeleccionada);
    } catch {
      setError("Error de conexion");
    } finally {
      setGuardando(false);
    }
  };

  const cambiarEstado = async (id: string, estado: string) => {
    try {
      await fetch(`/api/turnos/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estado }),
      });
      cargarTurnos(fechaSeleccionada);
    } catch {
      console.error("Error al cambiar estado");
    }
  };

  const cancelarTurno = async (id: string) => {
    if (!confirm("Seguro que queres cancelar este turno?")) return;
    try {
      await fetch(`/api/turnos/${id}`, { method: "DELETE" });
      cargarTurnos(fechaSeleccionada);
    } catch {
      console.error("Error al cancelar");
    }
  };

  // Generar dias del mes para el mini calendario
  const generarDias = () => {
    const hoy = new Date();
    const dias = [];
    for (let i = -3; i <= 10; i++) {
      const d = new Date();
      d.setDate(hoy.getDate() + i);
      dias.push(d);
    }
    return dias;
  };

  const formatFecha = (fecha: string) =>
    new Date(fecha).toLocaleTimeString("es-AR", {
      hour: "2-digit", minute: "2-digit",
    });

  const formatFechaLabel = (fecha: string) =>
    new Date(fecha).toLocaleDateString("es-AR", {
      weekday: "long", day: "numeric", month: "long",
    });

  return (
    <div className="dash-content">

      {/* Topbar */}
      <div className="dash-topbar">
        <div className="dash-topbar-title">Turnos</div>
        <button className="dash-topbar-btn" onClick={abrirModal}>
          <Plus size={14} style={{ display: "inline", marginRight: 4 }} />
          Nuevo turno
        </button>
      </div>

      {/* Mini calendario horizontal */}
      <div className="dash-panel" style={{ marginTop: "1.5rem" }}>
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
          <div className="dash-panel-title">
            {formatFechaLabel(fechaSeleccionada + "T12:00:00")}
          </div>
          <span className="dash-panel-action">{turnos.length} turnos</span>
        </div>

        {loading ? (
          <div style={{ padding: "2rem", textAlign: "center", color: "rgba(255,255,255,0.3)" }}>
            Cargando...
          </div>
        ) : turnos.length === 0 ? (
          <div style={{ padding: "2rem", textAlign: "center", color: "rgba(255,255,255,0.3)", fontSize: "0.9rem" }}>
            <Calendar size={32} color="rgba(255,255,255,0.1)" style={{ margin: "0 auto 0.8rem" }} />
            No hay turnos para este dia
          </div>
        ) : (
          turnos.map((t) => {
            const initials = t.clienteNombre.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
            return (
              <div key={t.id} className="dash-turno">
                <div className="dash-turno-time">{formatFecha(t.fecha)}</div>
                <div className="dash-turno-avatar" style={{ background: "rgba(201,168,76,0.15)", color: "var(--gold)" }}>
                  {initials}
                </div>
                <div className="dash-turno-info">
                  <div className="dash-turno-name">{t.clienteNombre}</div>
                  <div className="dash-turno-service">
                    {t.servicio.nombre} · {t.servicio.duracion} min · con {t.barbero.nombre}
                  </div>
                </div>
                <StatusBadge estado={t.estado} />

                {/* Acciones rapidas */}
                <div style={{ display: "flex", gap: "0.4rem", marginLeft: "0.5rem" }}>
                  {t.estado === "PENDIENTE" && (
                    <button
                      className="barbero-btn-outline"
                      onClick={() => cambiarEstado(t.id, "COMPLETADO")}
                      style={{ borderColor: "rgba(46,204,113,0.3)", color: "#2ECC71" }}
                    >
                      Completar
                    </button>
                  )}
                  {t.estado !== "CANCELADO" && t.estado !== "COMPLETADO" && (
                    <button
                      className="barbero-btn-outline"
                      onClick={() => cancelarTurno(t.id)}
                      style={{ color: "#E74C3C", borderColor: "rgba(231,76,60,0.3)" }}
                    >
                      <X size={12} />
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal nuevo turno */}
      {modalAbierto && (
        <div className="modal-overlay" onClick={() => setModalAbierto(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 480 }}>
            <div className="modal-title">Nuevo turno</div>

            {error && <div className="modal-error">{error}</div>}

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.8rem", marginBottom: "0.8rem" }}>
              <div className="auth-field">
                <label className="config-label">Fecha</label>
                <input
                  className="config-input"
                  type="date"
                  value={form.fecha}
                  onChange={(e) => setForm({ ...form, fecha: e.target.value })}
                />
              </div>
              <div className="auth-field">
                <label className="config-label">Hora</label>
                <input
                  className="config-input"
                  type="time"
                  value={form.hora}
                  onChange={(e) => setForm({ ...form, hora: e.target.value })}
                />
              </div>
            </div>

            <div className="auth-field" style={{ marginBottom: "0.8rem" }}>
              <label className="config-label">Barbero</label>
              <select
                className="config-input dash-select"
                value={form.barberoId}
                onChange={(e) => setForm({ ...form, barberoId: e.target.value })}
              >
                <option value="">— Selecciona un barbero —</option>
                {barberos.map((b) => (
                  <option key={b.id} value={b.id}>{b.nombre}</option>
                ))}
              </select>
            </div>

            <div className="auth-field" style={{ marginBottom: "0.8rem" }}>
              <label className="config-label">Servicio</label>
              <select
                className="config-input dash-select"
                value={form.servicioId}
                onChange={(e) => setForm({ ...form, servicioId: e.target.value })}
              >
                <option value="">— Selecciona un servicio —</option>
                {servicios.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.nombre} · {s.duracion} min
                  </option>
                ))}
              </select>
            </div>

            <div className="auth-field" style={{ marginBottom: "0.8rem" }}>
              <label className="config-label">Nombre del cliente</label>
              <input
                className="config-input"
                value={form.clienteNombre}
                onChange={(e) => setForm({ ...form, clienteNombre: e.target.value })}
                placeholder="Ej: Martin Garcia"
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.8rem", marginBottom: "1.5rem" }}>
              <div className="auth-field">
                <label className="config-label">Email</label>
                <input
                  className="config-input"
                  type="email"
                  value={form.clienteEmail}
                  onChange={(e) => setForm({ ...form, clienteEmail: e.target.value })}
                  placeholder="cliente@email.com"
                />
              </div>
              <div className="auth-field">
                <label className="config-label">Telefono (opcional)</label>
                <input
                  className="config-input"
                  value={form.clienteTelefono}
                  onChange={(e) => setForm({ ...form, clienteTelefono: e.target.value })}
                  placeholder="+54 11..."
                />
              </div>
            </div>

            <div className="auth-two-btns">
              <button
                className="barbero-btn-outline"
                onClick={() => setModalAbierto(false)}
                style={{ flex: 1 }}
              >
                Cancelar
              </button>
              <button
                className="dash-topbar-btn"
                onClick={guardar}
                disabled={guardando}
                style={{ flex: 1 }}
              >
                {guardando ? "Guardando..." : "Crear turno"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}