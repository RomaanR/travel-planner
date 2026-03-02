-- AlterTable
ALTER TABLE "Activity" ADD COLUMN "carDuration" INTEGER;
ALTER TABLE "Activity" ADD COLUMN "carFareCurrency" TEXT;
ALTER TABLE "Activity" ADD COLUMN "carFareEstimate" REAL;
ALTER TABLE "Activity" ADD COLUMN "carFromPrev" TEXT;
ALTER TABLE "Activity" ADD COLUMN "walkDuration" INTEGER;
ALTER TABLE "Activity" ADD COLUMN "walkFromPrev" TEXT;
