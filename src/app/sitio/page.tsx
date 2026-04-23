import { MapPin, Clock, Phone, AtSign, Star } from "lucide-react";
import Link from "next/link";

const servicios = [
  { nombre: "Corte Clasico", desc: "Tijera y maquina, acabado prolijo.", precio: "$2.500", duracion: "30 min", color: "#3498DB" },
  { nombre: "Corte + Barba", desc: "Corte a eleccion mas diseno de barba completo.", precio: "$3.800", duracion: "45 min", color: "#C9A84C" },
  { nombre: "Degrade / Fade", desc: "Degradado a piel con acabado perfecto.", precio: "$3.200", duracion: "40 min", color: "#2ECC71" },
  { nombre: "Diseno de Barba", desc: "Perfilado y diseno con navaja.", precio: "$1.800", duracion: "25 min", color: "#9B59B6" },
  { nombre: "Color / Mechas", desc: "Coloracion completa o mechas a eleccion.", precio: "$6.500", duracion: "90 min", color: "#E74C3C" },
];

const barberos = [
  { initials: "RV", name: "Rodrigo Vega",    spec: "Fade & Beard Specialist", rating: "4.9", reviews: 182, color: "#3498DB" },
  { initials: "ML", name: "Marcos Lopez",    spec: "Corte Clasico",            rating: "4.7", reviews: 140, color: "#C9A84C" },
  { initials: "PG", name: "Pablo Gimenez",   spec: "Fade & Corte Moderno",    rating: "4.8", reviews: 165, color: "#2ECC71" },
  { initials: "DM", name: "Diego Martinez",  spec: "Diseno & Color",           rating: "4.6", reviews: 98,  color: "#9B59B6" },
];

const horarios = [
  { dia: "Lunes a Viernes", hours: "9:00 - 20:00" },
  { dia: "Sabados",         hours: "9:00 - 17:00" },
  { dia: "Domingos",        hours: "Cerrado" },
];

export default function SitioPage() {
  return (
    <div className="sitio-wrapper">

      {/* NAV */}
      <nav className="sitio-nav">
        <div className="sitio-nav-logo">
          <em>King's</em> Cuts
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
          <div className="sitio-hero-tag">Barberia Premium · Buenos Aires</div>
          <h1 className="sitio-hero-title">
            El corte<br />que te<br /><em>define.</em>
          </h1>
          <p className="sitio-hero-desc">
            Expertos en fade, diseno de barba y cortes modernos.
            Reserva tu turno online y llega listo para lucir diferente.
          </p>
          <div className="sitio-hero-actions">
            <Link href="#reserva" className="btn-primary">Reservar turno →</Link>
            <Link href="#servicios" className="btn-secondary">Ver servicios</Link>
          </div>
          <div className="sitio-hero-stats">
            <div className="sitio-stat"><div className="sitio-stat-val">8+</div><div className="sitio-stat-label">Anos de experiencia</div></div>
            <div className="sitio-stat"><div className="sitio-stat-val">4.9</div><div className="sitio-stat-label">Calificacion Google</div></div>
            <div className="sitio-stat"><div className="sitio-stat-val">+2k</div><div className="sitio-stat-label">Clientes satisfechos</div></div>
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
          <div className="sitio-servicios-grid">
            {servicios.map((s) => (
              <div key={s.nombre} className="sitio-servicio-card">
                <div className="sitio-servicio-dot" style={{ background: s.color }} />
                <div className="sitio-servicio-name">{s.nombre}</div>
                <div className="sitio-servicio-desc">{s.desc}</div>
                <div className="sitio-servicio-meta">
                  <span className="sitio-servicio-precio">{s.precio}</span>
                  <span className="sitio-servicio-dur">{s.duracion}</span>
                </div>
                <Link href="#reserva" className="sitio-servicio-btn">Reservar</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EQUIPO */}
      <section id="equipo" className="sitio-section sitio-section-dark">
        <div className="sitio-container">
          <div className="sitio-section-header">
            <span className="section-label">Nuestro equipo</span>
            <h2 className="sitio-section-title">Conoce a los <em>maestros</em></h2>
          </div>
          <div className="sitio-barberos-grid">
            {barberos.map((b) => (
              <div key={b.initials} className="sitio-barbero-card">
                <div className="sitio-barbero-avatar" style={{ background: `${b.color}22`, color: b.color }}>
                  {b.initials}
                </div>
                <div className="sitio-barbero-name">{b.name}</div>
                <div className="sitio-barbero-spec">{b.spec}</div>
                <div className="sitio-barbero-rating">
                  <Star size={13} color="var(--gold)" fill="var(--gold)" />
                  <span>{b.rating}</span>
                  <span style={{ color: "rgba(255,255,255,0.3)" }}>({b.reviews} resenas)</span>
                </div>
                <Link href="#reserva" className="sitio-barbero-btn">
                  Reservar con {b.name.split(" ")[0]} →
                </Link>
              </div>
            ))}
          </div>
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
                {servicios.map((s) => (
                  <option key={s.nombre}>{s.nombre} — {s.precio} · {s.duracion}</option>
                ))}
              </select>
              <label className="config-label">Barbero</label>
              <select className="config-input dash-select" style={{ marginBottom: "1rem" }}>
                <option>— Sin preferencia —</option>
                {barberos.map((b) => (
                  <option key={b.initials}>{b.name}</option>
                ))}
              </select>
              <label className="config-label">Fecha</label>
              <select className="config-input dash-select" style={{ marginBottom: "1rem" }}>
                <option>Hoy, miercoles 9 de julio</option>
                <option>Manana, jueves 10 de julio</option>
                <option>Viernes 11 de julio</option>
                <option>Sabado 12 de julio</option>
              </select>
              <label className="config-label">Tu nombre</label>
              <input className="config-input" placeholder="Ej: Martin Garcia" style={{ marginBottom: "0.8rem" }} />
              <label className="config-label">Email</label>
              <input className="config-input" placeholder="Ej: martin@email.com" style={{ marginBottom: "1.2rem" }} />
              <button className="btn-primary" style={{ width: "100%", border: "none", cursor: "pointer", textAlign: "center" }}>
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
              <div style={{ fontWeight: 600 }}>Av. Corrientes 1234, CABA</div>
              <div style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.4)" }}>Palermo · Buenos Aires</div>
            </div>
            <div className="sitio-info-items">
              {[
                { icon: MapPin,  label: "Direccion", val: "Av. Corrientes 1234, Palermo\nCiudad Autonoma de Buenos Aires" },
                { icon: Clock,   label: "Horarios",  val: horarios.map(h => `${h.dia}: ${h.hours}`).join("\n") },
                { icon: Phone,   label: "WhatsApp",  val: "+54 11 4567-8900" },
                { icon: AtSign,  label: "Instagram", val: "@kingscutsba" },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="sitio-info-item">
                    <Icon size={18} color="var(--gold)" style={{ flexShrink: 0, marginTop: 2 }} />
                    <div>
                      <div className="sitio-info-label">{item.label}</div>
                      <div className="sitio-info-val">{item.val}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="sitio-footer">
        <div className="sitio-footer-inner">
          <div className="sitio-footer-logo"><em>King's</em> Cuts</div>
          <div className="sitio-footer-power">
            Powered by <span style={{ color: "var(--gold)" }}>RETcontrol</span>
          </div>
        </div>
      </footer>

    </div>
  );
}