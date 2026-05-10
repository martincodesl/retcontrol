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

    const barberia = await prisma.barberia.findFirst({
      where: {
        subdominio: { equals: subdominio, mode: "insensitive" },
      },
      select: {
        id: true,
        nombre: true,
        subdominio: true,
        descripcion: true,
        slogan: true,
        direccion: true,
        telefono: true,
        colorPrimario: true,
        colorSecundario: true,
        colorFondo: true,
        colorTexto: true,
        logoUrl: true,
        heroFotoUrl: true,
        heroTitulo: true,
        heroDescripcion: true,
        activa: true,
        barberos: {
          where: { activo: true },
          select: { id: true, nombre: true, especialidad: true },
        },
        servicios: {
          where: { activo: true },
          select: { id: true, nombre: true, precio: true, duracion: true, color: true, descripcion: true },
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