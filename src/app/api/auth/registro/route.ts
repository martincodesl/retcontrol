import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const { nombre, subdominio, email, password, telefono, plan } = await req.json();

    // Validaciones básicas
    if (!nombre || !subdominio || !email || !password) {
      return NextResponse.json(
        { error: "Faltan campos obligatorios" },
        { status: 400 }
      );
    }

    // Verificar que el subdominio no esté tomado
    const subdominioExistente = await prisma.barberia.findUnique({
      where: { subdominio },
    });
    if (subdominioExistente) {
      return NextResponse.json(
        { error: "El subdominio ya está en uso" },
        { status: 400 }
      );
    }

    // Verificar que el email no esté registrado
    const emailExistente = await prisma.barberia.findUnique({
      where: { email },
    });
    if (emailExistente) {
      return NextResponse.json(
        { error: "El email ya está registrado" },
        { status: 400 }
      );
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear la barbería
    const barberia = await prisma.barberia.create({
      data: {
        nombre,
        subdominio: subdominio.toLowerCase().trim(),
        email,
        password: hashedPassword,
        telefono: telefono || null,
        plan: plan || "STARTER",
      },
    });

    return NextResponse.json({
      ok: true,
      barberia: {
        id: barberia.id,
        nombre: barberia.nombre,
        subdominio: barberia.subdominio,
        email: barberia.email,
      },
    });

  } catch (error) {
    console.error("Error en registro:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}