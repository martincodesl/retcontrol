import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

function getId(req: NextRequest) {
  const pathParts = new URL(req.url).pathname.split("/").filter(Boolean);
  return pathParts[2];
}

// PATCH — actualizar estado del turno
export async function PATCH(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const turnoId = getId(req);
    const { estado } = await req.json();

    const turno = await prisma.turno.findFirst({
      where: { id: turnoId, barberiaId: session.user.id },
    });

    if (!turno) {
      return NextResponse.json(
        { error: "Turno no encontrado" },
        { status: 404 }
      );
    }

    const actualizado = await prisma.turno.update({
      where: { id: turnoId },
      data: { estado },
    });

    return NextResponse.json({ ok: true, turno: actualizado });
  } catch (error) {
    console.error("Error al actualizar turno:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

// DELETE — cancelar turno
export async function DELETE(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const turnoId = getId(req);
    const turno = await prisma.turno.findFirst({
      where: { id: turnoId, barberiaId: session.user.id },
    });

    if (!turno) {
      return NextResponse.json(
        { error: "Turno no encontrado" },
        { status: 404 }
      );
    }

    // No borramos, marcamos como cancelado
    await prisma.turno.update({
      where: { id: turnoId },
      data: { estado: "CANCELADO" },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error al cancelar turno:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}