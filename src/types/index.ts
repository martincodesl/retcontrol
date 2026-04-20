export type Plan = "STARTER" | "PRO" | "PREMIUM";

export type EstadoTurno =
  | "PENDIENTE"
  | "CONFIRMADO"
  | "EN_CURSO"
  | "COMPLETADO"
  | "CANCELADO";

export interface Barberia {
  id: string;
  nombre: string;
  subdominio: string;
  email: string;
  plan: Plan;
  slogan?: string | null;
  descripcion?: string | null;
  direccion?: string | null;
  telefono?: string | null;
}

export interface Barbero {
  id: string;
  nombre: string;
  especialidad?: string | null;
  foto?: string | null;
  activo: boolean;
  barberiaId: string;
}

export interface Servicio {
  id: string;
  nombre: string;
  descripcion?: string | null;
  precio: number;
  duracion: number;
  color: string;
  activo: boolean;
  barberiaId: string;
}

export interface Turno {
  id: string;
  fecha: string;
  estado: EstadoTurno;
  clienteNombre: string;
  clienteEmail: string;
  clienteTelefono?: string | null;
  barbero: { id: string; nombre: string };
  servicio: { id: string; nombre: string; duracion: number; precio: number };
}