const testimonials = [
  {
    texto: "Antes perdia turnos porque la gente llamaba y no atendía. Ahora todo se reserva solo y yo me enfoco en cortar.",
    nombre: "Marcos Rodriguez",
    lugar: "Barbería El Rincon — Palermo",
    ini: "MR",
    stars: 5,
  },
  {
    texto: "El sistema es simple. En media hora ya tenia mi barberia online. Mis clientes lo usan todo el tiempo.",
    nombre: "Carlos Lopez",
    lugar: "Classic Cuts — Villa Urquiza",
    ini: "CL",
    stars: 5,
  },
  {
    texto: "Tengo 4 barberos y organizar los turnos era un caos. Ahora cada uno tiene su calendario y sus finanzas.",
    nombre: "Agustin Garcia",
    lugar: "King's Barber — San Telmo",
    ini: "AG",
    stars: 5,
  },
];

export default function TestimonialsSection() {
  return (
    <section className="testimonials-section-wrap">
      <div className="features-container">
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <span className="section-label">Testimonios</span>
          <h2 className="section-title" style={{ maxWidth: "100%", margin: "0 auto" }}>
            Lo que dicen las barberias que <em>ya nos eligieron.</em>
          </h2>
        </div>
        <div className="testimonials-grid-wrap">
          {testimonials.map((t) => (
            <div key={t.nombre} className="testimonial-card-wrap">
              <div className="testimonial-stars-wrap">{"★".repeat(t.stars)}</div>
              <p className="testimonial-text-wrap">{t.texto}</p>
              <div className="testimonial-author-wrap">
                <div className="testimonial-avatar-wrap">{t.ini}</div>
                <div>
                  <div className="testimonial-nombre-wrap">{t.nombre}</div>
                  <div className="testimonial-lugar-wrap">{t.lugar}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats row */}
        <div className="stats-row">
          {[
            { num: "+500",  label: "Barberias activas" },
            { num: "98%",   label: "Clientes satisfechos" },
            { num: "24/7",  label: "Turnos online" },
            { num: "$0",    label: "Comision por turno" },
          ].map((s) => (
            <div key={s.label} className="stats-item">
              <div className="stats-num">{s.num}</div>
              <div className="stats-label">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}