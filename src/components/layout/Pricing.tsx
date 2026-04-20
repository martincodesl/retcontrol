import { Check, Minus } from "lucide-react";
import Link from "next/link";

const plans = [
  {
    name: "Starter",
    price: "15",
    featured: false,
    features: [
      { text: "Hasta 2 barberos", included: true },
      { text: "Subdominio propio", included: true },
      { text: "Turnos online ilimitados", included: true },
      { text: "Panel de administracion", included: true },
      { text: "Notificaciones por email", included: false },
      { text: "Soporte prioritario", included: false },
    ],
  },
  {
    name: "Pro",
    price: "25",
    featured: true,
    features: [
      { text: "Hasta 5 barberos", included: true },
      { text: "Subdominio propio", included: true },
      { text: "Turnos online ilimitados", included: true },
      { text: "Panel de administracion", included: true },
      { text: "Notificaciones por email", included: true },
      { text: "Soporte prioritario", included: false },
    ],
  },
  {
    name: "Premium",
    price: "40",
    featured: false,
    features: [
      { text: "Barberos ilimitados", included: true },
      { text: "Subdominio propio", included: true },
      { text: "Turnos online ilimitados", included: true },
      { text: "Panel de administracion", included: true },
      { text: "Notificaciones por email", included: true },
      { text: "Soporte prioritario", included: true },
    ],
  },
];

export default function Pricing() {
  return (
    <section id="precios" className="pricing-section">
      <div className="features-container">

        <div className="pricing-header">
          <span className="section-label">Precios</span>
          <h2 className="section-title">
            Simple, transparente, <em>sin sorpresas.</em>
          </h2>
          <p className="pricing-subtitle">
            30 dias gratis en cualquier plan. Sin tarjeta de credito requerida.
          </p>
        </div>

        <div className="pricing-grid">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`plan-card ${plan.featured ? "plan-card-featured" : ""}`}
            >
              {plan.featured && (
                <div className="plan-badge">MAS POPULAR</div>
              )}

              <div className="plan-name">{plan.name}</div>

              <div className="plan-price">
                <sup>$</sup>{plan.price}
              </div>
              <div className="plan-period">USD / mes</div>

              <div className="plan-divider" />

              <ul className="plan-features">
                {plan.features.map((f) => (
                  <li key={f.text} className={`plan-feature ${!f.included ? "plan-feature-off" : ""}`}>
                    {f.included
                      ? <Check size={14} color="var(--gold)" />
                      : <Minus size={14} color="rgba(255,255,255,0.2)" />
                    }
                    {f.text}
                  </li>
                ))}
              </ul>

              <Link
                href="#"
                className={plan.featured ? "plan-btn-gold" : "plan-btn-outline"}
              >
                Empezar gratis
              </Link>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}