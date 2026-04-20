import { UserPlus, Globe, Settings, CalendarCheck } from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    num: "01",
    title: "Elegis tu plan",
    desc: "Seleccionas el plan que mejor se adapta al tamaño de tu barberia y completás el pago mensual.",
  },
  {
    icon: Globe,
    num: "02",
    title: "Se crea tu subdominio",
    desc: "Automaticamente se genera tunombre.retcontrol.app listo para que lo configures.",
  },
  {
    icon: Settings,
    num: "03",
    title: "Cargas tu barberia",
    desc: "Agregas tus servicios, tu equipo de barberos y configurás los horarios disponibles.",
  },
  {
    icon: CalendarCheck,
    num: "04",
    title: "Empezas a recibir turnos",
    desc: "Compartis tu link, tus clientes reservan online y vos gestionas todo desde el panel.",
  },
];

export default function HowItWorks() {
  return (
    <section id="como-funciona" className="how-section">
      <div className="features-container">

        <div className="features-header">
          <span className="section-label">Como funciona</span>
          <h2 className="section-title">
            En menos de <em>10 minutos</em> ya estas funcionando.
          </h2>
        </div>

        <div className="steps-grid">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={step.num} className="step-card">
                <div className="step-num">{step.num}</div>
                <div className="step-icon-wrap">
                  <Icon size={20} color="var(--gold)" />
                </div>
                <div className="step-title">{step.title}</div>
                <div className="step-desc">{step.desc}</div>
                {index < steps.length - 1 && (
                  <div className="step-connector" />
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}