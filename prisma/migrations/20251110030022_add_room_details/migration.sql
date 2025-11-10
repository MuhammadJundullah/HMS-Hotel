/*
  Warnings:

  - You are about to drop the column `status` on the `Room` table. All the data in the column will be lost.
  - Added the required column `category` to the `Room` table without a default value. This is not possible if the table is not empty.
  - Added the required column `floor` to the `Room` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Room` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "RoomCategory" AS ENUM ('KOSONG', 'TERISI', 'DIBERSIHKAN', 'PERBAIKAN');

-- CreateEnum
CREATE TYPE "RoomType" AS ENUM ('FAMILY', 'EXECUTIVE', 'DELUXE', 'SUPERIOR', 'STANDARD');

-- AlterTable
ALTER TABLE "Room" DROP COLUMN "status",
ADD COLUMN     "category" "RoomCategory" NOT NULL,
ADD COLUMN     "floor" INTEGER NOT NULL,
ADD COLUMN     "type" "RoomType" NOT NULL;

-- DropEnum
DROP TYPE "RoomStatus";
