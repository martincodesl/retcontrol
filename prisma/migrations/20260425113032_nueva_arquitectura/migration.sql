-- Agregar columnas con valores default temporales
ALTER TABLE "Barbero" ADD COLUMN "usuario" TEXT;
ALTER TABLE "Barbero" ADD COLUMN "pin" TEXT;

-- Asignar valores temporales a los registros existentes
UPDATE "Barbero" SET "usuario" = id, "pin" = '$2a$10$defaultpinhashedvalue123456789012345678901234' WHERE "usuario" IS NULL;

-- Hacer las columnas obligatorias
ALTER TABLE "Barbero" ALTER COLUMN "usuario" SET NOT NULL;
ALTER TABLE "Barbero" ALTER COLUMN "pin" SET NOT NULL;

-- Agregar constraint unique
ALTER TABLE "Barbero" ADD CONSTRAINT "Barbero_usuario_barberiaId_key" UNIQUE ("usuario", "barberiaId");

-- Crear tabla HorarioBloqueado
CREATE TABLE "HorarioBloqueado" (
    "id" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "motivo" TEXT,
    "barberoId" TEXT NOT NULL,
    CONSTRAINT "HorarioBloqueado_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "HorarioBloqueado" ADD CONSTRAINT "HorarioBloqueado_barberoId_fkey" 
    FOREIGN KEY ("barberoId") REFERENCES "Barbero"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Crear tabla GastoBarbero
CREATE TABLE "GastoBarbero" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "monto" INTEGER NOT NULL,
    "categoria" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "barberoId" TEXT NOT NULL,
    CONSTRAINT "GastoBarbero_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "GastoBarbero" ADD CONSTRAINT "GastoBarbero_barberoId_fkey" 
    FOREIGN KEY ("barberoId") REFERENCES "Barbero"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Crear enum CategoriaGasto
CREATE TYPE "CategoriaGasto" AS ENUM ('HERRAMIENTAS', 'PRODUCTOS', 'TRANSPORTE', 'COMIDA', 'ROPA', 'OTROS');