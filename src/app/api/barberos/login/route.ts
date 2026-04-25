import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const { subdominio, usuario, pin } = await req.json();

    if (!subdominio || !usuario || !pin) {
      return NextResponse.json(
        { error: "Subdominio, usuario y PIN son obligatorios" },
        { status: 400 }
      );
    }

    // Buscar la barbería por subdominio
    const barberia = await prisma.barberia.findUnique({
      where: { subdominio },
    });

    if (!barberia) {
      return NextResponse.json(
        { error: "Barberia no encontrada" },
        { status: 404 }
      );
    }

    // Buscar el barbero por usuario dentro de esa barbería
    const barbero = await prisma.barbero.findFirst({
      where: {
        usuario: usuario.toLowerCase().trim(),
        barberiaId: barberia.id,
        activo: true,
      },
    });

    if (!barbero) {
      return NextResponse.json(
        { error: "Usuario o PIN incorrecto" },
        { status: 401 }
      );
    }

    // Verificar PIN
    const pinValido = await bcrypt.compare(pin, barbero.pin);
    if (!pinValido) {
      return NextResponse.json(
        { error: "Usuario o PIN incorrecto" },
        { status: 401 }
      );
    }

    return NextResponse.json({
      ok: true,
      barbero: {
        id: barbero.id,
        nombre: barbero.nombre,
        usuario: barbero.usuario,
        especialidad: barbero.especialidad,
        barberiaId: barberia.id,
        barberiaNombre: barberia.nombre,
        barberiaSubdominio: barberia.subdominio,
      },
    });

  } catch (error) {
    console.error("Error en login barbero:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}