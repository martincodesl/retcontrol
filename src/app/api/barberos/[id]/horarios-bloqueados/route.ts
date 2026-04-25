import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const bloqueados = await prisma.horarioBloqueado.findMany({
      where: {
        barberoId: params.id,
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

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { fecha, motivo } = await req.json();
    if (!fecha) {
      return NextResponse.json({ error: "La fecha es obligatoria" }, { status: 400 });
    }

    // Verificar que no esté ya bloqueado
    const existente = await prisma.horarioBloqueado.findFirst({
      where: {
        barberoId: params.id,
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
        barberoId: params.id,
      },
    });
    return NextResponse.json({ ok: true, bloqueado });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { bloqueadoId } = await req.json();
    await prisma.horarioBloqueado.delete({ where: { id: bloqueadoId } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}