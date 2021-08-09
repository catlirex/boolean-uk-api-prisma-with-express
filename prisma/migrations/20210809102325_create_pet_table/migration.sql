-- CreateTable
CREATE TABLE "Pet" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "breed" TEXT NOT NULL,
    "microchip" BOOLEAN NOT NULL,

    PRIMARY KEY ("id")
);
