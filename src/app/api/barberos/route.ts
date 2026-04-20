import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// GET — listar barberos de la barbería
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const barberos = await prisma.barbero.findMany({
      where: { barberiaId: session.user.id },
      orderBy: { creadoEn: "asc" },
    });

    return NextResponse.json({ barberos });
  } catch (error) {
    console.error("Error al obtener barberos:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

// POST — crear nuevo barbero
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { nombre, especialidad, foto } = await req.json();

    if (!nombre) {
      return NextResponse.json(
        { error: "El nombre es obligatorio" },
        { status: 400 }
      );
    }

    const barbero = await prisma.barbero.create({
      data: {
        nombre,
        especialidad: especialidad || null,
        foto: foto || null,
        barberiaId: session.user.id,
      },
    });

    return NextResponse.json({ ok: true, barbero });
  } catch (error) {
    console.error("Error al crear barbero:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}