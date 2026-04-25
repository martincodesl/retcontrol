import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { MapPin, Phone, AtSign } from "lucide-react";
import Link from "next/link";

export default async function SitioPublicoPage({
  params,
}: {
  params: { subdominio: string };
}) {
  const barberia = await prisma.barberia.findUnique({
    where: { subdominio: params.subdominio },
    include: {
      barberos: { where: { activo: true } },
      servicios: { where: { activo: true } },
    },
  });

  if (!barberia) return notFound();

  return (
    <div className="sitio-wrapper">

      {/* NAV */}
      <nav className="sitio-nav">
        <div className="sitio-nav-logo">
          <em>{barberia.nombre}</em>
        </div>
        <div className="sitio-nav-links">
          <Link href="#servicios">Servicios</Link>
          <Link href="#equipo">Equipo</Link>
          <Link href="#ubicacion">Ubicacion</Link>
        </div>
        <Link href="#reserva" className="sitio-nav-cta">
          Reservar turno
        </Link>
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
            <Link href="#reserva" className="btn-primary">Reservar turno →</Link>
            <Link href="#servicios" className="btn-secondary">Ver servicios</Link>
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
                    <span className="sitio-servicio-precio">
                      ${s.precio.toLocaleString("es-AR")}
                    </span>
                    <span className="sitio-servicio-dur">{s.duracion} min</span>
                  </div>
                  <Link href="#reserva" className="sitio-servicio-btn">Reservar</Link>
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
                  <Link href="#reserva" className="sitio-barbero-btn">
                    Reservar con {b.nombre.split(" ")[0]} →
                  </Link>
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
                  "Confirmacion inmediata por email",
                  "Cancelacion sin costo hasta 2 horas antes",
                  "Recordatorio automatico el dia anterior",
                  "Disponible los 7 dias de la semana",
                ].map((f) => (
                  <div key={f} className="sitio-reserva-feat">
                    <span style={{ color: "var(--gold)", fontWeight: 700 }}>✓</span>
                    {f}
                  </div>
                ))}
              </div>
            </div>
            <div className="sitio-reserva-form">
              <div className="sitio-form-title">Elegis tu turno</div>
              <label className="config-label">Servicio</label>
              <select className="config-input dash-select" style={{ marginBottom: "1rem" }}>
                <option>— Selecciona un servicio —</option>
                {barberia.servicios.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.nombre} — ${s.precio.toLocaleString("es-AR")} · {s.duracion} min
                  </option>
                ))}
              </select>
              <label className="config-label">Barbero</label>
              <select className="config-input dash-select" style={{ marginBottom: "1rem" }}>
                <option>— Sin preferencia —</option>
                {barberia.barberos.map((b) => (
                  <option key={b.id} value={b.id}>{b.nombre}</option>
                ))}
              </select>
              <label className="config-label">Tu nombre</label>
              <input
                className="config-input"
                placeholder="Ej: Martin Garcia"
                style={{ marginBottom: "0.8rem" }}
              />
              <label className="config-label">Email</label>
              <input
                className="config-input"
                placeholder="Ej: martin@email.com"
                style={{ marginBottom: "1.2rem" }}
              />
              <button
                className="btn-primary"
                style={{ width: "100%", border: "none", cursor: "pointer", textAlign: "center" }}
              >
                Confirmar turno ✓
              </button>
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
              <div style={{ fontWeight: 600 }}>
                {barberia.direccion || "Direccion no configurada"}
              </div>
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
            <Link
              href={`/${params.subdominio}/barberos`}
              style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.25)", textDecoration: "none" }}
            >
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