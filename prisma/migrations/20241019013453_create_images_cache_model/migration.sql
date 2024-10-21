-- CreateTable
CREATE TABLE "ImagesCache" (
    "id" SERIAL NOT NULL,
    "uniqueId" TEXT NOT NULL,
    "data" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ImagesCache_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ImagesCache_uniqueId_key" ON "ImagesCache"("uniqueId");
