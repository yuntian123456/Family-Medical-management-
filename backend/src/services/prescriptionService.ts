import { PrismaClient, Prescription, FamilyMember } from '@prisma/client';

const prisma = new PrismaClient();

interface PrescriptionData {
  medicationName: string;
  dosage: string;
  frequency: string;
  startDate: string | Date;
  endDate?: string | Date | null;
  notes?: string | null;
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

export const addPrescription = async (
  userId: number,
  familyMemberId: number,
  data: PrescriptionData
): Promise<Prescription> => {
  const familyMember = await verifyFamilyMemberOwnership(userId, familyMemberId);
  if (!familyMember) {
    throw new Error('Family member not found or user not authorized');
  }

  return prisma.prescription.create({
    data: {
      ...data,
      startDate: new Date(data.startDate),
      endDate: data.endDate ? new Date(data.endDate) : null,
      familyMemberId: familyMemberId,
    },
  });
};

export const getPrescriptions = async (userId: number, familyMemberId: number): Promise<Prescription[]> => {
  const familyMember = await verifyFamilyMemberOwnership(userId, familyMemberId);
  if (!familyMember) {
    throw new Error('Family member not found or user not authorized');
  }

  return prisma.prescription.findMany({
    where: { familyMemberId },
  });
};

export const getPrescriptionById = async (
  userId: number,
  familyMemberId: number,
  prescriptionId: number
): Promise<Prescription | null> => {
  const familyMember = await verifyFamilyMemberOwnership(userId, familyMemberId);
  if (!familyMember) {
    throw new Error('Family member not found or user not authorized');
  }

  return prisma.prescription.findFirst({
    where: {
      id: prescriptionId,
      familyMemberId: familyMemberId,
    },
  });
};

export const updatePrescription = async (
  userId: number,
  familyMemberId: number,
  prescriptionId: number,
  data: Partial<PrescriptionData>
): Promise<Prescription | null> => {
  const familyMember = await verifyFamilyMemberOwnership(userId, familyMemberId);
  if (!familyMember) {
    throw new Error('Family member not found or user not authorized');
  }

  const existingPrescription = await prisma.prescription.findFirst({
    where: { id: prescriptionId, familyMemberId: familyMemberId },
  });
  if (!existingPrescription) {
    return null; 
  }

  return prisma.prescription.update({
    where: { id: prescriptionId },
    data: {
      ...data,
      ...(data.startDate && { startDate: new Date(data.startDate) }),
      ...(data.endDate && { endDate: new Date(data.endDate) }),
      ...(data.endDate === null && { endDate: null }), // Explicitly set to null if provided
    },
  });
};

export const deletePrescription = async (
  userId: number,
  familyMemberId: number,
  prescriptionId: number
): Promise<Prescription | null> => {
  const familyMember = await verifyFamilyMemberOwnership(userId, familyMemberId);
  if (!familyMember) {
    throw new Error('Family member not found or user not authorized');
  }

  const existingPrescription = await prisma.prescription.findFirst({
    where: { id: prescriptionId, familyMemberId: familyMemberId },
  });
  if (!existingPrescription) {
    return null;
  }

  return prisma.prescription.delete({
    where: { id: prescriptionId },
  });
};
