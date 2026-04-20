"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const planes = [
  { id: "STARTER", name: "Starter", price: "$15", desc: "Hasta 2 barberos" },
  { id: "PRO",     name: "Pro",     price: "$25", desc: "Hasta 5 barberos", popular: true },
  { id: "PREMIUM", name: "Premium", price: "$40", desc: "Barberos ilimitados" },
];

export default function RegistroPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [planSelected, setPlanSelected] = useState("PRO");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    nombre: "",
    email: "",
    password: "",
    nombreBarberia: "",
    subdominio: "",
    telefono: "",
    ciudad: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/registro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: form.nombre,
          subdominio: form.subdominio,
          email: form.email,
          password: form.password,
          telefono: form.telefono,
          plan: planSelected,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Error al registrarse");
        return;
      }
      router.push("/dashboard");
    } catch {
      setError("Error de conexion. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-bg" />
      <div className="auth-grid" />

      <div className="auth-card auth-card-wide">
        <Link href="/" className="auth-logo">RET<span>control</span></Link>

        <div className="auth-progress">
          <div className={`auth-step-dot ${step >= 1 ? "step-active" : ""}`}>1</div>
          <div className={`auth-progress-line ${step >= 2 ? "line-active" : ""}`} />
          <div className={`auth-step-dot ${step >= 2 ? "step-active" : ""}`}>2</div>
          <div className={`auth-progress-line ${step >= 3 ? "line-active" : ""}`} />
          <div className={`auth-step-dot ${step >= 3 ? "step-active" : ""}`}>3</div>
        </div>
        <div className="auth-progress-labels">
          <span>Tu cuenta</span>
          <span>Tu barberia</span>
          <span>Tu plan</span>
        </div>

        {error && (
          <div style={{
            background: "rgba(231,76,60,0.1)", border: "1px solid rgba(231,76,60,0.3)",
            borderRadius: 6, padding: "0.7rem 1rem",
            fontSize: "0.85rem", color: "#E74C3C", marginBottom: "0.5rem"
          }}>
            {error}
          </div>
        )}

        {step === 1 && (
          <>
            <div className="auth-title">Crea tu cuenta</div>
            <div className="auth-subtitle">Empieza gratis, sin tarjeta de credito</div>
            <div className="auth-form">
              <div className="auth-field">
                <label className="config-label">Nombre completo</label>
                <input className="config-input" name="nombre" value={form.nombre} onChange={handleChange} placeholder="Martin Garcia" />
              </div>
              <div className="auth-field">
                <label className="config-label">Email</label>
                <input className="config-input" name="email" type="email" value={form.email} onChange={handleChange} placeholder="martin@email.com" />
              </div>
              <div className="auth-field">
                <label className="config-label">Contrasena</label>
                <div className="auth-pass-wrap">
                  <input className="config-input" name="password" type={showPass ? "text" : "password"} value={form.password} onChange={handleChange} placeholder="Minimo 8 caracteres" />
                  <button className="auth-pass-toggle" onClick={() => setShowPass(!showPass)} type="button">
                    {showPass ? "Ocultar" : "Mostrar"}
                  </button>
                </div>
              </div>
              <button className="btn-primary auth-btn" onClick={() => setStep(2)}>Continuar →</button>
              <div className="auth-register">Ya tenes cuenta? <Link href="/login">Iniciar sesion</Link></div>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div className="auth-title">Tu barberia</div>
            <div className="auth-subtitle">Estos datos van a aparecer en tu sitio publico</div>
            <div className="auth-form">
              <div className="auth-field">
                <label className="config-label">Nombre de la barberia</label>
                <input className="config-input" name="nombreBarberia" value={form.nombreBarberia} onChange={handleChange} placeholder="Ej: King's Cuts" />
              </div>
              <div className="auth-field">
                <label className="config-label">Subdominio</label>
                <div className="auth-subdomain-wrap">
                  <input className="config-input auth-subdomain-input" name="subdominio" value={form.subdominio} onChange={handleChange} placeholder="kings-cuts" />
                  <span className="auth-subdomain-suffix">.retcontrol.app</span>
                </div>
              </div>
              <div className="auth-field">
                <label className="config-label">Telefono / WhatsApp</label>
                <input className="config-input" name="telefono" value={form.telefono} onChange={handleChange} placeholder="+54 11 1234-5678" />
              </div>
              <div className="auth-field">
                <label className="config-label">Ciudad</label>
                <input className="config-input" name="ciudad" value={form.ciudad} onChange={handleChange} placeholder="Ej: Buenos Aires" />
              </div>
              <div className="auth-two-btns">
                <button className="barbero-btn-outline auth-back-btn" onClick={() => setStep(1)}>← Volver</button>
                <button className="btn-primary auth-btn" onClick={() => setStep(3)}>Continuar →</button>
              </div>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <div className="auth-title">Elegí tu plan</div>
            <div className="auth-subtitle">30 dias gratis, cancelas cuando quieras</div>
            <div className="auth-form">
              <div className="auth-planes">
                {planes.map((p) => (
                  <div key={p.id} className={`auth-plan-card ${planSelected === p.id ? "auth-plan-selected" : ""}`} onClick={() => setPlanSelected(p.id)}>
                    {p.popular && <div className="auth-plan-badge">Popular</div>}
                    <div className="auth-plan-name">{p.name}</div>
                    <div className="auth-plan-price">{p.price}<span>/mes</span></div>
                    <div className="auth-plan-desc">{p.desc}</div>
                  </div>
                ))}
              </div>
              <div className="auth-two-btns">
                <button className="barbero-btn-outline auth-back-btn" onClick={() => setStep(2)}>← Volver</button>
                <button className="btn-primary auth-btn" onClick={handleSubmit} disabled={loading}>
                  {loading ? "Creando cuenta..." : "Crear mi cuenta gratis ✓"}
                </button>
              </div>
              <div className="auth-register">
                Al registrarte aceptas nuestros <Link href="#">Terminos y condiciones</Link>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="auth-footer">
        Powered by <span style={{ color: "var(--gold)" }}>RETcontrol</span>{" · "}
        <Link href="/">Volver al inicio</Link>
      </div>
    </div>
  );
}