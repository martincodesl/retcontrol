import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const barberos = await prisma.barbero.findMany({
      where: { barberiaId: session.user.id },
      select: {
        id: true,
        nombre: true,
        usuario: true,
        especialidad: true,
        activo: true,
        creadoEn: true,
      },
      orderBy: { creadoEn: "asc" },
    });

    return NextResponse.json({ barberos });
  } catch (error) {
    console.error("Error al obtener barberos:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { nombre, usuario, pin, especialidad } = await req.json();

    if (!nombre || !usuario || !pin) {
      return NextResponse.json(
        { error: "Nombre, usuario y PIN son obligatorios" },
        { status: 400 }
      );
    }

    if (pin.length !== 6 || !/^\d+$/.test(pin)) {
      return NextResponse.json(
        { error: "El PIN debe tener exactamente 6 digitos numericos" },
        { status: 400 }
      );
    }

    // Verificar que el usuario no esté tomado en esta barbería
    const usuarioExistente = await prisma.barbero.findFirst({
      where: { usuario, barberiaId: session.user.id },
    });
    if (usuarioExistente) {
      return NextResponse.json(
        { error: "Ese nombre de usuario ya esta en uso" },
        { status: 400 }
      );
    }

    const hashedPin = await bcrypt.hash(pin, 10);

    const barbero = await prisma.barbero.create({
      data: {
        nombre,
        usuario: usuario.toLowerCase().trim(),
        pin: hashedPin,
        especialidad: especialidad || null,
        barberiaId: session.user.id,
      },
      select: {
        id: true,
        nombre: true,
        usuario: true,
        especialidad: true,
        activo: true,
      },
    });

    return NextResponse.json({ ok: true, barbero });
  } catch (error) {
    console.error("Error al crear barbero:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}