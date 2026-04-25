"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

export default function LoginBarberosPage() {
  const router = useRouter();
  const params = useParams();
  const subdominio = params.subdominio as string;

  const [form, setForm] = useState({ usuario: "", pin: "" });
  const [showPin, setShowPin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!form.usuario || !form.pin) {
      setError("Usuario y PIN son obligatorios");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/barberos/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subdominio,
          usuario: form.usuario,
          pin: form.pin,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Error al iniciar sesion");
        return;
      }
      // Guardar sesion del barbero en localStorage
      localStorage.setItem("barbero_session", JSON.stringify(data.barbero));
      router.push(`/${subdominio}/barberos/dashboard`);
    } catch {
      setError("Error de conexion");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-bg" />
      <div className="auth-grid" />

      <div className="auth-card">
        <Link href={`/${subdominio}`} className="auth-logo">
          RET<span>control</span>
        </Link>

        <div className="auth-title">Acceso Barberos</div>
        <div className="auth-subtitle">
          Ingresa con tu usuario y PIN
        </div>

        {error && (
          <div style={{
            background: "rgba(231,76,60,0.1)",
            border: "1px solid rgba(231,76,60,0.3)",
            borderRadius: 6, padding: "0.7rem 1rem",
            fontSize: "0.85rem", color: "#E74C3C",
            marginBottom: "0.8rem"
          }}>
            {error}
          </div>
        )}

        <div className="auth-form">
          <div className="auth-field">
            <label className="config-label">Usuario</label>
            <input
              className="config-input"
              value={form.usuario}
              onChange={(e) => setForm({ ...form, usuario: e.target.value })}
              placeholder="Ej: rodrigo"
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            />
          </div>

          <div className="auth-field">
            <label className="config-label">PIN de 6 digitos</label>
            <div className="auth-pass-wrap">
              <input
                className="config-input"
                type={showPin ? "text" : "password"}
                maxLength={6}
                value={form.pin}
                onChange={(e) => setForm({ ...form, pin: e.target.value.replace(/\D/g, "") })}
                placeholder="······"
                style={{ letterSpacing: "0.3em", textAlign: "center", fontSize: "1.1rem" }}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              />
              <button
                className="auth-pass-toggle"
                type="button"
                onClick={() => setShowPin(!showPin)}
              >
                {showPin ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>

          <button
            className="btn-primary auth-btn"
            onClick={handleLogin}
            disabled={loading}
            style={{ border: "none", cursor: "pointer" }}
          >
            {loading ? "Ingresando..." : "Ingresar"}
          </button>

          <div className="auth-register">
            <Link href={`/${subdominio}`}>← Volver al sitio</Link>
          </div>
        </div>
      </div>

      <div className="auth-footer">
        Powered by <span style={{ color: "var(--gold)" }}>RETcontrol</span>
      </div>
    </div>
  );
}