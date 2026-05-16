-- CreateEnum
CREATE TYPE "TipoInsumo" AS ENUM ('PORCENTAJE', 'UNIDAD', 'FIJO', 'AMORTIZACION');

-- CreateTable
CREATE TABLE "InsumoBarbero" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "tipo" "TipoInsumo" NOT NULL,
    "porcentaje" DOUBLE PRECISION,
    "precioTotal" DOUBLE PRECISION,
    "cantidadTotal" DOUBLE PRECISION,
    "cantidadPorCorte" DOUBLE PRECISION,
    "unidad" TEXT,
    "montoFijo" DOUBLE PRECISION,
    "precioMaquina" DOUBLE PRECISION,
    "cortesDeVida" INTEGER,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "barberoId" TEXT NOT NULL,

    CONSTRAINT "InsumoBarbero_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InsumoServicio" (
    "id" TEXT NOT NULL,
    "insumoId" TEXT NOT NULL,
    "servicioId" TEXT NOT NULL,

    CONSTRAINT "InsumoServicio_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "InsumoBarbero" ADD CONSTRAINT "InsumoBarbero_barberoId_fkey" FOREIGN KEY ("barberoId") REFERENCES "Barbero"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InsumoServicio" ADD CONSTRAINT "InsumoServicio_insumoId_fkey" FOREIGN KEY ("insumoId") REFERENCES "InsumoBarbero"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
