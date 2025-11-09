/*
  Warnings:

  - You are about to drop the column `cleanliness` on the `Room` table. All the data in the column will be lost.
  - Changed the type of `status` on the `Room` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "RoomStatus" AS ENUM ('TERSEDIA', 'DIBERSIHKAN', 'DIPESAN');

-- AlterTable
ALTER TABLE "Room" DROP COLUMN "cleanliness",
DROP COLUMN "status",
ADD COLUMN     "status" "RoomStatus" NOT NULL;
