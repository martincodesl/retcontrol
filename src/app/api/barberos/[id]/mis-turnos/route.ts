import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(req.url);
    const fecha     = searchParams.get("fecha");
    const desde     = searchParams.get("desde");
    const hasta     = searchParams.get("hasta");

    const where: any = { barberoId: params.id };

    if (fecha) {
      // Filtro por día específico
      const inicio = new Date(fecha);
      inicio.setHours(0, 0, 0, 0);
      const fin = new Date(fecha);
      fin.setHours(23, 59, 59, 999);
      where.fecha = { gte: inicio, lte: fin };
    } else if (desde && hasta) {
      // Filtro por período personalizado
      const inicio = new Date(desde);
      inicio.setHours(0, 0, 0, 0);
      const fin = new Date(hasta);
      fin.setHours(23, 59, 59, 999);
      where.fecha = { gte: inicio, lte: fin };
    } else {
      // Default: mes actual
      const ahora = new Date();
      const inicio = new Date(ahora.getFullYear(), ahora.getMonth(), 1);
      const fin = new Date(ahora.getFullYear(), ahora.getMonth() + 1, 0, 23, 59, 59);
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