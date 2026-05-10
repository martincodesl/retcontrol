export default function DashboardPreview() {
  return (
    <section className="preview-section">
      <div className="features-container">
        <div className="preview-header">
          <span className="section-label">El panel de control</span>
          <h2 className="section-title">
            Todo tu negocio,<br /><em>en una sola pantalla.</em>
          </h2>
          <p className="preview-desc">
            Desde el dashboard principal vas a ver en tiempo real cuantos turnos tenes hoy,
            quienes son tus barberos mas productivos y como crece tu negocio semana a semana.
          </p>
        </div>

        {/* Mock dashboard */}
        <div className="preview-window">
          <div className="preview-bar">
            <div className="preview-dots">
              <span className="dot-r" /><span className="dot-y" /><span className="dot-g" />
            </div>
            <div className="preview-url">retcontrol.app/dashboard</div>
          </div>
          <div className="preview-body">

            {/* Sidebar mini */}
            <div className="preview-sidebar">
              <div className="preview-logo">RET<span>control</span></div>
              {["Dashboard","Turnos","Barberos","Servicios","Finanzas","Configuracion"].map((item, i) => (
                <div key={item} className={`preview-nav-item ${i === 0 ? "active" : ""}`}>
                  <div className="preview-nav-dot" />
                  {item}
                </div>
              ))}
            </div>

            {/* Content */}
            <div className="preview-content">
              {/* KPIs */}
              <div className="preview-kpis">
                {[
                  { label: "Turnos hoy",     value: "12", sub: "3 pendientes",    color: "#2ECC71" },
                  { label: "Esta semana",    value: "58", sub: "+12% vs ant.",     color: "#C9A84C" },
                  { label: "Barberos",       value: "4",  sub: "todos activos",   color: "#3498DB" },
                  { label: "Cancelaciones",  value: "2",  sub: "esta semana",     color: "#E74C3C" },
                ].map((k) => (
                  <div key={k.label} className="preview-kpi">
                    <div className="preview-kpi-label">{k.label}</div>
                    <div className="preview-kpi-val" style={{ color: k.color }}>{k.value}</div>
                    <div className="preview-kpi-sub">{k.sub}</div>
                  </div>
                ))}
              </div>

              {/* Turnos + Equipo */}
              <div className="preview-two-col">
                <div className="preview-panel">
                  <div className="preview-panel-title">Turnos de hoy</div>
                  {[
                    { hora: "09:00", nombre: "Lucas M.", servicio: "Corte + Barba", estado: "done" },
                    { hora: "11:00", nombre: "Agustin G.", servicio: "Degrade", estado: "active" },
                    { hora: "12:00", nombre: "Javier R.", servicio: "Corte + Barba", estado: "pending" },
                    { hora: "14:00", nombre: "Matias T.", servicio: "Clasico", estado: "cancel" },
                  ].map((t) => (
                    <div key={t.hora} className="preview-turno">
                      <span className="preview-turno-hora">{t.hora}</span>
                      <span className="preview-turno-nombre">{t.nombre}</span>
                      <span className="preview-turno-servicio">{t.servicio}</span>
                      <span className={`preview-badge preview-badge-${t.estado}`}>
                        {t.estado === "done" ? "Listo" : t.estado === "active" ? "En curso" : t.estado === "pending" ? "Proximo" : "Cancelado"}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="preview-panel">
                  <div className="preview-panel-title">Equipo</div>
                  {[
                    { ini: "RV", nombre: "Rodrigo V.", turns: 4, color: "#3498DB" },
                    { ini: "ML", nombre: "Marcos L.",  turns: 3, color: "#C9A84C" },
                    { ini: "PG", nombre: "Pablo G.",   turns: 3, color: "#2ECC71" },
                    { ini: "DM", nombre: "Diego M.",   turns: 2, color: "#9B59B6" },
                  ].map((b) => (
                    <div key={b.ini} className="preview-barbero">
                      <div className="preview-barbero-av" style={{ background: `${b.color}22`, color: b.color }}>{b.ini}</div>
                      <span className="preview-barbero-nombre">{b.nombre}</span>
                      <span className="preview-barbero-turns">{b.turns} turnos</span>
                    </div>
                  ))}
                  {/* Mini chart */}
                  <div className="preview-chart">
                    {[55,80,65,90,100,75,40].map((h, i) => (
                      <div key={i} className="preview-bar-wrap">
                        <div className="preview-bar" style={{ height: `${h}%`, background: i === 4 ? "var(--gold)" : "rgba(201,168,76,0.2)" }} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bullets debajo */}
        <div className="preview-bullets">
          {[
            { icon: "📅", text: "Gestion de turnos con calendario interactivo" },
            { icon: "✂️", text: "Control de barberos, horarios y especialidades" },
            { icon: "💈", text: "Catalogo de servicios con precios y duracion" },
            { icon: "🔔", text: "Notificaciones automaticas por email al cliente" },
          ].map((b) => (
            <div key={b.text} className="preview-bullet">
              <span className="preview-bullet-icon">{b.icon}</span>
              <span>{b.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}