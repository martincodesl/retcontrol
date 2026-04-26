import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(req.url);
    const desde = searchParams.get("desde");
    const hasta  = searchParams.get("hasta");

    const where: any = { barberoId: params.id };

    if (desde && hasta) {
      where.fecha = {
        gte: new Date(desde + "T00:00:00.000Z"),
        lte: new Date(hasta  + "T23:59:59.999Z"),
      };
    }

    const gastos = await prisma.gastoBarbero.findMany({
      where,
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