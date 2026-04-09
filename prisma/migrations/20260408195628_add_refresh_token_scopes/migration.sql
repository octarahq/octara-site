-- CreateTable
CREATE TABLE "RefreshTokenScope" (
    "id" TEXT NOT NULL,
    "scope" TEXT NOT NULL,
    "refreshTokenId" TEXT NOT NULL,

    CONSTRAINT "RefreshTokenScope_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "RefreshTokenScope" ADD CONSTRAINT "RefreshTokenScope_refreshTokenId_fkey" FOREIGN KEY ("refreshTokenId") REFERENCES "RefreshToken"("id") ON DELETE CASCADE ON UPDATE CASCADE;
