-- CreateTable
CREATE TABLE "MedicalRecord" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "recordType" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "attachments" TEXT,
    "familyMemberId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "MedicalRecord_familyMemberId_fkey" FOREIGN KEY ("familyMemberId") REFERENCES "FamilyMember" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
