export default function FinanzasPreview() {
  const gastos = [
    { label: "Sueldos",   monto: "$54.000", pct: 62, color: "#C9A84C" },
    { label: "Alquiler",  monto: "$18.000", pct: 21, color: "#3498DB" },
    { label: "Insumos",   monto: "$9.200",  pct: 11, color: "#2ECC71" },
    { label: "Servicios", monto: "$4.000",  pct: 5,  color: "#E67E22" },
    { label: "Otros",     monto: "$2.000",  pct: 2,  color: "#9B59B6" },
  ];

  return (
    <section className="finanzas-preview-section">
      <div className="features-container">
        <div className="finanzas-preview-grid">

          {/* Texto */}
          <div className="finanzas-preview-info">
            <span className="section-label">Control financiero total</span>
            <h2 className="section-title">
              Las finanzas de tu barberia,<br /><em>siempre bajo control.</em>
            </h2>
            <p className="preview-desc">
              Cada barbero tiene su propio panel de finanzas protegido con PIN.
              Ve sus ingresos por turnos, carga sus gastos de insumos y herramientas,
              y lleva un balance real de lo que gana.
            </p>
            <div className="finanzas-features">
              {[
                { titulo: "Finanzas del local",    desc: "Ingresos globales, gastos por categoria, ticket promedio y proyecciones." },
                { titulo: "Finanzas del barbero",  desc: "Cada barbero accede con su PIN y ve sus propios ingresos y gastos." },
                { titulo: "Microgastos",           desc: "Herramientas, productos, transporte y mas. Todo categorizado con graficos." },
                { titulo: "Filtros de periodo",    desc: "Este mes, mes anterior o cualquier rango personalizado de fechas." },
              ].map((f) => (
                <div key={f.titulo} className="finanzas-feature-item">
                  <div className="finanzas-feature-dot" />
                  <div>
                    <div className="finanzas-feature-titulo">{f.titulo}</div>
                    <div className="finanzas-feature-desc">{f.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mock finanzas */}
          <div className="finanzas-preview-mock">
            {/* KPIs */}
            <div className="fin-mock-kpis">
              <div className="fin-mock-kpi">
                <div className="fin-mock-kpi-label">Ingresos</div>
                <div className="fin-mock-kpi-val" style={{ color: "#2ECC71" }}>$284.500</div>
                <div className="fin-mock-kpi-sub">↑ +18% vs mes ant.</div>
              </div>
              <div className="fin-mock-kpi">
                <div className="fin-mock-kpi-label">Gastos</div>
                <div className="fin-mock-kpi-val" style={{ color: "#E74C3C" }}>$87.200</div>
                <div className="fin-mock-kpi-sub">↑ +5% vs mes ant.</div>
              </div>
              <div className="fin-mock-kpi">
                <div className="fin-mock-kpi-label">Ganancia</div>
                <div className="fin-mock-kpi-val" style={{ color: "#C9A84C" }}>$197.300</div>
                <div className="fin-mock-kpi-sub">↑ +24% vs mes ant.</div>
              </div>
            </div>

            {/* Gastos */}
            <div className="fin-mock-panel">
              <div className="fin-mock-panel-title">Distribucion de gastos</div>
              {gastos.map((g) => (
                <div key={g.label} className="fin-mock-gasto">
                  <div className="fin-mock-gasto-header">
                    <span style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.7)" }}>{g.label}</span>
                    <span style={{ fontSize: "0.78rem", color: g.color, fontWeight: 600 }}>{g.monto}</span>
                  </div>
                  <div className="fin-mock-bar-bg">
                    <div className="fin-mock-bar-fill" style={{ width: `${g.pct}%`, background: g.color }} />
                  </div>
                </div>
              ))}
            </div>

            {/* PIN barbero */}
            <div className="fin-mock-pin">
              <div className="fin-mock-pin-icon">🔐</div>
              <div>
                <div style={{ fontWeight: 600, fontSize: "0.85rem" }}>Panel del barbero con PIN</div>
                <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.4)" }}>
                  Cada barbero accede a sus propias finanzas con un PIN de 6 digitos
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}