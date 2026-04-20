import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// PATCH — editar barbero
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { nombre, especialidad, foto, activo } = await req.json();

    // Verificar que el barbero pertenece a esta barbería
    const barbero = await prisma.barbero.findFirst({
      where: { id: params.id, barberiaId: session.user.id },
    });

    if (!barbero) {
      return NextResponse.json(
        { error: "Barbero no encontrado" },
        { status: 404 }
      );
    }

    const actualizado = await prisma.barbero.update({
      where: { id: params.id },
      data: {
        nombre: nombre ?? barbero.nombre,
        especialidad: especialidad ?? barbero.especialidad,
        foto: foto ?? barbero.foto,
        activo: activo ?? barbero.activo,
      },
    });

    return NextResponse.json({ ok: true, barbero: actualizado });
  } catch (error) {
    console.error("Error al editar barbero:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

// DELETE — eliminar barbero
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const barbero = await prisma.barbero.findFirst({
      where: { id: params.id, barberiaId: session.user.id },
    });

    if (!barbero) {
      return NextResponse.json(
        { error: "Barbero no encontrado" },
        { status: 404 }
      );
    }

    await prisma.barbero.delete({ where: { id: params.id } });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error al eliminar barbero:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}