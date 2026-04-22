import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// GET — obtener perfil
export async function GET() {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const barberia = await prisma.barberia.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        nombre: true,
        subdominio: true,
        slogan: true,
        descripcion: true,
        direccion: true,
        telefono: true,
        email: true,
        plan: true,
      },
    });

    return NextResponse.json({ barberia });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

// PATCH — actualizar perfil
export async function GET() {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    console.log("Session user id:", session.user.id);
    console.log("Session completa:", JSON.stringify(session));

    const barberia = await prisma.barberia.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        nombre: true,
        subdominio: true,
        slogan: true,
        descripcion: true,
        direccion: true,
        telefono: true,
        email: true,
        plan: true,
      },
    });

    console.log("Barberia encontrada:", barberia);

    return NextResponse.json({ barberia });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}