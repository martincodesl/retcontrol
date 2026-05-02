import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: { subdominio: string } }
) {
  try {
    const { searchParams } = new URL(req.url);
    const barberoId  = searchParams.get("barberoId");
    const fecha      = searchParams.get("fecha");
    const duracion   = Number(searchParams.get("duracion") || 30);

    if (!barberoId || !fecha) {
      return NextResponse.json(
        { error: "barberoId y fecha son obligatorios" },
        { status: 400 }
      );
    }

    // Verificar que el barbero pertenece a esta barbería
    const barberia = await prisma.barberia.findUnique({
      where: { subdominio: params.subdominio },
    });
    if (!barberia) {
      return NextResponse.json({ error: "Barberia no encontrada" }, { status: 404 });
    }

    const barbero = await prisma.barbero.findFirst({
      where: { id: barberoId, barberiaId: barberia.id, activo: true },
    });
    if (!barbero) {
      return NextResponse.json({ error: "Barbero no encontrado" }, { status: 404 });
    }

    // Verificar si el día está bloqueado
    const fechaDate = new Date(fecha + "T00:00:00");
    const bloqueado = await prisma.horarioBloqueado.findFirst({
      where: {
        barberoId,
        fecha: {
          gte: new Date(fecha + "T00:00:00"),
          lte: new Date(fecha + "T23:59:59"),
        },
      },
    });
    if (bloqueado) {
      return NextResponse.json({ slots: [], bloqueado: true });
    }

    // Obtener turnos ya reservados ese día
    const inicio = new Date(fecha + "T00:00:00");
    const fin    = new Date(fecha + "T23:59:59");

    const turnosExistentes = await prisma.turno.findMany({
      where: {
        barberoId,
        fecha: { gte: inicio, lte: fin },
        estado: { notIn: ["CANCELADO"] },
      },
      select: { fecha: true },
    });

    // Generar slots de 09:00 a 19:00 según duración del servicio
    const slots: { hora: string; disponible: boolean }[] = [];
    const horaInicio = 9;
    const horaFin    = 19;

    for (let h = horaInicio * 60; h + duracion <= horaFin * 60; h += duracion) {
      const horas   = Math.floor(h / 60).toString().padStart(2, "0");
      const minutos = (h % 60).toString().padStart(2, "0");
      const hora    = `${horas}:${minutos}`;

      const slotDate = new Date(`${fecha}T${hora}:00`);

      // Verificar si ese slot está ocupado
      const ocupado = turnosExistentes.some((t) => {
        const tHora = new Date(t.fecha);
        return Math.abs(tHora.getTime() - slotDate.getTime()) < duracion * 60 * 1000;
      });

      // No mostrar slots pasados si es hoy
      const ahora = new Date();
      const esHoy = fechaDate.toDateString() === ahora.toDateString();
      const esPasado = esHoy && slotDate <= ahora;

      slots.push({ hora, disponible: !ocupado && !esPasado });
    }

    return NextResponse.json({ slots });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}