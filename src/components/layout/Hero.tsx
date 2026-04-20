import Link from "next/link";

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-bg" />
      <div className="hero-grid" />

      <div className="hero-badge">
        <span className="hero-badge-dot" />
        La plataforma #1 para barberías modernas
      </div>

      <h1 className="hero-title">
        Tu barbería,<br />
        <em>profesionalizada.</em>
      </h1>

      <p className="hero-subtitle">
        Sitio web propio, gestión de turnos online y control total de tu equipo
        — todo desde un solo panel.
      </p>

      <div className="hero-actions">
        <Link href="#precios" className="btn-primary">
          Comenzar prueba gratis
        </Link>
        <Link href="#como-funciona" className="btn-secondary">
          Ver cómo funciona →
        </Link>
      </div>

      <div className="hero-stats">
        {[
          { num: "+500", label: "Barberías activas" },
          { num: "98%",  label: "Clientes satisfechos" },
          { num: "24/7", label: "Turnos online" },
        ].map((stat) => (
          <div key={stat.label} className="hero-stat">
            <div className="hero-stat-num">{stat.num}</div>
            <div className="hero-stat-label">{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}