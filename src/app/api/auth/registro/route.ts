import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Test 1: Ver si llega el body
    console.log("Body recibido:", body);
    
    // Test 2: Ver si Prisma se puede importar
    const { prisma } = await import("@/lib/prisma");
    console.log("Prisma importado OK");
    
    // Test 3: Ver si la DB responde
    const count = await prisma.barberia.count();
    console.log("DB responde OK, count:", count);
    
    // Test 4: Ver si bcrypt funciona
    const bcrypt = await import("bcryptjs");
    const hash = await bcrypt.hash("test", 10);
    console.log("bcrypt OK:", hash.slice(0, 10));

    return NextResponse.json({ ok: true, count });
    
  } catch (error) {
    console.error("ERROR DETALLADO:", error);
    return NextResponse.json({
      error: String(error),
      stack: error instanceof Error ? error.stack : "no stack",
    }, { status: 500 });
  }
}