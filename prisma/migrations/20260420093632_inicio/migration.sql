-- CreateEnum
CREATE TYPE "Plan" AS ENUM ('STARTER', 'PRO', 'PREMIUM');

-- CreateEnum
CREATE TYPE "EstadoTurno" AS ENUM ('PENDIENTE', 'CONFIRMADO', 'EN_CURSO', 'COMPLETADO', 'CANCELADO');

-- CreateTable
CREATE TABLE "Barberia" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "subdominio" TEXT NOT NULL,
    "slogan" TEXT,
    "descripcion" TEXT,
    "direccion" TEXT,
    "telefono" TEXT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "plan" "Plan" NOT NULL DEFAULT 'STARTER',
    "activa" BOOLEAN NOT NULL DEFAULT true,
    "creadaEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Barberia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Barbero" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "especialidad" TEXT,
    "foto" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "barberiaId" TEXT NOT NULL,

    CONSTRAINT "Barbero_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Horario" (
    "id" TEXT NOT NULL,
    "diaSemana" INTEGER NOT NULL,
    "desde" TEXT NOT NULL,
    "hasta" TEXT NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "barberoId" TEXT NOT NULL,

    CONSTRAINT "Horario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Servicio" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "precio" INTEGER NOT NULL,
    "duracion" INTEGER NOT NULL,
    "color" TEXT NOT NULL DEFAULT '#C9A84C',
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "barberiaId" TEXT NOT NULL,

    CONSTRAINT "Servicio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Turno" (
    "id" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "estado" "EstadoTurno" NOT NULL DEFAULT 'PENDIENTE',
    "clienteNombre" TEXT NOT NULL,
    "clienteEmail" TEXT NOT NULL,
    "clienteTelefono" TEXT,
    "notas" TEXT,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "barberiaId" TEXT NOT NULL,
    "barberoId" TEXT NOT NULL,
    "servicioId" TEXT NOT NULL,

    CONSTRAINT "Turno_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Barberia_subdominio_key" ON "Barberia"("subdominio");

-- CreateIndex
CREATE UNIQUE INDEX "Barberia_email_key" ON "Barberia"("email");

-- AddForeignKey
ALTER TABLE "Barbero" ADD CONSTRAINT "Barbero_barberiaId_fkey" FOREIGN KEY ("barberiaId") REFERENCES "Barberia"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Horario" ADD CONSTRAINT "Horario_barberoId_fkey" FOREIGN KEY ("barberoId") REFERENCES "Barbero"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Servicio" ADD CONSTRAINT "Servicio_barberiaId_fkey" FOREIGN KEY ("barberiaId") REFERENCES "Barberia"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Turno" ADD CONSTRAINT "Turno_barberiaId_fkey" FOREIGN KEY ("barberiaId") REFERENCES "Barberia"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Turno" ADD CONSTRAINT "Turno_barberoId_fkey" FOREIGN KEY ("barberoId") REFERENCES "Barbero"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Turno" ADD CONSTRAINT "Turno_servicioId_fkey" FOREIGN KEY ("servicioId") REFERENCES "Servicio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
