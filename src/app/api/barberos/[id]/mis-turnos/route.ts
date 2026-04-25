import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(req.url);
    const fecha = searchParams.get("fecha");

    const where: any = { barberoId: params.id };

    if (fecha) {
      const inicio = new Date(fecha);
      inicio.setHours(0, 0, 0, 0);
      const fin = new Date(fecha);
      fin.setHours(23, 59, 59, 999);
      where.fecha = { gte: inicio, lte: fin };
    }

    const turnos = await prisma.turno.findMany({
      where,
      include: {
        servicio: { select: { nombre: true, precio: true, duracion: true } },
      },
      orderBy: { fecha: "asc" },
    });

    return NextResponse.json({ turnos });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}