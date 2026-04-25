import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { nombre, usuario, pin, especialidad, activo } = await req.json();

    const barbero = await prisma.barbero.findFirst({
      where: { id: params.id, barberiaId: session.user.id },
    });

    if (!barbero) {
      return NextResponse.json({ error: "Barbero no encontrado" }, { status: 404 });
    }

    const data: any = {};
    if (nombre !== undefined)      data.nombre = nombre;
    if (usuario !== undefined)     data.usuario = usuario.toLowerCase().trim();
    if (especialidad !== undefined) data.especialidad = especialidad;
    if (activo !== undefined)      data.activo = activo;
    if (pin !== undefined) {
      if (pin.length !== 6 || !/^\d+$/.test(pin)) {
        return NextResponse.json(
          { error: "El PIN debe tener exactamente 6 digitos numericos" },
          { status: 400 }
        );
      }
      data.pin = await bcrypt.hash(pin, 10);
    }

    const actualizado = await prisma.barbero.update({
      where: { id: params.id },
      data,
      select: {
        id: true,
        nombre: true,
        usuario: true,
        especialidad: true,
        activo: true,
      },
    });

    return NextResponse.json({ ok: true, barbero: actualizado });
  } catch (error) {
    console.error("Error al editar barbero:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

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
      return NextResponse.json({ error: "Barbero no encontrado" }, { status: 404 });
    }

    await prisma.barbero.delete({ where: { id: params.id } });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error al eliminar barbero:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}