import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

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

export async function PATCH(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { nombre, slogan, descripcion, direccion, telefono } = await req.json();

    const barberia = await prisma.barberia.update({
      where: { id: session.user.id },
      data: {
        nombre:      nombre      || undefined,
        slogan:      slogan      || undefined,
        descripcion: descripcion || undefined,
        direccion:   direccion   || undefined,
        telefono:    telefono    || undefined,
      },
    });

    return NextResponse.json({ ok: true, barberia });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}