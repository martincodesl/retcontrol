import { Globe, Calendar, Scissors, BookOpen, BarChart2, Bell } from "lucide-react";

const features = [
  {
    icon: Globe,
    title: "Sitio web propio",
    desc: "Subdominio personalizado con página de presentación, servicios y equipo. Sin saber programar.",
  },
  {
    icon: Calendar,
    title: "Turnos online 24/7",
    desc: "Tus clientes reservan cuando quieren, desde el celular. Vos recibís una notificación y gestionás todo desde el panel.",
  },
  {
    icon: Scissors,
    title: "Gestión de barberos",
    desc: "Cargá a cada miembro del equipo con foto, especialidad y horarios. Cada barbero tiene su propia agenda.",
  },
  {
    icon: BookOpen,
    title: "Catálogo de servicios",
    desc: "Armá tu menú de cortes y tratamientos con precios y duración. El cliente lo ve antes de reservar.",
  },
  {
    icon: BarChart2,
    title: "Dashboard de métricas",
    desc: "Visualizá en tiempo real cuántos turnos tenés y cómo evoluciona tu negocio semana a semana.",
  },
  {
    icon: Bell,
    title: "Notificaciones automáticas",
    desc: "Tu cliente recibe un email de confirmación al reservar y un recordatorio antes del turno.",
  },
];

export default function Features() {
  return (
    <section id="features" className="features-section">
      <div className="features-container">

        <div className="features-header">
          <span className="section-label">Funcionalidades</span>
          <h2 className="section-title">
            Todo lo que tu barbería necesita,{" "}
            <em>en un solo lugar.</em>
          </h2>
        </div>

        <div className="features-grid">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.title} className="feature-card">
                <div className="feature-icon">
                  <Icon size={22} color="var(--gold)" />
                </div>
                <div className="feature-title">{f.title}</div>
                <div className="feature-desc">{f.desc}</div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}