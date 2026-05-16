import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function getBarberoId(req: NextRequest) {
  const pathParts = new URL(req.url).pathname.split("/").filter(Boolean);
  return pathParts[2];
}

export async function GET(req: NextRequest) {
  try {
    const barberoId = getBarberoId(req);
    const bloqueados = await prisma.horarioBloqueado.findMany({
      where: {
        barberoId,
        fecha: { gte: new Date() },
      },
      orderBy: { fecha: "asc" },
    });
    return NextResponse.json({ bloqueados });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const barberoId = getBarberoId(req);
    const { fecha, motivo } = await req.json();
    if (!fecha) {
      return NextResponse.json({ error: "La fecha es obligatoria" }, { status: 400 });
    }

    // Verificar que no esté ya bloqueado
    const existente = await prisma.horarioBloqueado.findFirst({
      where: {
        barberoId,
        fecha: new Date(fecha),
      },
    });
    if (existente) {
      return NextResponse.json(
        { error: "Ese dia ya esta bloqueado" },
        { status: 400 }
      );
    }

    const bloqueado = await prisma.horarioBloqueado.create({
      data: {
        fecha: new Date(fecha),
        motivo: motivo || null,
        barberoId: barberoId,
      },
    });
    return NextResponse.json({ ok: true, bloqueado });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const barberoId = getBarberoId(req);
    const { bloqueadoId } = await req.json();
    await prisma.horarioBloqueado.delete({ where: { id: bloqueadoId } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}