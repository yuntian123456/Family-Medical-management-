import { PrismaClient, MedicalRecord, FamilyMember } from '@prisma/client';

const prisma = new PrismaClient();

interface MedicalRecordData {
  recordType: string;
  description: string;
  date: string | Date; // Allow string for input, convert to Date
  attachments?: string;
}

// Helper function to verify family member ownership
const verifyFamilyMemberOwnership = async (userId: number, familyMemberId: number): Promise<FamilyMember | null> => {
  return prisma.familyMember.findFirst({
    where: {
      id: familyMemberId,
      userId: userId,
    },
  });
};

export const addMedicalRecord = async (
  userId: number,
  familyMemberId: number,
  data: MedicalRecordData
): Promise<MedicalRecord> => {
  const familyMember = await verifyFamilyMemberOwnership(userId, familyMemberId);
  if (!familyMember) {
    throw new Error('Family member not found or user not authorized');
  }

  return prisma.medicalRecord.create({
    data: {
      ...data,
      date: new Date(data.date),
      familyMemberId: familyMemberId,
    },
  });
};

export const getMedicalRecords = async (userId: number, familyMemberId: number): Promise<MedicalRecord[]> => {
  const familyMember = await verifyFamilyMemberOwnership(userId, familyMemberId);
  if (!familyMember) {
    throw new Error('Family member not found or user not authorized');
  }

  return prisma.medicalRecord.findMany({
    where: { familyMemberId },
  });
};

export const getMedicalRecordById = async (
  userId: number,
  familyMemberId: number,
  recordId: number
): Promise<MedicalRecord | null> => {
  const familyMember = await verifyFamilyMemberOwnership(userId, familyMemberId);
  if (!familyMember) {
    throw new Error('Family member not found or user not authorized');
  }

  return prisma.medicalRecord.findFirst({
    where: {
      id: recordId,
      familyMemberId: familyMemberId,
    },
  });
};

export const updateMedicalRecord = async (
  userId: number,
  familyMemberId: number,
  recordId: number,
  data: Partial<MedicalRecordData>
): Promise<MedicalRecord | null> => {
  const familyMember = await verifyFamilyMemberOwnership(userId, familyMemberId);
  if (!familyMember) {
    throw new Error('Family member not found or user not authorized');
  }

  // Verify the record itself belongs to the family member (redundant if findFirst above is strict, but good practice)
  const existingRecord = await prisma.medicalRecord.findFirst({
    where: { id: recordId, familyMemberId: familyMemberId },
  });
  if (!existingRecord) {
    return null; // Or throw new Error('Medical record not found');
  }

  return prisma.medicalRecord.update({
    where: { id: recordId },
    data: {
      ...data,
      ...(data.date && { date: new Date(data.date) }),
    },
  });
};

export const deleteMedicalRecord = async (
  userId: number,
  familyMemberId: number,
  recordId: number
): Promise<MedicalRecord | null> => {
  const familyMember = await verifyFamilyMemberOwnership(userId, familyMemberId);
  if (!familyMember) {
    throw new Error('Family member not found or user not authorized');
  }

  const existingRecord = await prisma.medicalRecord.findFirst({
    where: { id: recordId, familyMemberId: familyMemberId },
  });
  if (!existingRecord) {
    return null; // Or throw new Error('Medical record not found');
  }

  return prisma.medicalRecord.delete({
    where: { id: recordId },
  });
};
