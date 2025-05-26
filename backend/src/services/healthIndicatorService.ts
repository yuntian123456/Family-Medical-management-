import { PrismaClient, HealthIndicator, FamilyMember } from '@prisma/client';

const prisma = new PrismaClient();

interface HealthIndicatorData {
  indicatorType: string;
  value: string;
  unit?: string | null;
  date: string | Date;
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

export const addHealthIndicator = async (
  userId: number,
  familyMemberId: number,
  data: HealthIndicatorData
): Promise<HealthIndicator> => {
  const familyMember = await verifyFamilyMemberOwnership(userId, familyMemberId);
  if (!familyMember) {
    throw new Error('Family member not found or user not authorized');
  }

  return prisma.healthIndicator.create({
    data: {
      ...data,
      date: new Date(data.date),
      familyMemberId: familyMemberId,
    },
  });
};

export const getHealthIndicators = async (userId: number, familyMemberId: number): Promise<HealthIndicator[]> => {
  const familyMember = await verifyFamilyMemberOwnership(userId, familyMemberId);
  if (!familyMember) {
    throw new Error('Family member not found or user not authorized');
  }

  return prisma.healthIndicator.findMany({
    where: { familyMemberId },
  });
};

export const getHealthIndicatorById = async (
  userId: number,
  familyMemberId: number,
  indicatorId: number
): Promise<HealthIndicator | null> => {
  const familyMember = await verifyFamilyMemberOwnership(userId, familyMemberId);
  if (!familyMember) {
    throw new Error('Family member not found or user not authorized');
  }

  return prisma.healthIndicator.findFirst({
    where: {
      id: indicatorId,
      familyMemberId: familyMemberId,
    },
  });
};

export const updateHealthIndicator = async (
  userId: number,
  familyMemberId: number,
  indicatorId: number,
  data: Partial<HealthIndicatorData>
): Promise<HealthIndicator | null> => {
  const familyMember = await verifyFamilyMemberOwnership(userId, familyMemberId);
  if (!familyMember) {
    throw new Error('Family member not found or user not authorized');
  }

  const existingIndicator = await prisma.healthIndicator.findFirst({
    where: { id: indicatorId, familyMemberId: familyMemberId },
  });
  if (!existingIndicator) {
    return null;
  }

  return prisma.healthIndicator.update({
    where: { id: indicatorId },
    data: {
      ...data,
      ...(data.date && { date: new Date(data.date) }),
    },
  });
};

export const deleteHealthIndicator = async (
  userId: number,
  familyMemberId: number,
  indicatorId: number
): Promise<HealthIndicator | null> => {
  const familyMember = await verifyFamilyMemberOwnership(userId, familyMemberId);
  if (!familyMember) {
    throw new Error('Family member not found or user not authorized');
  }

  const existingIndicator = await prisma.healthIndicator.findFirst({
    where: { id: indicatorId, familyMemberId: familyMemberId },
  });
  if (!existingIndicator) {
    return null;
  }

  return prisma.healthIndicator.delete({
    where: { id: indicatorId },
  });
};
