"use client";

import { useState, useEffect } from "react";
import { BookOpen, Plus, Pencil, Trash2 } from "lucide-react";

interface Servicio {
  id: string;
  nombre: string;
  descripcion: string | null;
  precio: number;
  duracion: number;
  color: string;
  activo: boolean;
}

const COLORES = [
  "#C9A84C", "#3498DB", "#2ECC71",
  "#9B59B6", "#E74C3C", "#E67E22",
];

export default function ServiciosPage() {
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [editando, setEditando] = useState<Servicio | null>(null);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    duracion: "",
    color: "#C9A84C",
  });

  const cargarServicios = async () => {
    try {
      const res = await fetch("/api/servicios");
      const data = await res.json();
      setServicios(data.servicios || []);
    } catch {
      console.error("Error al cargar servicios");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { cargarServicios(); }, []);

  const abrirModal = () => {
    setEditando(null);
    setForm({ nombre: "", descripcion: "", precio: "", duracion: "", color: "#C9A84C" });
    setError("");
    setModalAbierto(true);
  };

  const abrirEdicion = (s: Servicio) => {
    setEditando(s);
    setForm({
      nombre: s.nombre,
      descripcion: s.descripcion || "",
      precio: s.precio.toString(),
      duracion: s.duracion.toString(),
      color: s.color,
    });
    setError("");
    setModalAbierto(true);
  };

  const guardar = async () => {
    if (!form.nombre.trim() || !form.precio || !form.duracion) {
      setError("Nombre, precio y duracion son obligatorios");
      return;
    }
    setGuardando(true);
    setError("");
    try {
      const url = editando ? `/api/servicios/${editando.id}` : "/api/servicios";
      const method = editando ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: form.nombre,
          descripcion: form.descripcion || null,
          precio: Number(form.precio),
          duracion: Number(form.duracion),
          color: form.color,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Error al guardar");
        return;
      }
      setModalAbierto(false);
      cargarServicios();
    } catch {
      setError("Error de conexion");
    } finally {
      setGuardando(false);
    }
  };

  const eliminar = async (id: string) => {
    if (!confirm("Seguro que queres eliminar este servicio?")) return;
    try {
      await fetch(`/api/servicios/${id}`, { method: "DELETE" });
      cargarServicios();
    } catch {
      console.error("Error al eliminar");
    }
  };

  const toggleActivo = async (s: Servicio) => {
    try {
      await fetch(`/api/servicios/${s.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ activo: !s.activo }),
      });
      cargarServicios();
    } catch {
      console.error("Error al cambiar estado");
    }
  };

  // Formatear precio
  const formatPrecio = (precio: number) =>
    `$${precio.toLocaleString("es-AR")}`;

  return (
    <div className="dash-content">

      {/* Topbar */}
      <div className="dash-topbar">
        <div className="dash-topbar-title">Servicios</div>
        <button className="dash-topbar-btn" onClick={abrirModal}>
          <Plus size={14} style={{ display: "inline", marginRight: 4 }} />
          Nuevo servicio
        </button>
      </div>

      {/* Tabla */}
      {loading ? (
        <div style={{ padding: "3rem", textAlign: "center", color: "rgba(255,255,255,0.3)" }}>
          Cargando...
        </div>
      ) : servicios.length === 0 ? (
        <div className="dash-panel" style={{ marginTop: "1.5rem", textAlign: "center", padding: "3rem" }}>
          <BookOpen size={40} color="rgba(255,255,255,0.1)" style={{ margin: "0 auto 1rem" }} />
          <div style={{ fontWeight: 600, marginBottom: "0.5rem" }}>No hay servicios cargados</div>
          <div style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.4)", marginBottom: "1.5rem" }}>
            Agrega tus servicios para que los clientes puedan reservar
          </div>
          <button className="dash-topbar-btn" onClick={abrirModal}>+ Agregar servicio</button>
        </div>
      ) : (
        <div className="dash-panel" style={{ marginTop: "1.5rem" }}>
          <div className="dash-panel-header">
            <div className="dash-panel-title">Servicios activos</div>
            <span className="dash-panel-action">{servicios.length} en total</span>
          </div>
          <div className="svc-table-wrap">
            <table className="svc-table">
              <thead>
                <tr>
                  <th>Servicio</th>
                  <th>Descripcion</th>
                  <th>Duracion</th>
                  <th>Precio</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {servicios.map((s) => (
                  <tr key={s.id}>
                    <td>
                      <div className="svc-nombre">
                        <span className="svc-dot" style={{ background: s.color }} />
                        {s.nombre}
                      </div>
                    </td>
                    <td className="svc-desc-cell">
                      {s.descripcion || "—"}
                    </td>
                    <td>{s.duracion} min</td>
                    <td className="svc-precio">{formatPrecio(s.precio)}</td>
                    <td>
                      <span className={`dash-badge ${s.activo ? "badge-done" : "badge-cancel"}`}>
                        {s.activo ? "Activo" : "Pausado"}
                      </span>
                    </td>
                    <td>
                      <div className="svc-actions">
                        <button className="barbero-btn-outline" onClick={() => abrirEdicion(s)}>
                          <Pencil size={11} style={{ display: "inline", marginRight: 3 }} />
                          Editar
                        </button>
                        <button className="barbero-btn-outline" onClick={() => toggleActivo(s)}>
                          {s.activo ? "Pausar" : "Activar"}
                        </button>
                        <button
                          className="barbero-btn-outline"
                          onClick={() => eliminar(s.id)}
                          style={{ borderColor: "rgba(231,76,60,0.3)", color: "#E74C3C" }}
                        >
                          <Trash2 size={11} style={{ display: "inline", marginRight: 3 }} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      {modalAbierto && (
        <div className="modal-overlay" onClick={() => setModalAbierto(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-title">
              {editando ? "Editar servicio" : "Nuevo servicio"}
            </div>

            {error && <div className="modal-error">{error}</div>}

            <div className="auth-field" style={{ marginBottom: "0.8rem" }}>
              <label className="config-label">Nombre del servicio</label>
              <input
                className="config-input"
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                placeholder="Ej: Corte + Barba"
              />
            </div>

            <div className="auth-field" style={{ marginBottom: "0.8rem" }}>
              <label className="config-label">Descripcion (opcional)</label>
              <input
                className="config-input"
                value={form.descripcion}
                onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                placeholder="Ej: Corte a eleccion mas diseno de barba"
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.8rem", marginBottom: "0.8rem" }}>
              <div className="auth-field">
                <label className="config-label">Precio ($)</label>
                <input
                  className="config-input"
                  type="number"
                  value={form.precio}
                  onChange={(e) => setForm({ ...form, precio: e.target.value })}
                  placeholder="Ej: 3800"
                />
              </div>
              <div className="auth-field">
                <label className="config-label">Duracion (min)</label>
                <input
                  className="config-input"
                  type="number"
                  value={form.duracion}
                  onChange={(e) => setForm({ ...form, duracion: e.target.value })}
                  placeholder="Ej: 45"
                />
              </div>
            </div>

            <div className="auth-field" style={{ marginBottom: "1.5rem" }}>
              <label className="config-label">Color identificador</label>
              <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.3rem" }}>
                {COLORES.map((c) => (
                  <div
                    key={c}
                    onClick={() => setForm({ ...form, color: c })}
                    style={{
                      width: 28, height: 28, borderRadius: "50%",
                      background: c, cursor: "pointer",
                      border: form.color === c ? "2px solid white" : "2px solid transparent",
                      transition: "border 0.15s",
                    }}
                  />
                ))}
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
                {guardando ? "Guardando..." : editando ? "Guardar cambios" : "Crear servicio"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}