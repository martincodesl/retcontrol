"use client";

import { useState, useEffect } from "react";
import { Globe, Bell, Calendar, CreditCard, Shield, Save, Palette, Image } from "lucide-react";

interface Barberia {
  nombre: string;
  slogan: string;
  descripcion: string;
  direccion: string;
  telefono: string;
  subdominio: string;
  plan: string;
  colorPrimario: string;
  colorSecundario: string;
  colorFondo: string;
  colorTexto: string;
  logoUrl: string;
  heroFotoUrl: string;
  heroTitulo: string;
  heroDescripcion: string;
}

const PALETAS = [
  { nombre: "Dorado clásico",  primario: "#C9A84C", secundario: "#1C1C1E", fondo: "#0D0D0D", texto: "#FFFFFF" },
  { nombre: "Azul profundo",   primario: "#3498DB", secundario: "#1A2A3A", fondo: "#0A1520", texto: "#FFFFFF" },
  { nombre: "Verde esmeralda", primario: "#2ECC71", secundario: "#1A2A1A", fondo: "#0A150A", texto: "#FFFFFF" },
  { nombre: "Rojo elegante",   primario: "#E74C3C", secundario: "#2A1A1A", fondo: "#150A0A", texto: "#FFFFFF" },
  { nombre: "Violeta moderno", primario: "#9B59B6", secundario: "#1A1A2A", fondo: "#0A0A15", texto: "#FFFFFF" },
  { nombre: "Naranja vibrante",primario: "#E67E22", secundario: "#2A1A0A", fondo: "#150A00", texto: "#FFFFFF" },
  { nombre: "Rosa premium",    primario: "#E91E8C", secundario: "#2A0A1A", fondo: "#150010", texto: "#FFFFFF" },
  { nombre: "Blanco minimalista", primario: "#FFFFFF", secundario: "#F0F0F0", fondo: "#FAFAFA", texto: "#0D0D0D" },
];

export default function ConfiguracionPage() {
  const [barberia, setBarberia]       = useState<Barberia | null>(null);
  const [loading, setLoading]         = useState(true);
  const [guardando, setGuardando]     = useState(false);
  const [guardado, setGuardado]       = useState(false);
  const [recordatorios, setRecordatorios] = useState(true);
  const [confirmManual, setConfirmManual] = useState(false);
  const [turnosOnline, setTurnosOnline]   = useState(true);
  const [tabActiva, setTabActiva]     = useState<"sitio" | "diseno" | "hero" | "notif" | "plan">("sitio");

  const [form, setForm] = useState({
    nombre: "", slogan: "", descripcion: "", direccion: "", telefono: "",
    colorPrimario: "#C9A84C", colorSecundario: "#1C1C1E",
    colorFondo: "#0D0D0D", colorTexto: "#FFFFFF",
    logoUrl: "", heroFotoUrl: "", heroTitulo: "", heroDescripcion: "",
  });

  useEffect(() => {
    const cargar = async () => {
      try {
        const res  = await fetch("/api/barberia/perfil");
        const data = await res.json();
        if (data.barberia) {
          setBarberia(data.barberia);
          setForm({
            nombre:          data.barberia.nombre          || "",
            slogan:          data.barberia.slogan          || "",
            descripcion:     data.barberia.descripcion     || "",
            direccion:       data.barberia.direccion       || "",
            telefono:        data.barberia.telefono        || "",
            colorPrimario:   data.barberia.colorPrimario   || "#C9A84C",
            colorSecundario: data.barberia.colorSecundario || "#1C1C1E",
            colorFondo:      data.barberia.colorFondo      || "#0D0D0D",
            colorTexto:      data.barberia.colorTexto      || "#FFFFFF",
            logoUrl:         data.barberia.logoUrl         || "",
            heroFotoUrl:     data.barberia.heroFotoUrl     || "",
            heroTitulo:      data.barberia.heroTitulo      || "",
            heroDescripcion: data.barberia.heroDescripcion || "",
          });
        }
      } catch {
        console.error("Error al cargar barberia");
      } finally {
        setLoading(false);
      }
    };
    cargar();
  }, []);

  const guardar = async () => {
    setGuardando(true);
    try {
      const res = await fetch("/api/barberia/perfil", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setGuardado(true);
        setTimeout(() => setGuardado(false), 3000);
      }
    } catch {
      console.error("Error al guardar");
    } finally {
      setGuardando(false);
    }
  };

  const aplicarPaleta = (paleta: typeof PALETAS[0]) => {
    setForm(f => ({
      ...f,
      colorPrimario:   paleta.primario,
      colorSecundario: paleta.secundario,
      colorFondo:      paleta.fondo,
      colorTexto:      paleta.texto,
    }));
  };

  if (loading) return (
    <div className="dash-content">
      <div style={{ padding: "3rem", textAlign: "center", color: "rgba(255,255,255,0.3)" }}>Cargando...</div>
    </div>
  );

  const tabs = [
    { id: "sitio",  label: "Mi Sitio",    icon: Globe    },
    { id: "diseno", label: "Diseño",      icon: Palette  },
    { id: "hero",   label: "Hero",        icon: Image    },
    { id: "notif",  label: "Notificaciones", icon: Bell  },
    { id: "plan",   label: "Suscripcion", icon: CreditCard },
  ];

  return (
    <div className="dash-content">

      <div className="dash-topbar">
        <div className="dash-topbar-title">Configuracion</div>
        <button className="dash-topbar-btn" onClick={guardar} disabled={guardando}>
          <Save size={14} style={{ display: "inline", marginRight: 4 }} />
          {guardando ? "Guardando..." : guardado ? "Guardado ✓" : "Guardar cambios"}
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "0.3rem", marginTop: "1.5rem", marginBottom: "1.5rem", borderBottom: "1px solid rgba(255,255,255,0.07)", paddingBottom: "0" }}>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setTabActiva(tab.id as any)}
              style={{
                background: "none", border: "none", cursor: "pointer",
                padding: "0.6rem 1rem",
                color: tabActiva === tab.id ? "var(--gold)" : "rgba(255,255,255,0.4)",
                borderBottom: tabActiva === tab.id ? "2px solid var(--gold)" : "2px solid transparent",
                fontFamily: "var(--font-dm-sans)", fontSize: "0.85rem", fontWeight: 500,
                display: "flex", alignItems: "center", gap: "0.4rem",
                transition: "all 0.15s", marginBottom: "-1px",
              }}
            >
              <Icon size={14} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB: Mi Sitio */}
      {tabActiva === "sitio" && (
        <div className="dash-panel">
          <div className="config-section-title">
            <Globe size={16} color="var(--gold)" />
            Informacion del sitio
          </div>

          <div style={{ background: "rgba(46,204,113,0.08)", border: "1px solid rgba(46,204,113,0.2)", borderRadius: 8, padding: "0.9rem 1rem", display: "flex", alignItems: "center", gap: "0.8rem", marginBottom: "1.2rem" }}>
            <div style={{ fontSize: "1.2rem" }}>✅</div>
            <div>
              <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>Tu sitio esta online</div>
              <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.4)", fontFamily: "monospace" }}>
                {barberia?.subdominio}.retcontrol.app
              </div>
            </div>
          </div>

          <div className="config-fields">
            <div className="config-field">
              <label className="config-label">Nombre del negocio</label>
              <input className="config-input" value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} />
            </div>
            <div className="config-field">
              <label className="config-label">Slogan</label>
              <input className="config-input" value={form.slogan} onChange={e => setForm({ ...form, slogan: e.target.value })} placeholder="Tu estilo, nuestra pasion" />
            </div>
            <div className="config-field">
              <label className="config-label">Direccion</label>
              <input className="config-input" value={form.direccion} onChange={e => setForm({ ...form, direccion: e.target.value })} placeholder="Av. Corrientes 1234, CABA" />
            </div>
            <div className="config-field">
              <label className="config-label">WhatsApp</label>
              <input className="config-input" value={form.telefono} onChange={e => setForm({ ...form, telefono: e.target.value })} placeholder="+54 11 1234-5678" />
            </div>
          </div>
        </div>
      )}

      {/* TAB: Diseño */}
      {tabActiva === "diseno" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>

          {/* Preview */}
          <div className="dash-panel">
            <div className="config-section-title">
              <Palette size={16} color="var(--gold)" />
              Vista previa de colores
            </div>
            <div style={{
              borderRadius: 8, overflow: "hidden", border: "1px solid rgba(255,255,255,0.07)",
            }}>
              <div style={{ background: form.colorFondo, padding: "1.5rem", textAlign: "center" }}>
                <div style={{ fontFamily: "var(--font-playfair)", fontSize: "1.8rem", fontWeight: 900, color: form.colorTexto, marginBottom: "0.5rem" }}>
                  {form.nombre || "Tu Barberia"}
                </div>
                <div style={{ fontSize: "0.85rem", color: form.colorTexto, opacity: 0.6, marginBottom: "1rem" }}>
                  {form.slogan || "Tu slogan aqui"}
                </div>
                <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center" }}>
                  <div style={{ background: form.colorPrimario, color: form.colorFondo, padding: "0.5rem 1.2rem", borderRadius: 5, fontSize: "0.8rem", fontWeight: 700 }}>
                    Reservar turno
                  </div>
                  <div style={{ border: `1px solid ${form.colorPrimario}`, color: form.colorPrimario, padding: "0.5rem 1.2rem", borderRadius: 5, fontSize: "0.8rem" }}>
                    Ver servicios
                  </div>
                </div>
              </div>
              <div style={{ background: form.colorSecundario, padding: "0.8rem 1.5rem", display: "flex", gap: "1rem" }}>
                {["Servicios","Equipo","Reservar","Ubicacion"].map(l => (
                  <span key={l} style={{ fontSize: "0.75rem", color: form.colorPrimario }}>{l}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Paletas predefinidas */}
          <div className="dash-panel">
            <div className="config-section-title">
              <Palette size={16} color="var(--gold)" />
              Paletas predefinidas
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px,1fr))", gap: "0.8rem" }}>
              {PALETAS.map((p) => (
                <div
                  key={p.nombre}
                  onClick={() => aplicarPaleta(p)}
                  style={{
                    borderRadius: 8, overflow: "hidden", cursor: "pointer",
                    border: form.colorPrimario === p.primario ? `2px solid ${p.primario}` : "2px solid transparent",
                    transition: "border 0.15s",
                  }}
                >
                  <div style={{ background: p.fondo, height: 40, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                    <div style={{ width: 16, height: 16, borderRadius: "50%", background: p.primario }} />
                    <div style={{ width: 16, height: 16, borderRadius: "50%", background: p.secundario, border: "1px solid rgba(255,255,255,0.1)" }} />
                  </div>
                  <div style={{ background: p.secundario, padding: "0.4rem", textAlign: "center" }}>
                    <div style={{ fontSize: "0.7rem", color: p.primario, fontWeight: 600 }}>{p.nombre}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Colores personalizados */}
          <div className="dash-panel">
            <div className="config-section-title">
              <Palette size={16} color="var(--gold)" />
              Colores personalizados
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              {[
                { key: "colorPrimario",   label: "Color primario",   desc: "Botones, acentos, links" },
                { key: "colorSecundario", label: "Color secundario", desc: "Navbar, cards" },
                { key: "colorFondo",      label: "Color de fondo",   desc: "Fondo general del sitio" },
                { key: "colorTexto",      label: "Color de texto",   desc: "Texto principal" },
              ].map(({ key, label, desc }) => (
                <div key={key} className="config-field">
                  <label className="config-label">{label}</label>
                  <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.3)", marginBottom: "0.4rem" }}>{desc}</div>
                  <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                    <input
                      type="color"
                      value={(form as any)[key]}
                      onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                      style={{ width: 40, height: 36, border: "none", background: "none", cursor: "pointer", borderRadius: 6, padding: 2 }}
                    />
                    <input
                      className="config-input"
                      value={(form as any)[key]}
                      onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                      placeholder="#000000"
                      style={{ flex: 1, marginBottom: 0 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB: Hero */}
      {tabActiva === "hero" && (
        <div className="dash-panel">
          <div className="config-section-title">
            <Image size={16} color="var(--gold)" />
            Seccion Hero — portada del sitio
          </div>

          <div className="config-field" style={{ marginBottom: "0.8rem" }}>
            <label className="config-label">Titulo del hero</label>
            <input
              className="config-input"
              value={form.heroTitulo}
              onChange={e => setForm({ ...form, heroTitulo: e.target.value })}
              placeholder="Ej: El corte que te define"
            />
          </div>

          <div className="config-field" style={{ marginBottom: "0.8rem" }}>
            <label className="config-label">Descripcion del hero</label>
            <textarea
              className="config-input config-textarea"
              value={form.heroDescripcion}
              onChange={e => setForm({ ...form, heroDescripcion: e.target.value })}
              placeholder="Ej: Expertos en cortes modernos. Reserva tu turno online."
            />
          </div>

          <div className="config-field" style={{ marginBottom: "0.8rem" }}>
            <label className="config-label">URL del logo</label>
            <input
              className="config-input"
              value={form.logoUrl}
              onChange={e => setForm({ ...form, logoUrl: e.target.value })}
              placeholder="https://... (imagen cuadrada recomendada)"
            />
            {form.logoUrl && (
              <div style={{ marginTop: "0.5rem" }}>
                <img src={form.logoUrl} alt="Logo" style={{ width: 60, height: 60, objectFit: "contain", borderRadius: 8, background: "rgba(255,255,255,0.05)" }} />
              </div>
            )}
          </div>

          <div className="config-field">
            <label className="config-label">URL foto de portada (hero)</label>
            <input
              className="config-input"
              value={form.heroFotoUrl}
              onChange={e => setForm({ ...form, heroFotoUrl: e.target.value })}
              placeholder="https://... (imagen horizontal recomendada)"
            />
            {form.heroFotoUrl && (
              <div style={{ marginTop: "0.5rem" }}>
                <img src={form.heroFotoUrl} alt="Hero" style={{ width: "100%", height: 120, objectFit: "cover", borderRadius: 8 }} />
              </div>
            )}
            <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.3)", marginTop: "0.4rem" }}>
              Podes subir imagenes gratis en imgbb.com o imgur.com y pegar el link aqui
            </div>
          </div>
        </div>
      )}

      {/* TAB: Notificaciones */}
      {tabActiva === "notif" && (
        <div className="dash-panel">
          <div className="config-section-title">
            <Bell size={16} color="var(--gold)" />
            Notificaciones
          </div>
          {[
            { state: recordatorios, setState: setRecordatorios, label: "Recordatorios automaticos", desc: "Email al cliente 24hs antes del turno" },
            { state: confirmManual, setState: setConfirmManual, label: "Confirmacion manual", desc: "Debas aprobar cada reserva antes de confirmarla" },
            { state: turnosOnline,  setState: setTurnosOnline,  label: "Turnos online activos", desc: "Tus clientes pueden reservar desde tu sitio" },
          ].map((item) => (
            <div key={item.label} className="config-toggle-item">
              <div>
                <div className="config-toggle-label">{item.label}</div>
                <div className="config-toggle-desc">{item.desc}</div>
              </div>
              <div
                className={`config-toggle ${item.state ? "toggle-on" : "toggle-off"}`}
                onClick={() => item.setState(!item.state)}
              >
                <div className="config-toggle-knob" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB: Suscripcion */}
      {tabActiva === "plan" && (
        <div className="dash-panel">
          <div className="config-section-title">
            <CreditCard size={16} color="var(--gold)" />
            Suscripcion
          </div>
          <div className="config-plan">
            <div className="config-plan-info">
              <div className="config-plan-name">Plan {barberia?.plan}</div>
              <div className="config-plan-price">
                {barberia?.plan === "STARTER" ? "$15" : barberia?.plan === "PRO" ? "$25" : "$40"} USD / mes
              </div>
            </div>
            <button className="barbero-btn-outline">Cambiar plan</button>
          </div>
          <div className="config-plan-features">
            {[
              barberia?.plan === "STARTER" ? "Hasta 2 barberos" : barberia?.plan === "PRO" ? "Hasta 5 barberos" : "Barberos ilimitados",
              "Subdominio propio",
              "Turnos online ilimitados",
              barberia?.plan !== "STARTER" ? "Notificaciones por email" : null,
            ].filter(Boolean).map((f) => (
              <div key={f!} className="config-plan-feat">
                <Shield size={12} color="var(--gold)" />
                {f}
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}