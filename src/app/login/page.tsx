"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await signIn("credentials", {
        email: form.email,
        password: form.password,
        redirect: false,
      });
      if (res?.error) {
        setError("Email o contraseña incorrectos");
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

      <div className="auth-card">
        <Link href="/" className="auth-logo">
          RET<span>control</span>
        </Link>

        <div className="auth-title">Bienvenido de vuelta</div>
        <div className="auth-subtitle">
          Ingresa a tu panel de administracion
        </div>

        {error && (
          <div style={{
            background: "rgba(231,76,60,0.1)",
            border: "1px solid rgba(231,76,60,0.3)",
            borderRadius: 6, padding: "0.7rem 1rem",
            fontSize: "0.85rem", color: "#E74C3C",
            marginBottom: "0.5rem"
          }}>
            {error}
          </div>
        )}

        <div className="auth-form">
          <div className="auth-field">
            <label className="config-label">Email</label>
            <input
              className="config-input"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="tu@email.com"
            />
          </div>

          <div className="auth-field">
            <label className="config-label">Contrasena</label>
            <div className="auth-pass-wrap">
              <input
                className="config-input"
                name="password"
                type={showPass ? "text" : "password"}
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
              />
              <button
                className="auth-pass-toggle"
                onClick={() => setShowPass(!showPass)}
                type="button"
              >
                {showPass ? "Ocultar" : "Mostrar"}
              </button>
            </div>
          </div>

          <div className="auth-forgot">
            <Link href="#">Olvide mi contrasena</Link>
          </div>

          <button
            className="btn-primary auth-btn"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Ingresando..." : "Iniciar sesion"}
          </button>

          <div className="auth-divider"><span>o</span></div>

          <div className="auth-register">
            No tenes cuenta?{" "}
            <Link href="/registro">Registrate gratis</Link>
          </div>
        </div>
      </div>

      <div className="auth-footer">
        Powered by <span style={{ color: "var(--gold)" }}>RETcontrol</span>
        {" · "}
        <Link href="/">Volver al inicio</Link>
      </div>
    </div>
  );
}