-- AlterTable
ALTER TABLE "Message" ADD COLUMN "recipientId" TEXT,
ADD COLUMN "readAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "Friendship" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "userAId" TEXT NOT NULL,
    "userBId" TEXT NOT NULL,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Friendship_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Friendship_organizationId_userAId_userBId_key" ON "Friendship"("organizationId", "userAId", "userBId");

-- CreateIndex
CREATE INDEX "Friendship_organizationId_userAId_idx" ON "Friendship"("organizationId", "userAId");

-- CreateIndex
CREATE INDEX "Friendship_organizationId_userBId_idx" ON "Friendship"("organizationId", "userBId");

-- CreateIndex
CREATE INDEX "Friendship_createdById_idx" ON "Friendship"("createdById");

-- CreateIndex
CREATE INDEX "Message_organizationId_senderId_recipientId_createdAt_idx" ON "Message"("organizationId", "senderId", "recipientId", "createdAt");

-- CreateIndex
CREATE INDEX "Message_organizationId_recipientId_senderId_createdAt_idx" ON "Message"("organizationId", "recipientId", "senderId", "createdAt");

-- AddForeignKey
ALTER TABLE "Friendship" ADD CONSTRAINT "Friendship_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Friendship" ADD CONSTRAINT "Friendship_userAId_fkey" FOREIGN KEY ("userAId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Friendship" ADD CONSTRAINT "Friendship_userBId_fkey" FOREIGN KEY ("userBId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Friendship" ADD CONSTRAINT "Friendship_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
