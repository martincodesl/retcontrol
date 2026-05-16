import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function getSubdominio(req: NextRequest) {
  const pathParts = new URL(req.url).pathname.split("/").filter(Boolean);
  return pathParts[2];
}

export async function POST(req: NextRequest) {
  try {
    const barberia = await prisma.barberia.findUnique({
      where: { subdominio: getSubdominio(req) },
    });
    if (!barberia) {
      return NextResponse.json({ error: "Barberia no encontrada" }, { status: 404 });
    }

    const {
      fecha,
      hora,
      barberoId,
      servicioId,
      clienteNombre,
      clienteEmail,
      clienteTelefono,
    } = await req.json();

    if (!fecha || !hora || !barberoId || !servicioId || !clienteNombre || !clienteEmail) {
      return NextResponse.json(
        { error: "Faltan campos obligatorios" },
        { status: 400 }
      );
    }

    const fechaCompleta = new Date(`${fecha}T${hora}:00`);

    // Verificar que no haya conflicto
    const conflicto = await prisma.turno.findFirst({
      where: {
        barberoId,
        fecha: fechaCompleta,
        estado: { notIn: ["CANCELADO"] },
      },
    });
    if (conflicto) {
      return NextResponse.json(
        { error: "Ese horario ya no esta disponible" },
        { status: 400 }
      );
    }

    const turno = await prisma.turno.create({
      data: {
        fecha: fechaCompleta,
        barberoId,
        servicioId,
        barberiaId: barberia.id,
        clienteNombre,
        clienteEmail,
        clienteTelefono: clienteTelefono || null,
        estado: "PENDIENTE",
      },
      include: {
        barbero:  { select: { nombre: true } },
        servicio: { select: { nombre: true, duracion: true, precio: true } },
      },
    });

    return NextResponse.json({ ok: true, turno });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}