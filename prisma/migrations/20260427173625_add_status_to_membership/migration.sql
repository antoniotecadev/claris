-- CreateEnum
CREATE TYPE "MembershipStatus" AS ENUM ('NORMAL', 'PENDING', 'ACCEPTED', 'DECLINED');

-- AlterTable
ALTER TABLE "Membership" ADD COLUMN     "status" "MembershipStatus" NOT NULL DEFAULT 'NORMAL';
