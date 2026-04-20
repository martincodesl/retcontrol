import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// GET — listar turnos
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const fecha = searchParams.get("fecha");

    const where: any = { barberiaId: session.user.id };

    if (fecha) {
      const inicio = new Date(fecha);
      inicio.setHours(0, 0, 0, 0);
      const fin = new Date(fecha);
      fin.setHours(23, 59, 59, 999);
      where.fecha = { gte: inicio, lte: fin };
    }

    const turnos = await prisma.turno.findMany({
      where,
      include: {
        barbero: { select: { id: true, nombre: true } },
        servicio: { select: { id: true, nombre: true, duracion: true, precio: true } },
      },
      orderBy: { fecha: "asc" },
    });

    return NextResponse.json({ turnos });
  } catch (error) {
    console.error("Error al obtener turnos:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

// POST — crear turno
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const {
      fecha,
      barberoId,
      servicioId,
      clienteNombre,
      clienteEmail,
      clienteTelefono,
      notas,
    } = await req.json();

    if (!fecha || !barberoId || !servicioId || !clienteNombre || !clienteEmail) {
      return NextResponse.json(
        { error: "Faltan campos obligatorios" },
        { status: 400 }
      );
    }

    // Verificar que el barbero pertenece a esta barbería
    const barbero = await prisma.barbero.findFirst({
      where: { id: barberoId, barberiaId: session.user.id },
    });
    if (!barbero) {
      return NextResponse.json(
        { error: "Barbero no encontrado" },
        { status: 404 }
      );
    }

    // Verificar que el servicio pertenece a esta barbería
    const servicio = await prisma.servicio.findFirst({
      where: { id: servicioId, barberiaId: session.user.id },
    });
    if (!servicio) {
      return NextResponse.json(
        { error: "Servicio no encontrado" },
        { status: 404 }
      );
    }

    // Verificar que no haya otro turno en el mismo horario con el mismo barbero
    const fechaTurno = new Date(fecha);
    const conflicto = await prisma.turno.findFirst({
      where: {
        barberoId,
        fecha: fechaTurno,
        estado: { notIn: ["CANCELADO"] },
      },
    });
    if (conflicto) {
      return NextResponse.json(
        { error: "El barbero ya tiene un turno en ese horario" },
        { status: 400 }
      );
    }

    const turno = await prisma.turno.create({
      data: {
        fecha: fechaTurno,
        barberoId,
        servicioId,
        barberiaId: session.user.id,
        clienteNombre,
        clienteEmail,
        clienteTelefono: clienteTelefono || null,
        notas: notas || null,
        estado: "PENDIENTE",
      },
      include: {
        barbero: { select: { nombre: true } },
        servicio: { select: { nombre: true, duracion: true, precio: true } },
      },
    });

    return NextResponse.json({ ok: true, turno });
  } catch (error) {
    console.error("Error al crear turno:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}