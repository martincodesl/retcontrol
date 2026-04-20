import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";


export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email y contraseña son obligatorios" },
        { status: 400 }
      );
    }

    // Buscar la barbería
    const barberia = await prisma.barberia.findUnique({
      where: { email },
    });

    if (!barberia) {
      return NextResponse.json(
        { error: "Email o contraseña incorrectos" },
        { status: 401 }
      );
    }

    // Verificar contraseña
    const passwordValida = await bcrypt.compare(password, barberia.password);
    if (!passwordValida) {
      return NextResponse.json(
        { error: "Email o contraseña incorrectos" },
        { status: 401 }
      );
    }

    return NextResponse.json({
      ok: true,
      barberia: {
        id: barberia.id,
        nombre: barberia.nombre,
        subdominio: barberia.subdominio,
        email: barberia.email,
        plan: barberia.plan,
      },
    });

  } catch (error) {
    console.error("Error en login:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}