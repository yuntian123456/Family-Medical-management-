-- CreateTable
CREATE TABLE "HealthIndicator" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "indicatorType" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "unit" TEXT,
    "date" DATETIME NOT NULL,
    "notes" TEXT,
    "familyMemberId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "HealthIndicator_familyMemberId_fkey" FOREIGN KEY ("familyMemberId") REFERENCES "FamilyMember" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
