import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// PATCH — actualizar estado del turno
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { estado } = await req.json();

    const turno = await prisma.turno.findFirst({
      where: { id: params.id, barberiaId: session.user.id },
    });

    if (!turno) {
      return NextResponse.json(
        { error: "Turno no encontrado" },
        { status: 404 }
      );
    }

    const actualizado = await prisma.turno.update({
      where: { id: params.id },
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
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const turno = await prisma.turno.findFirst({
      where: { id: params.id, barberiaId: session.user.id },
    });

    if (!turno) {
      return NextResponse.json(
        { error: "Turno no encontrado" },
        { status: 404 }
      );
    }

    // No borramos, marcamos como cancelado
    await prisma.turno.update({
      where: { id: params.id },
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