import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// GET — listar servicios
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const servicios = await prisma.servicio.findMany({
      where: { barberiaId: session.user.id },
      orderBy: { nombre: "asc" },
    });

    return NextResponse.json({ servicios });
  } catch (error) {
    console.error("Error al obtener servicios:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

// POST — crear servicio
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { nombre, descripcion, precio, duracion, color } = await req.json();

    if (!nombre || !precio || !duracion) {
      return NextResponse.json(
        { error: "Nombre, precio y duracion son obligatorios" },
        { status: 400 }
      );
    }

    const servicio = await prisma.servicio.create({
      data: {
        nombre,
        descripcion: descripcion || null,
        precio: Number(precio),
        duracion: Number(duracion),
        color: color || "#C9A84C",
        barberiaId: session.user.id,
      },
    });

    return NextResponse.json({ ok: true, servicio });
  } catch (error) {
    console.error("Error al crear servicio:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}