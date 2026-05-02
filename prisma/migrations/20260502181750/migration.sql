/*
  Warnings:

  - You are about to drop the column `twofa_enabled` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `twofa_secret` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "twofa_enabled",
DROP COLUMN "twofa_secret",
ADD COLUMN     "birthDate" TIMESTAMP(3),
ADD COLUMN     "gender" TEXT;
