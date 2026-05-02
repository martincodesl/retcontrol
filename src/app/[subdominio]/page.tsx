"use client";

import { useState, useEffect } from "react";
import { MapPin, Phone, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

interface Servicio {
  id: string;
  nombre: string;
  descripcion: string | null;
  precio: number;
  duracion: number;
  color: string;
}

interface Barbero {
  id: string;
  nombre: string;
  especialidad: string | null;
}

interface Barberia {
  id: string;
  nombre: string;
  descripcion: string | null;
  direccion: string | null;
  telefono: string | null;
  barberos: Barbero[];
  servicios: Servicio[];
}

interface Slot {
  hora: string;
  disponible: boolean;
}

const DIAS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
const MESES = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];

export default function SitioPublicoPage() {
  const params = useParams();
  const subdominio = params.subdominio as string;

  const [barberia, setBarberia]           = useState<Barberia | null>(null);
  const [loading, setLoading]             = useState(true);

  // Formulario
  const [step, setStep]                   = useState(1);
  const [servicioId, setServicioId]       = useState("");
  const [barberoId, setBarberoId]         = useState("");
  const [fecha, setFecha]                 = useState("");
  const [hora, setHora]                   = useState("");
  const [slots, setSlots]                 = useState<Slot[]>([]);
  const [loadingSlots, setLoadingSlots]   = useState(false);
  const [clienteNombre, setClienteNombre] = useState("");
  const [clienteEmail, setClienteEmail]   = useState("");
  const [clienteTel, setClienteTel]       = useState("");
  const [enviando, setEnviando]           = useState(false);
  const [error, setError]                 = useState("");
  const [exito, setExito]                 = useState(false);

  // Calendario
  const [mesVista, setMesVista]           = useState(new Date());

  useEffect(() => {
    const cargar = async () => {
      try {
        const res  = await fetch(`/api/publico/${subdominio}`);
        const data = await res.json();
        setBarberia(data.barberia);
      } catch {
        console.error("Error al cargar barberia");
      } finally {
        setLoading(false);
      }
    };
    cargar();
  }, [subdominio]);

  // Cargar slots cuando cambia barbero, fecha o servicio
  useEffect(() => {
    if (!barberoId || !fecha || !servicioId || !barberia) return;
    const servicio = barberia.servicios.find(s => s.id === servicioId);
    if (!servicio) return;
    setLoadingSlots(true);
    setHora("");
    fetch(`/api/publico/${subdominio}/disponibilidad?barberoId=${barberoId}&fecha=${fecha}&duracion=${servicio.duracion}`)
      .then(r => r.json())
      .then(data => setSlots(data.slots || []))
      .catch(() => setSlots([]))
      .finally(() => setLoadingSlots(false));
  }, [barberoId, fecha, servicioId]);

  const confirmar = async () => {
    if (!clienteNombre || !clienteEmail) {
      setError("Nombre y email son obligatorios");
      return;
    }
    setEnviando(true);
    setError("");
    try {
      const res = await fetch(`/api/publico/${subdominio}/turnos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fecha,
          hora,
          barberoId,
          servicioId,
          clienteNombre,
          clienteEmail,
          clienteTelefono: clienteTel || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Error al reservar");
        return;
      }
      setExito(true);
    } catch {
      setError("Error de conexion");
    } finally {
      setEnviando(false);
    }
  };

  // Generar días del calendario
  const generarDiasCalendario = () => {
    const año  = mesVista.getFullYear();
    const mes  = mesVista.getMonth();
    const primer = new Date(año, mes, 1).getDay();
    const diasMes = new Date(año, mes + 1, 0).getDate();
    const hoy  = new Date();
    hoy.setHours(0, 0, 0, 0);
    const dias = [];
    for (let i = 0; i < primer; i++) dias.push(null);
    for (let d = 1; d <= diasMes; d++) {
      const date = new Date(año, mes, d);
      dias.push({ d, iso: date.toISOString().split("T")[0], pasado: date < hoy });
    }
    return dias;
  };

  const servicio = barberia?.servicios.find(s => s.id === servicioId);
  const barbero  = barberia?.barberos.find(b => b.id === barberoId);

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "var(--dark)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ color: "rgba(255,255,255,0.4)" }}>Cargando...</div>
    </div>
  );

  if (!barberia) return (
    <div style={{ minHeight: "100vh", background: "var(--dark)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ color: "rgba(255,255,255,0.4)" }}>Barbería no encontrada</div>
    </div>
  );

  return (
    <div className="sitio-wrapper">

      {/* NAV */}
      <nav className="sitio-nav">
        <div className="sitio-nav-logo"><em>{barberia.nombre}</em></div>
        <div className="sitio-nav-links">
          <a href="#servicios">Servicios</a>
          <a href="#equipo">Equipo</a>
          <a href="#reserva">Reservar</a>
          <a href="#ubicacion">Ubicacion</a>
        </div>
        <a href="#reserva" className="sitio-nav-cta">Reservar turno</a>
      </nav>

      {/* HERO */}
      <section className="sitio-hero">
        <div className="sitio-hero-bg" />
        <div className="sitio-hero-deco">✂</div>
        <div className="sitio-hero-content">
          <div className="sitio-hero-tag">Barberia Premium</div>
          <h1 className="sitio-hero-title">
            El corte<br />que te<br /><em>define.</em>
          </h1>
          <p className="sitio-hero-desc">
            {barberia.descripcion || "Expertos en cortes modernos. Reserva tu turno online."}
          </p>
          <div className="sitio-hero-actions">
            <a href="#reserva" className="btn-primary">Reservar turno →</a>
            <a href="#servicios" className="btn-secondary">Ver servicios</a>
          </div>
        </div>
      </section>

      {/* SERVICIOS */}
      <section id="servicios" className="sitio-section">
        <div className="sitio-container">
          <div className="sitio-section-header">
            <span className="section-label">Lo que hacemos</span>
            <h2 className="sitio-section-title">Nuestros <em>servicios</em></h2>
          </div>
          {barberia.servicios.length === 0 ? (
            <p style={{ color: "rgba(255,255,255,0.4)" }}>Proximamente...</p>
          ) : (
            <div className="sitio-servicios-grid">
              {barberia.servicios.map((s) => (
                <div key={s.id} className="sitio-servicio-card">
                  <div className="sitio-servicio-dot" style={{ background: s.color }} />
                  <div className="sitio-servicio-name">{s.nombre}</div>
                  <div className="sitio-servicio-desc">{s.descripcion || ""}</div>
                  <div className="sitio-servicio-meta">
                    <span className="sitio-servicio-precio">${s.precio.toLocaleString("es-AR")}</span>
                    <span className="sitio-servicio-dur">{s.duracion} min</span>
                  </div>
                  <a
                    href="#reserva"
                    className="sitio-servicio-btn"
                    onClick={() => { setServicioId(s.id); setStep(1); }}
                  >
                    Reservar
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* EQUIPO */}
      <section id="equipo" className="sitio-section sitio-section-dark">
        <div className="sitio-container">
          <div className="sitio-section-header">
            <span className="section-label">Nuestro equipo</span>
            <h2 className="sitio-section-title">Conoce a los <em>maestros</em></h2>
          </div>
          {barberia.barberos.length === 0 ? (
            <p style={{ color: "rgba(255,255,255,0.4)" }}>Proximamente...</p>
          ) : (
            <div className="sitio-barberos-grid">
              {barberia.barberos.map((b) => (
                <div key={b.id} className="sitio-barbero-card">
                  <div className="sitio-barbero-avatar" style={{ background: "rgba(201,168,76,0.15)", color: "var(--gold)" }}>
                    {b.nombre.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="sitio-barbero-name">{b.nombre}</div>
                  <div className="sitio-barbero-spec">{b.especialidad || "Barbero"}</div>
                  
                    <a href="#reserva"
                    className="sitio-barbero-btn"
                    onClick={() => { setBarberoId(b.id); setStep(1); }}
                  >
                    Reservar con {b.nombre.split(" ")[0]} →
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* RESERVA */}
      <section id="reserva" className="sitio-section">
        <div className="sitio-container">
          <div className="sitio-reserva-grid">

            {/* Info */}
            <div className="sitio-reserva-info">
              <span className="section-label">Turno online</span>
              <h2 className="sitio-section-title">
                Reserva en<br /><em>menos de 2 minutos.</em>
              </h2>
              <p className="sitio-reserva-desc">
                Sin llamar, sin esperar. Elegis el servicio, el barbero,
                el dia y el horario — y listo.
              </p>
              <div className="sitio-reserva-features">
                {[
                  "Confirmacion inmediata",
                  "Cancelacion sin costo hasta 2 horas antes",
                  "Disponible los 7 dias de la semana",
                ].map((f) => (
                  <div key={f} className="sitio-reserva-feat">
                    <span style={{ color: "var(--gold)", fontWeight: 700 }}>✓</span>
                    {f}
                  </div>
                ))}
              </div>
            </div>

            {/* Formulario */}
            <div className="sitio-reserva-form">

              {exito ? (
                <div style={{ textAlign: "center", padding: "2rem 0" }}>
                  <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🎉</div>
                  <div style={{ fontFamily: "var(--font-playfair)", fontSize: "1.4rem", fontWeight: 700, marginBottom: "0.5rem" }}>
                    Turno confirmado
                  </div>
                  <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.9rem", marginBottom: "1.5rem" }}>
                    Te esperamos el {fecha} a las {hora} con {barbero?.nombre}
                  </div>
                  <button
                    className="btn-primary"
                    style={{ border: "none", cursor: "pointer" }}
                    onClick={() => {
                      setExito(false); setStep(1);
                      setServicioId(""); setBarberoId(""); setFecha(""); setHora("");
                      setClienteNombre(""); setClienteEmail(""); setClienteTel("");
                    }}
                  >
                    Reservar otro turno
                  </button>
                </div>
              ) : (
                <>
                  {/* Progress */}
                  <div style={{ display: "flex", gap: "0.4rem", marginBottom: "1.5rem" }}>
                    {[1,2,3].map(n => (
                      <div key={n} style={{
                        flex: 1, height: 3, borderRadius: 2,
                        background: step >= n ? "var(--gold)" : "rgba(255,255,255,0.1)",
                        transition: "background 0.3s",
                      }} />
                    ))}
                  </div>

                  {/* STEP 1 — Servicio y barbero */}
                  {step === 1 && (
                    <div>
                      <div className="sitio-form-title">1. Servicio y barbero</div>

                      <label className="config-label">Servicio</label>
                      <select
                        className="config-input dash-select"
                        value={servicioId}
                        onChange={e => setServicioId(e.target.value)}
                        style={{ marginBottom: "1rem" }}
                      >
                        <option value="">— Selecciona un servicio —</option>
                        {barberia.servicios.map(s => (
                          <option key={s.id} value={s.id}>
                            {s.nombre} — ${s.precio.toLocaleString("es-AR")} · {s.duracion} min
                          </option>
                        ))}
                      </select>

                      <label className="config-label">Barbero</label>
                      <select
                        className="config-input dash-select"
                        value={barberoId}
                        onChange={e => setBarberoId(e.target.value)}
                        style={{ marginBottom: "1.5rem" }}
                      >
                        <option value="">— Sin preferencia —</option>
                        {barberia.barberos.map(b => (
                          <option key={b.id} value={b.id}>{b.nombre}</option>
                        ))}
                      </select>

                      <button
                        className="btn-primary"
                        style={{ width: "100%", border: "none", cursor: "pointer" }}
                        onClick={() => {
                          if (!servicioId || !barberoId) {
                            setError("Selecciona un servicio y un barbero");
                            return;
                          }
                          setError("");
                          setStep(2);
                        }}
                      >
                        Siguiente →
                      </button>
                      {error && <div style={{ color: "#E74C3C", fontSize: "0.82rem", marginTop: "0.5rem" }}>{error}</div>}
                    </div>
                  )}

                  {/* STEP 2 — Fecha y hora */}
                  {step === 2 && (
                    <div>
                      <div className="sitio-form-title">2. Fecha y horario</div>

                      {/* Calendario */}
                      <div style={{ marginBottom: "1rem" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.8rem" }}>
                          <button
                            onClick={() => setMesVista(new Date(mesVista.getFullYear(), mesVista.getMonth() - 1))}
                            style={{ background: "none", border: "none", color: "var(--gold)", cursor: "pointer", fontSize: "1rem" }}
                          >
                            <ChevronLeft size={16} />
                          </button>
                          <span style={{ fontSize: "0.875rem", fontWeight: 600 }}>
                            {MESES[mesVista.getMonth()]} {mesVista.getFullYear()}
                          </span>
                          <button
                            onClick={() => setMesVista(new Date(mesVista.getFullYear(), mesVista.getMonth() + 1))}
                            style={{ background: "none", border: "none", color: "var(--gold)", cursor: "pointer", fontSize: "1rem" }}
                          >
                            <ChevronRight size={16} />
                          </button>
                        </div>

                        {/* Headers días */}
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 2, marginBottom: 4 }}>
                          {DIAS.map(d => (
                            <div key={d} style={{ textAlign: "center", fontSize: "0.65rem", color: "rgba(255,255,255,0.3)", padding: "0.3rem 0" }}>
                              {d}
                            </div>
                          ))}
                        </div>

                        {/* Días */}
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 2 }}>
                          {generarDiasCalendario().map((dia, i) => (
                            <div
                              key={i}
                              onClick={() => { if (dia && !dia.pasado) { setFecha(dia.iso); setHora(""); }}}
                              style={{
                                aspectRatio: "1",
                                borderRadius: 5,
                                display: "flex", alignItems: "center", justifyContent: "center",
                                fontSize: "0.75rem",
                                cursor: dia && !dia.pasado ? "pointer" : "default",
                                background: dia?.iso === fecha ? "var(--gold)" : "transparent",
                                color: !dia ? "transparent"
                                  : dia.pasado ? "rgba(255,255,255,0.15)"
                                  : dia.iso === fecha ? "var(--dark)"
                                  : "rgba(255,255,255,0.7)",
                                fontWeight: dia?.iso === fecha ? 700 : 400,
                                transition: "background 0.15s",
                              }}
                            >
                              {dia?.d || ""}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Slots de horario */}
                      {fecha && (
                        <>
                          <label className="config-label" style={{ marginBottom: "0.5rem", display: "block" }}>
                            Horarios disponibles — {barbero?.nombre || "cualquier barbero"}
                          </label>
                          {loadingSlots ? (
                            <div style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.85rem", padding: "1rem 0" }}>
                              Cargando horarios...
                            </div>
                          ) : slots.length === 0 ? (
                            <div style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.85rem", padding: "1rem 0" }}>
                              No hay horarios disponibles para este día
                            </div>
                          ) : (
                            <div className="sitio-slots" style={{ marginBottom: "1rem" }}>
                              {slots.map((s) => (
                                <div
                                  key={s.hora}
                                  onClick={() => s.disponible && setHora(s.hora)}
                                  className="sitio-slot"
                                  style={{
                                    background: hora === s.hora ? "var(--gold)" : s.disponible ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.02)",
                                    color: hora === s.hora ? "var(--dark)" : s.disponible ? "var(--white)" : "rgba(255,255,255,0.2)",
                                    borderColor: hora === s.hora ? "var(--gold)" : s.disponible ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.04)",
                                    cursor: s.disponible ? "pointer" : "not-allowed",
                                    textDecoration: !s.disponible ? "line-through" : "none",
                                    fontWeight: hora === s.hora ? 700 : 400,
                                  }}
                                >
                                  {s.hora}
                                </div>
                              ))}
                            </div>
                          )}
                        </>
                      )}

                      <div style={{ display: "flex", gap: "0.7rem" }}>
                        <button
                          onClick={() => setStep(1)}
                          style={{ flex: 0.4, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "var(--white)", padding: "0.9rem", borderRadius: 5, cursor: "pointer", fontFamily: "var(--font-dm-sans)" }}
                        >
                          ← Volver
                        </button>
                        <button
                          className="btn-primary"
                          style={{ flex: 1, border: "none", cursor: "pointer" }}
                          onClick={() => {
                            if (!fecha || !hora) { setError("Selecciona fecha y horario"); return; }
                            setError(""); setStep(3);
                          }}
                        >
                          Siguiente →
                        </button>
                      </div>
                      {error && <div style={{ color: "#E74C3C", fontSize: "0.82rem", marginTop: "0.5rem" }}>{error}</div>}
                    </div>
                  )}

                  {/* STEP 3 — Datos del cliente */}
                  {step === 3 && (
                    <div>
                      <div className="sitio-form-title">3. Tus datos</div>

                      {/* Resumen */}
                      <div style={{ background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.2)", borderRadius: 8, padding: "0.8rem 1rem", marginBottom: "1.2rem", fontSize: "0.82rem" }}>
                        <div style={{ marginBottom: "0.3rem" }}>
                          <span style={{ color: "rgba(255,255,255,0.4)" }}>Servicio: </span>
                          <span style={{ color: "var(--gold)", fontWeight: 600 }}>{servicio?.nombre}</span>
                        </div>
                        <div style={{ marginBottom: "0.3rem" }}>
                          <span style={{ color: "rgba(255,255,255,0.4)" }}>Barbero: </span>
                          <span>{barbero?.nombre}</span>
                        </div>
                        <div>
                          <span style={{ color: "rgba(255,255,255,0.4)" }}>Fecha y hora: </span>
                          <span>{fecha} a las {hora}</span>
                        </div>
                      </div>

                      <div className="auth-field" style={{ marginBottom: "0.8rem" }}>
                        <label className="config-label">Tu nombre</label>
                        <input
                          className="config-input"
                          value={clienteNombre}
                          onChange={e => setClienteNombre(e.target.value)}
                          placeholder="Ej: Martin Garcia"
                        />
                      </div>
                      <div className="auth-field" style={{ marginBottom: "0.8rem" }}>
                        <label className="config-label">Email</label>
                        <input
                          className="config-input"
                          type="email"
                          value={clienteEmail}
                          onChange={e => setClienteEmail(e.target.value)}
                          placeholder="Ej: martin@email.com"
                        />
                      </div>
                      <div className="auth-field" style={{ marginBottom: "1.2rem" }}>
                        <label className="config-label">Telefono (opcional)</label>
                        <input
                          className="config-input"
                          value={clienteTel}
                          onChange={e => setClienteTel(e.target.value)}
                          placeholder="+54 11..."
                        />
                      </div>

                      {error && <div style={{ color: "#E74C3C", fontSize: "0.82rem", marginBottom: "0.8rem" }}>{error}</div>}

                      <div style={{ display: "flex", gap: "0.7rem" }}>
                        <button
                          onClick={() => setStep(2)}
                          style={{ flex: 0.4, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "var(--white)", padding: "0.9rem", borderRadius: 5, cursor: "pointer", fontFamily: "var(--font-dm-sans)" }}
                        >
                          ← Volver
                        </button>
                        <button
                          className="btn-primary"
                          style={{ flex: 1, border: "none", cursor: enviando ? "not-allowed" : "pointer", opacity: enviando ? 0.7 : 1 }}
                          onClick={confirmar}
                          disabled={enviando}
                        >
                          {enviando ? "Confirmando..." : "Confirmar turno ✓"}
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* UBICACION */}
      <section id="ubicacion" className="sitio-section sitio-section-dark">
        <div className="sitio-container">
          <div className="sitio-section-header">
            <span className="section-label">Donde estamos</span>
            <h2 className="sitio-section-title">Veni a <em>visitarnos</em></h2>
          </div>
          <div className="sitio-ubicacion-grid">
            <div className="sitio-map-placeholder">
              <MapPin size={32} color="var(--gold)" />
              <div style={{ fontWeight: 600 }}>{barberia.direccion || "Direccion no configurada"}</div>
            </div>
            <div className="sitio-info-items">
              <div className="sitio-info-item">
                <MapPin size={18} color="var(--gold)" />
                <div>
                  <div className="sitio-info-label">Direccion</div>
                  <div className="sitio-info-val">{barberia.direccion || "No configurada"}</div>
                </div>
              </div>
              <div className="sitio-info-item">
                <Phone size={18} color="var(--gold)" />
                <div>
                  <div className="sitio-info-label">WhatsApp</div>
                  <div className="sitio-info-val">{barberia.telefono || "No configurado"}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="sitio-footer">
        <div className="sitio-footer-inner">
          <div className="sitio-footer-logo"><em>{barberia.nombre}</em></div>
          <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
            <Link href={`/${subdominio}/barberos`} style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.25)", textDecoration: "none" }}>
              Acceso barberos
            </Link>
            <div className="sitio-footer-power">
              Powered by <span style={{ color: "var(--gold)" }}>RETcontrol</span>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}