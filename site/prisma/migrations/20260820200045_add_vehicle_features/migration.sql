-- AlterTable
ALTER TABLE "Vehicle" ADD COLUMN     "features" TEXT[] DEFAULT ARRAY[]::TEXT[];
