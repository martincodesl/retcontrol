import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

function getId(req: NextRequest) {
  const pathParts = new URL(req.url).pathname.split("/").filter(Boolean);
  return pathParts[2];
}

// PATCH — editar servicio
export async function PATCH(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const servicioId = getId(req);
    const { nombre, descripcion, precio, duracion, color, activo } = await req.json();

    const servicio = await prisma.servicio.findFirst({
      where: { id: servicioId, barberiaId: session.user.id },
    });

    if (!servicio) {
      return NextResponse.json(
        { error: "Servicio no encontrado" },
        { status: 404 }
      );
    }

    const actualizado = await prisma.servicio.update({
      where: { id: servicioId },
      data: {
        nombre:      nombre      ?? servicio.nombre,
        descripcion: descripcion ?? servicio.descripcion,
        precio:      precio      ?? servicio.precio,
        duracion:    duracion    ?? servicio.duracion,
        color:       color       ?? servicio.color,
        activo:      activo      ?? servicio.activo,
      },
    });

    return NextResponse.json({ ok: true, servicio: actualizado });
  } catch (error) {
    console.error("Error al editar servicio:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

// DELETE — eliminar servicio
export async function DELETE(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const servicioId = getId(req);
    const servicio = await prisma.servicio.findFirst({
      where: { id: servicioId, barberiaId: session.user.id },
    });

    if (!servicio) {
      return NextResponse.json(
        { error: "Servicio no encontrado" },
        { status: 404 }
      );
    }

    await prisma.servicio.delete({ where: { id: servicioId } });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error al eliminar servicio:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}