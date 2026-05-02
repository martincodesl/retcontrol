import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // ajustá si tu ruta es distinta

export async function GET(
  req: Request,
  { params }: { params: { subdominio: string } }
) {
  try {
    const subdominio = params.subdominio?.toLowerCase().trim();

    if (!subdominio) {
      return NextResponse.json(
        { error: "Subdominio requerido" },
        { status: 400 }
      );
    }

    const barberia = await prisma.barberia.findUnique({
      where: {
        subdominio,
      },
      include: {
        servicios: {
          where: { activo: true },
          orderBy: { nombre: "asc" },
        },
        barberos: {
          where: { activo: true },
          orderBy: { nombre: "asc" },
        },
      },
    });

    if (!barberia || !barberia.activa) {
      return NextResponse.json(
        { barberia: null },
        { status: 404 }
      );
    }

    return NextResponse.json({ barberia });

  } catch (error) {
    console.error("Error en /api/publico/[subdominio]:", error);

    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}