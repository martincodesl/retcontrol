import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const insumos = await prisma.insumoBarbero.findMany({
      where: { barberoId: params.id },
      include: { servicios: true },
      orderBy: { creadoEn: "asc" },
    });
    return NextResponse.json({ insumos });
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
    const {
      nombre, tipo, porcentaje, precioTotal, cantidadTotal,
      cantidadPorCorte, unidad, montoFijo, precioMaquina,
      cortesDeVida, serviciosIds,
    } = await req.json();

    if (!nombre || !tipo) {
      return NextResponse.json(
        { error: "Nombre y tipo son obligatorios" },
        { status: 400 }
      );
    }

    const insumo = await prisma.insumoBarbero.create({
      data: {
        nombre,
        tipo,
        porcentaje:      porcentaje      ?? null,
        precioTotal:     precioTotal     ?? null,
        cantidadTotal:   cantidadTotal   ?? null,
        cantidadPorCorte: cantidadPorCorte ?? null,
        unidad:          unidad          ?? null,
        montoFijo:       montoFijo       ?? null,
        precioMaquina:   precioMaquina   ?? null,
        cortesDeVida:    cortesDeVida    ?? null,
        barberoId:       params.id,
        servicios: serviciosIds?.length
          ? { create: serviciosIds.map((sid: string) => ({ servicioId: sid })) }
          : undefined,
      },
      include: { servicios: true },
    });

    return NextResponse.json({ ok: true, insumo });
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
    const { insumoId } = await req.json();

    // Primero eliminar las relaciones
    await prisma.insumoServicio.deleteMany({
      where: { insumoId },
    });

    await prisma.insumoBarbero.delete({
      where: { id: insumoId, barberoId: params.id },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}