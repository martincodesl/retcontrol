"use client";

import { useState, useEffect } from "react";
import { Scissors, Plus, Pencil, Trash2, Eye, EyeOff } from "lucide-react";

interface Barbero {
  id: string;
  nombre: string;
  usuario: string;
  especialidad: string | null;
  activo: boolean;
}

export default function BarberosPage() {
  const [barberos, setBarberos] = useState<Barbero[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [editando, setEditando] = useState<Barbero | null>(null);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [form, setForm] = useState({
    nombre: "",
    usuario: "",
    pin: "",
    especialidad: "",
  });

  const cargarBarberos = async () => {
    try {
      const res = await fetch("/api/barberos");
      const data = await res.json();
      setBarberos(data.barberos || []);
    } catch {
      console.error("Error al cargar barberos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { cargarBarberos(); }, []);

  const abrirModal = () => {
    setEditando(null);
    setForm({ nombre: "", usuario: "", pin: "", especialidad: "" });
    setError("");
    setShowPin(false);
    setModalAbierto(true);
  };

  const abrirEdicion = (b: Barbero) => {
    setEditando(b);
    setForm({ nombre: b.nombre, usuario: b.usuario, pin: "", especialidad: b.especialidad || "" });
    setError("");
    setShowPin(false);
    setModalAbierto(true);
  };

  const guardar = async () => {
    if (!form.nombre.trim() || !form.usuario.trim()) {
      setError("Nombre y usuario son obligatorios");
      return;
    }
    if (!editando && !form.pin) {
      setError("El PIN es obligatorio al crear un barbero");
      return;
    }
    if (form.pin && (form.pin.length !== 6 || !/^\d+$/.test(form.pin))) {
      setError("El PIN debe tener exactamente 6 digitos numericos");
      return;
    }

    setGuardando(true);
    setError("");

    try {
      const url    = editando ? `/api/barberos/${editando.id}` : "/api/barberos";
      const method = editando ? "PATCH" : "POST";
      const body: any = {
        nombre:      form.nombre,
        usuario:     form.usuario,
        especialidad: form.especialidad || null,
      };
      if (form.pin) body.pin = form.pin;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Error al guardar");
        return;
      }
      setModalAbierto(false);
      cargarBarberos();
    } catch {
      setError("Error de conexion");
    } finally {
      setGuardando(false);
    }
  };

  const eliminar = async (id: string) => {
    if (!confirm("Seguro que queres eliminar este barbero?")) return;
    await fetch(`/api/barberos/${id}`, { method: "DELETE" });
    cargarBarberos();
  };

  const toggleActivo = async (b: Barbero) => {
    await fetch(`/api/barberos/${b.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ activo: !b.activo }),
    });
    cargarBarberos();
  };

  return (
    <div className="dash-content">

      <div className="dash-topbar">
        <div className="dash-topbar-title">Barberos</div>
        <button className="dash-topbar-btn" onClick={abrirModal}>
          <Plus size={14} style={{ display: "inline", marginRight: 4 }} />
          Nuevo barbero
        </button>
      </div>

      {loading ? (
        <div style={{ padding: "3rem", textAlign: "center", color: "rgba(255,255,255,0.3)" }}>
          Cargando...
        </div>
      ) : barberos.length === 0 ? (
        <div className="dash-panel" style={{ marginTop: "1.5rem", textAlign: "center", padding: "3rem" }}>
          <Scissors size={40} color="rgba(255,255,255,0.1)" style={{ margin: "0 auto 1rem" }} />
          <div style={{ fontWeight: 600, marginBottom: "0.5rem" }}>No hay barberos cargados</div>
          <div style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.4)", marginBottom: "1.5rem" }}>
            Agrega tu primer barbero para empezar a gestionar turnos
          </div>
          <button className="dash-topbar-btn" onClick={abrirModal}>+ Agregar barbero</button>
        </div>
      ) : (
        <div className="barberos-page-grid">
          {barberos.map((b) => (
            <div key={b.id} className="barbero-page-card">
              <div className="barbero-card-header">
                <div className="barbero-card-avatar" style={{ background: "rgba(201,168,76,0.15)", color: "var(--gold)" }}>
                  {b.nombre.slice(0, 2).toUpperCase()}
                </div>
                <div className="barbero-card-status">
                  <div className={`barbero-status-dot ${b.activo ? "dot-online" : "dot-offline"}`} />
                  <span className="barbero-status-label">{b.activo ? "Activo" : "Inactivo"}</span>
                </div>
              </div>
              <div className="barbero-card-name">{b.nombre}</div>
              <div className="barbero-card-spec">{b.especialidad || "Sin especialidad"}</div>
              <div style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.3)", marginBottom: "1rem", fontFamily: "monospace" }}>
                @{b.usuario}
              </div>
              <div className="barbero-card-actions">
                <button className="barbero-btn-outline" onClick={() => abrirEdicion(b)}>
                  <Pencil size={12} style={{ display: "inline", marginRight: 4 }} />
                  Editar
                </button>
                <button className="barbero-btn-outline" onClick={() => toggleActivo(b)}>
                  {b.activo ? "Pausar" : "Activar"}
                </button>
                <button
                  className="barbero-btn-outline"
                  onClick={() => eliminar(b.id)}
                  style={{ borderColor: "rgba(231,76,60,0.3)", color: "#E74C3C" }}
                >
                  <Trash2 size={12} style={{ display: "inline", marginRight: 4 }} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modalAbierto && (
        <div className="modal-overlay" onClick={() => setModalAbierto(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-title">
              {editando ? "Editar barbero" : "Nuevo barbero"}
            </div>
            {error && <div className="modal-error">{error}</div>}

            <div className="auth-field" style={{ marginBottom: "0.8rem" }}>
              <label className="config-label">Nombre completo</label>
              <input
                className="config-input"
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                placeholder="Ej: Rodrigo Vega"
              />
            </div>

            <div className="auth-field" style={{ marginBottom: "0.8rem" }}>
              <label className="config-label">Nombre de usuario</label>
              <input
                className="config-input"
                value={form.usuario}
                onChange={(e) => setForm({ ...form, usuario: e.target.value })}
                placeholder="Ej: rodrigo"
              />
            </div>

            <div className="auth-field" style={{ marginBottom: "0.8rem" }}>
              <label className="config-label">
                {editando ? "Nuevo PIN (dejar vacio para no cambiar)" : "PIN de 6 digitos"}
              </label>
              <div className="auth-pass-wrap">
                <input
                  className="config-input"
                  type={showPin ? "text" : "password"}
                  maxLength={6}
                  value={form.pin}
                  onChange={(e) => setForm({ ...form, pin: e.target.value.replace(/\D/g, "") })}
                  placeholder="······"
                  style={{ letterSpacing: "0.3em", textAlign: "center" }}
                />
                <button
                  className="auth-pass-toggle"
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                >
                  {showPin ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            <div className="auth-field" style={{ marginBottom: "1.5rem" }}>
              <label className="config-label">Especialidad</label>
              <input
                className="config-input"
                value={form.especialidad}
                onChange={(e) => setForm({ ...form, especialidad: e.target.value })}
                placeholder="Ej: Fade & Beard Specialist"
              />
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
                {guardando ? "Guardando..." : editando ? "Guardar cambios" : "Crear barbero"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}