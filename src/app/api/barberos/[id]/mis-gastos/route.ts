import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const gastos = await prisma.gastoBarbero.findMany({
      where: { barberoId: params.id },
      orderBy: { fecha: "desc" },
    });
    return NextResponse.json({ gastos });
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
    const { nombre, monto, categoria } = await req.json();

    if (!nombre || !monto || !categoria) {
      return NextResponse.json(
        { error: "Nombre, monto y categoria son obligatorios" },
        { status: 400 }
      );
    }

    const gasto = await prisma.gastoBarbero.create({
      data: {
        nombre,
        monto: Number(monto),
        categoria,
        barberoId: params.id,
      },
    });

    return NextResponse.json({ ok: true, gasto });
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
    const { gastoId } = await req.json();
    await prisma.gastoBarbero.delete({ where: { id: gastoId } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}