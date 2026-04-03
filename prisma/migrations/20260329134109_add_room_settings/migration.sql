-- AlterTable
ALTER TABLE "Room" ADD COLUMN     "allowPredictionChange" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "assignRandomPrediction" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "predictionCutoffMinutes" INTEGER NOT NULL DEFAULT 30;
