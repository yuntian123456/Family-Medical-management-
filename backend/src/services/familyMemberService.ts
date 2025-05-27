import { PrismaClient, FamilyMember } from '@prisma/client';

const prisma = new PrismaClient();

interface FamilyMemberData {
  name: string;
  relation: string;
  dateOfBirth: string | Date; // Allow string for input, convert to Date
}

export const addFamilyMember = async (userId: number, data: FamilyMemberData): Promise<FamilyMember> => {
  const dateOfBirth = new Date(data.dateOfBirth);
  if (isNaN(dateOfBirth.getTime())) {
    throw new Error('Invalid date format for dateOfBirth');
  }
  return prisma.familyMember.create({
    data: {
      ...data,
      dateOfBirth,
      userId,
    },
  });
};

export const getFamilyMembers = async (userId: number): Promise<FamilyMember[]> => {
  return prisma.familyMember.findMany({
    where: { userId },
  });
};

export const getFamilyMemberById = async (userId: number, memberId: number): Promise<FamilyMember | null> => {
  return prisma.familyMember.findFirst({
    where: { id: memberId, userId },
  });
};

export const updateFamilyMember = async (
  userId: number,
  memberId: number,
  data: Partial<FamilyMemberData>
): Promise<FamilyMember | null> => {
  // First, verify the family member belongs to the user
  const existingMember = await prisma.familyMember.findFirst({
    where: { id: memberId, userId },
  });

  if (!existingMember) {
    return null; // Or throw an error: throw new Error('Family member not found or not authorized');
  }

  const updateData: Partial<FamilyMemberData> & { dateOfBirth?: Date } = { ...data };

  if (data.dateOfBirth) {
    const dateOfBirth = new Date(data.dateOfBirth);
    if (isNaN(dateOfBirth.getTime())) {
      throw new Error('Invalid date format for dateOfBirth');
    }
    updateData.dateOfBirth = dateOfBirth;
  }

  return prisma.familyMember.update({
    where: { id: memberId }, // No need to re-check userId here due to the above check
    data: updateData,
  });
};

export const deleteFamilyMember = async (userId: number, memberId: number): Promise<FamilyMember | null> => {
  // First, verify the family member belongs to the user
  const existingMember = await prisma.familyMember.findFirst({
    where: { id: memberId, userId },
  });

  if (!existingMember) {
    return null; // Or throw an error: throw new Error('Family member not found or not authorized');
  }

  return prisma.familyMember.delete({
    where: { id: memberId }, // No need to re-check userId here
  });
};
