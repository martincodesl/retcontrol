"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Plus, Trash2, DollarSign, TrendingDown, TrendingUp, Filter } from "lucide-react";

interface BarberoSession {
  id: string;
  nombre: string;
  barberiaSubdominio: string;
}

interface Turno {
  id: string;
  fecha: string;
  servicio: { precio: number; nombre: string };
  estado: string;
}

interface Gasto {
  id: string;
  nombre: string;
  monto: number;
  categoria: string;
  fecha: string;
}

const CATEGORIAS = [
  { value: "HERRAMIENTAS", label: "Herramientas", color: "#3498DB" },
  { value: "PRODUCTOS",    label: "Productos",    color: "#2ECC71" },
  { value: "TRANSPORTE",   label: "Transporte",   color: "#E67E22" },
  { value: "COMIDA",       label: "Comida",        color: "#E74C3C" },
  { value: "ROPA",         label: "Ropa",          color: "#9B59B6" },
  { value: "OTROS",        label: "Otros",         color: "#95A5A6" },
];

type PeriodoTipo = "mes_actual" | "mes_anterior" | "personalizado";

function GraficoTorta({ datos }: { datos: { label: string; valor: number; color: string }[] }) {
  const total = datos.reduce((acc, d) => acc + d.valor, 0);
  if (total === 0) return (
    <div style={{ textAlign: "center", color: "rgba(255,255,255,0.3)", fontSize: "0.85rem", padding: "1.5rem 0" }}>
      Sin gastos para mostrar
    </div>
  );

  let acumulado = 0;
  const radio = 70;
  const cx = 90;
  const cy = 90;

  const sectores = datos.map((d) => {
    const inicio = acumulado;
    const pct = d.valor / total;
    acumulado += pct;
    const a1 = inicio * 2 * Math.PI - Math.PI / 2;
    const a2 = acumulado * 2 * Math.PI - Math.PI / 2;
    const x1 = cx + radio * Math.cos(a1);
    const y1 = cy + radio * Math.sin(a1);
    const x2 = cx + radio * Math.cos(a2);
    const y2 = cy + radio * Math.sin(a2);
    return { ...d, x1, y1, x2, y2, largeArc: pct > 0.5 ? 1 : 0, pct };
  });

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", flexWrap: "wrap" }}>
      <svg width="180" height="180" viewBox="0 0 180 180">
        {sectores.map((s, i) => (
          <path
            key={i}
            d={`M ${cx} ${cy} L ${s.x1} ${s.y1} A ${radio} ${radio} 0 ${s.largeArc} 1 ${s.x2} ${s.y2} Z`}
            fill={s.color}
            opacity={0.85}
          />
        ))}
        <circle cx={cx} cy={cy} r={36} fill="var(--charcoal)" />
        <text x={cx} y={cy - 5} textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="9">Total</text>
        <text x={cx} y={cy + 10} textAnchor="middle" fill="var(--gold)" fontSize="10" fontWeight="bold">
          ${total.toLocaleString("es-AR")}
        </text>
      </svg>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
        {sectores.map((s, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.78rem" }}>
            <div style={{ width: 8, height: 8, borderRadius: 2, background: s.color, flexShrink: 0 }} />
            <span style={{ color: "rgba(255,255,255,0.6)" }}>{s.label}</span>
            <span style={{ color: "var(--gold)", fontWeight: 600, marginLeft: "auto" }}>
              {Math.round(s.pct * 100)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function FinanzasBarberoPage() {
  const params = useParams();
  const router = useRouter();
  const subdominio = params.subdominio as string;

  const [barbero, setBarbero] = useState<BarberoSession | null>(null);
  const [turnos, setTurnos] = useState<Turno[]>([]);
  const [gastos, setGastos] = useState<Gasto[]>([]);
  const [loading, setLoading] = useState(true);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [form, setForm] = useState({ nombre: "", monto: "", categoria: "HERRAMIENTAS" });

  // Filtro de período
  const [periodo, setPeriodo] = useState<PeriodoTipo>("mes_actual");
  const [desde, setDesde] = useState("");
  const [hasta, setHasta] = useState("");

  const getPeriodoParams = () => {
    const ahora = new Date();
    if (periodo === "mes_actual") {
      const d = new Date(ahora.getFullYear(), ahora.getMonth(), 1).toISOString().split("T")[0];
      const h = new Date(ahora.getFullYear(), ahora.getMonth() + 1, 0).toISOString().split("T")[0];
      return `desde=${d}&hasta=${h}`;
    }
    if (periodo === "mes_anterior") {
      const d = new Date(ahora.getFullYear(), ahora.getMonth() - 1, 1).toISOString().split("T")[0];
      const h = new Date(ahora.getFullYear(), ahora.getMonth(), 0).toISOString().split("T")[0];
      return `desde=${d}&hasta=${h}`;
    }
    if (periodo === "personalizado" && desde && hasta) {
      return `desde=${desde}&hasta=${hasta}`;
    }
    return "";
  };

  const getPeriodoLabel = () => {
    const ahora = new Date();
    const meses = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
    if (periodo === "mes_actual") return `${meses[ahora.getMonth()]} ${ahora.getFullYear()}`;
    if (periodo === "mes_anterior") {
      const mesAnt = ahora.getMonth() === 0 ? 11 : ahora.getMonth() - 1;
      const anioAnt = ahora.getMonth() === 0 ? ahora.getFullYear() - 1 : ahora.getFullYear();
      return `${meses[mesAnt]} ${anioAnt}`;
    }
    if (periodo === "personalizado" && desde && hasta) return `${desde} al ${hasta}`;
    return "Selecciona un periodo";
  };

  useEffect(() => {
    const session = localStorage.getItem("barbero_session");
    if (!session) {
      router.push(`/${subdominio}/barberos`);
      return;
    }
    const barberoData = JSON.parse(session);
    setBarbero(barberoData);
    cargarDatos(barberoData.id);
  }, []);

  useEffect(() => {
    if (barbero) cargarDatos(barbero.id);
  }, [periodo, desde, hasta]);

  const cargarDatos = async (barberoId: string) => {
    setLoading(true);
    try {
      const periodoParams = getPeriodoParams();
      const [resTurnos, resGastos] = await Promise.all([
        fetch(`/api/barberos/${barberoId}/mis-turnos${periodoParams ? "?" + periodoParams : ""}`),
        fetch(`/api/barberos/${barberoId}/mis-gastos`),
      ]);
      const dataTurnos = await resTurnos.json();
      const dataGastos = await resGastos.json();
      setTurnos(dataTurnos.turnos || []);
      setGastos(dataGastos.gastos || []);
    } catch {
      console.error("Error al cargar datos");
    } finally {
      setLoading(false);
    }
  };

  const agregarGasto = async () => {
    if (!form.nombre || !form.monto) return;
    setGuardando(true);
    try {
      await fetch(`/api/barberos/${barbero!.id}/mis-gastos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: form.nombre,
          monto: Number(form.monto),
          categoria: form.categoria,
        }),
      });
      setForm({ nombre: "", monto: "", categoria: "HERRAMIENTAS" });
      setMostrarForm(false);
      cargarDatos(barbero!.id);
    } catch {
      console.error("Error al agregar gasto");
    } finally {
      setGuardando(false);
    }
  };

  const eliminarGasto = async (id: string) => {
    if (!confirm("Eliminar este gasto?")) return;
    await fetch(`/api/barberos/${barbero!.id}/mis-gastos`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ gastoId: id }),
    });
    cargarDatos(barbero!.id);
  };

  const ingresoTotal = turnos
    .filter((t) => t.estado === "COMPLETADO")
    .reduce((acc, t) => acc + t.servicio.precio, 0);

  const gastoTotal = gastos.reduce((acc, g) => acc + g.monto, 0);
  const balance = ingresoTotal - gastoTotal;

  const gastosPorCategoria = CATEGORIAS.map((cat) => ({
    label: cat.label,
    color: cat.color,
    valor: gastos.filter((g) => g.categoria === cat.value).reduce((acc, g) => acc + g.monto, 0),
  })).filter((d) => d.valor > 0);

  if (!barbero) return null;

  return (
    <div style={{ minHeight: "100vh", background: "var(--dark)" }}>

      {/* Topbar */}
      <div style={{
        background: "var(--charcoal)",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
        padding: "1rem 2rem",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        position: "sticky", top: 0, zIndex: 50,
      }}>
        <button
          onClick={() => router.push(`/${subdominio}/barberos/dashboard`)}
          style={{ background: "none", border: "none", color: "var(--gold)", cursor: "pointer", fontSize: "0.9rem", fontFamily: "var(--font-dm-sans)" }}
        >
          ← Dashboard
        </button>
        <div style={{ fontFamily: "var(--font-playfair)", fontWeight: 700 }}>Mis Finanzas</div>
        <div style={{ width: 80 }} />
      </div>

      <div style={{ padding: "2rem", maxWidth: 900, margin: "0 auto" }}>

        {/* Selector de período */}
        <div className="dash-panel" style={{ marginBottom: "1.5rem" }}>
          <div className="dash-panel-header">
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Filter size={14} color="var(--gold)" />
              <div className="dash-panel-title">Periodo</div>
            </div>
            <span style={{ fontSize: "0.8rem", color: "var(--gold)", fontWeight: 600 }}>
              {getPeriodoLabel()}
            </span>
          </div>

          {/* Botones de período */}
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: periodo === "personalizado" ? "1rem" : 0 }}>
            {[
              { value: "mes_actual",   label: "Este mes" },
              { value: "mes_anterior", label: "Mes anterior" },
              { value: "personalizado", label: "Personalizado" },
            ].map((p) => (
              <button
                key={p.value}
                onClick={() => setPeriodo(p.value as PeriodoTipo)}
                style={{
                  background: periodo === p.value ? "var(--gold)" : "rgba(255,255,255,0.05)",
                  color: periodo === p.value ? "var(--dark)" : "rgba(255,255,255,0.6)",
                  border: periodo === p.value ? "none" : "1px solid rgba(255,255,255,0.1)",
                  padding: "0.45rem 1rem", borderRadius: 6,
                  cursor: "pointer", fontSize: "0.82rem", fontWeight: 600,
                  fontFamily: "var(--font-dm-sans)",
                  transition: "all 0.15s",
                }}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Fechas personalizadas */}
          {periodo === "personalizado" && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: "0.8rem", alignItems: "flex-end" }}>
              <div className="auth-field">
                <label className="config-label">Desde</label>
                <input
                  className="config-input"
                  type="date"
                  value={desde}
                  onChange={(e) => setDesde(e.target.value)}
                />
              </div>
              <div className="auth-field">
                <label className="config-label">Hasta</label>
                <input
                  className="config-input"
                  type="date"
                  value={hasta}
                  onChange={(e) => setHasta(e.target.value)}
                />
              </div>
              <button
                className="dash-topbar-btn"
                onClick={() => barbero && cargarDatos(barbero.id)}
                style={{ height: 38 }}
              >
                Aplicar
              </button>
            </div>
          )}
        </div>

        {/* KPIs */}
        <div className="dash-cards" style={{ marginBottom: "1.5rem" }}>
          <div className="dash-card">
            <div className="dash-card-top">
              <div className="dash-card-label">Ingresos</div>
              <div className="dash-card-icon"><TrendingUp size={16} color="var(--gold)" /></div>
            </div>
            <div className="dash-card-val" style={{ color: "#2ECC71", fontSize: "1.5rem" }}>
              ${ingresoTotal.toLocaleString("es-AR")}
            </div>
            <div className="dash-card-sub dash-up">{turnos.filter(t => t.estado === "COMPLETADO").length} turnos completados</div>
          </div>
          <div className="dash-card">
            <div className="dash-card-top">
              <div className="dash-card-label">Gastos</div>
              <div className="dash-card-icon"><TrendingDown size={16} color="var(--gold)" /></div>
            </div>
            <div className="dash-card-val" style={{ color: "#E74C3C", fontSize: "1.5rem" }}>
              ${gastoTotal.toLocaleString("es-AR")}
            </div>
            <div className="dash-card-sub dash-down">{gastos.length} gastos registrados</div>
          </div>
          <div className="dash-card">
            <div className="dash-card-top">
              <div className="dash-card-label">Balance</div>
              <div className="dash-card-icon"><DollarSign size={16} color="var(--gold)" /></div>
            </div>
            <div className="dash-card-val" style={{ color: balance >= 0 ? "#2ECC71" : "#E74C3C", fontSize: "1.5rem" }}>
              ${balance.toLocaleString("es-AR")}
            </div>
            <div className={`dash-card-sub dash-${balance >= 0 ? "up" : "down"}`}>
              {balance >= 0 ? "positivo" : "negativo"}
            </div>
          </div>
        </div>

        {/* Grafico */}
        {gastosPorCategoria.length > 0 && (
          <div className="dash-panel" style={{ marginBottom: "1.5rem" }}>
            <div className="dash-panel-title" style={{ marginBottom: "1rem" }}>Gastos por categoria</div>
            <GraficoTorta datos={gastosPorCategoria} />
          </div>
        )}

        {/* Ingresos por turno */}
        <div className="dash-panel" style={{ marginBottom: "1.5rem" }}>
          <div className="dash-panel-header">
            <div className="dash-panel-title">Ingresos del periodo</div>
            <span className="dash-panel-action">{turnos.filter(t => t.estado === "COMPLETADO").length} turnos</span>
          </div>
          {loading ? (
            <div style={{ padding: "2rem", textAlign: "center", color: "rgba(255,255,255,0.3)" }}>Cargando...</div>
          ) : turnos.filter(t => t.estado === "COMPLETADO").length === 0 ? (
            <div style={{ padding: "1.5rem", textAlign: "center", color: "rgba(255,255,255,0.3)", fontSize: "0.875rem" }}>
              No hay ingresos en este periodo
            </div>
          ) : (
            turnos.filter(t => t.estado === "COMPLETADO").map((t) => (
              <div key={t.id} className="fin-mov-item">
                <div className="fin-mov-icon fin-mov-in">↑</div>
                <div className="fin-mov-info">
                  <div className="fin-mov-desc">{t.servicio.nombre}</div>
                  <div className="fin-mov-sub">
                    {new Date(t.fecha).toLocaleDateString("es-AR", { weekday: "short", day: "numeric", month: "short" })}
                  </div>
                </div>
                <div className="fin-mov-monto" style={{ color: "#2ECC71" }}>
                  +${t.servicio.precio.toLocaleString("es-AR")}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Gastos */}
        <div className="dash-panel">
          <div className="dash-panel-header">
            <div className="dash-panel-title">Mis gastos</div>
            <button
              className="dash-topbar-btn"
              onClick={() => setMostrarForm(!mostrarForm)}
              style={{ fontSize: "0.75rem", padding: "0.35rem 0.8rem" }}
            >
              <Plus size={12} style={{ display: "inline", marginRight: 4 }} />
              Agregar
            </button>
          </div>

          {mostrarForm && (
            <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: 8, padding: "1rem", marginBottom: "1rem" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.8rem", marginBottom: "0.8rem" }}>
                <div className="auth-field">
                  <label className="config-label">Nombre del gasto</label>
                  <input
                    className="config-input"
                    value={form.nombre}
                    onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                    placeholder="Ej: Maquina de corte"
                  />
                </div>
                <div className="auth-field">
                  <label className="config-label">Monto ($)</label>
                  <input
                    className="config-input"
                    type="number"
                    value={form.monto}
                    onChange={(e) => setForm({ ...form, monto: e.target.value })}
                    placeholder="Ej: 5000"
                  />
                </div>
              </div>
              <div className="auth-field" style={{ marginBottom: "0.8rem" }}>
                <label className="config-label">Categoria</label>
                <select
                  className="config-input dash-select"
                  value={form.categoria}
                  onChange={(e) => setForm({ ...form, categoria: e.target.value })}
                >
                  {CATEGORIAS.map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button className="barbero-btn-outline" onClick={() => setMostrarForm(false)} style={{ flex: 1 }}>
                  Cancelar
                </button>
                <button className="dash-topbar-btn" onClick={agregarGasto} disabled={guardando} style={{ flex: 1 }}>
                  {guardando ? "Guardando..." : "Guardar"}
                </button>
              </div>
            </div>
          )}

          {gastos.length === 0 ? (
            <div style={{ padding: "2rem", textAlign: "center", color: "rgba(255,255,255,0.3)", fontSize: "0.875rem" }}>
              No hay gastos registrados
            </div>
          ) : (
            gastos.map((g) => {
              const cat = CATEGORIAS.find((c) => c.value === g.categoria);
              return (
                <div key={g.id} className="fin-mov-item">
                  <div className="fin-mov-icon fin-mov-out">↓</div>
                  <div className="fin-mov-info">
                    <div className="fin-mov-desc">{g.nombre}</div>
                    <div className="fin-mov-sub">
                      <span style={{ color: cat?.color, marginRight: "0.5rem" }}>● {cat?.label}</span>
                      {new Date(g.fecha).toLocaleDateString("es-AR")}
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <div className="fin-mov-monto" style={{ color: "#E74C3C" }}>
                      -${g.monto.toLocaleString("es-AR")}
                    </div>
                    <button
                      onClick={() => eliminarGasto(g.id)}
                      style={{ background: "none", border: "none", color: "rgba(255,255,255,0.25)", cursor: "pointer" }}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
}