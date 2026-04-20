import Link from "next/link";

export default function Footer() {
  return (
    <>
      {/* CTA Final */}
      <section className="cta-section">
        <div className="features-container">
          <div className="cta-inner">
            <h2 className="cta-title">
              Listo para llevar tu barberia<br />
              al <em>proximo nivel?</em>
            </h2>
            <p className="cta-desc">
              Empezan gratis hoy. Sin tarjeta de credito. Sin complicaciones.
            </p>
            <Link href="#precios" className="btn-primary cta-btn">
              Crear mi cuenta gratis
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-logo">
            RET<span>control</span>
          </div>
          <div className="footer-links">
            <Link href="#features">Funciones</Link>
            <Link href="#como-funciona">Como funciona</Link>
            <Link href="#precios">Precios</Link>
          </div>
          <div className="footer-copy">
            © 2026 RETcontrol · Todos los derechos reservados
          </div>
        </div>
      </footer>
    </>
  );
}