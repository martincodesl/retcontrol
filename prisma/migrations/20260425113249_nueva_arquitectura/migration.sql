/*
  Warnings:

  - Changed the type of `categoria` on the `GastoBarbero` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "GastoBarbero" DROP COLUMN "categoria",
ADD COLUMN     "categoria" "CategoriaGasto" NOT NULL;
