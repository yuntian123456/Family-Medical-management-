import express, { Request, Response } from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import * as familyMemberService from '../services/familyMemberService';

const router = express.Router();

// Helper function to validate date format (YYYY-MM-DD) and validity
const isValidDate = (dateString: string): boolean => {
  // Regex to check YYYY-MM-DD format
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateString)) {
    return false;
  }
  // Check if the date is valid (e.g., not 2023-02-30)
  const date = new Date(dateString);
  return !isNaN(date.getTime()) && date.toISOString().startsWith(dateString);
};

// Apply authMiddleware to all routes in this router
router.use(authMiddleware);

// POST /family-members
router.post('/', async (req: Request, res: Response) => {
  try {
    const userId = req.userId!; // userId is guaranteed by authMiddleware
    const { name, relation, dateOfBirth } = req.body;

    if (!name || !relation || !dateOfBirth) {
      return res.status(400).json({ error: 'Name, relation, and dateOfBirth are required' });
    }

    if (!isValidDate(dateOfBirth)) {
      return res.status(400).json({ error: 'Invalid dateOfBirth format. Please use YYYY-MM-DD.' });
    }

    const member = await familyMemberService.addFamilyMember(userId, { name, relation, dateOfBirth });
    res.status(201).json(member);
  } catch (error) {
    console.error('Error adding family member:', error);
    res.status(500).json({ error: 'Failed to add family member' });
  }
});

// GET /family-members
router.get('/', async (req: Request, res: Response) => {
  try {
    const userId = req.userId!;
    const members = await familyMemberService.getFamilyMembers(userId);
    res.status(200).json(members);
  } catch (error) {
    console.error('Error fetching family members:', error);
    res.status(500).json({ error: 'Failed to fetch family members' });
  }
});

// GET /family-members/:memberId
router.get('/:memberId', async (req: Request, res: Response) => {
  try {
    const userId = req.userId!;
    const memberId = parseInt(req.params.memberId, 10);

    if (isNaN(memberId)) {
      return res.status(400).json({ error: 'Invalid member ID' });
    }

    const member = await familyMemberService.getFamilyMemberById(userId, memberId);
    if (!member) {
      return res.status(404).json({ error: 'Family member not found' });
    }
    res.status(200).json(member);
  } catch (error) {
    console.error('Error fetching family member by ID:', error);
    res.status(500).json({ error: 'Failed to fetch family member' });
  }
});

// PUT /family-members/:memberId
router.put('/:memberId', async (req: Request, res: Response) => {
  try {
    const userId = req.userId!;
    const memberId = parseInt(req.params.memberId, 10);
    const { name, relation, dateOfBirth } = req.body;

    if (isNaN(memberId)) {
      return res.status(400).json({ error: 'Invalid member ID' });
    }

    // Ensure at least one field is being updated
    if (!name && !relation && !dateOfBirth) {
      return res.status(400).json({ error: 'No update data provided' });
    }

    if (dateOfBirth && !isValidDate(dateOfBirth)) {
      return res.status(400).json({ error: 'Invalid dateOfBirth format. Please use YYYY-MM-DD.' });
    }

    const updatedMember = await familyMemberService.updateFamilyMember(userId, memberId, { name, relation, dateOfBirth });
    if (!updatedMember) {
      return res.status(404).json({ error: 'Family member not found or not authorized' });
    }
    res.status(200).json(updatedMember);
  } catch (error) {
    console.error('Error updating family member:', error);
    res.status(500).json({ error: 'Failed to update family member' });
  }
});

// DELETE /family-members/:memberId
router.delete('/:memberId', async (req: Request, res: Response) => {
  try {
    const userId = req.userId!;
    const memberId = parseInt(req.params.memberId, 10);

    if (isNaN(memberId)) {
      return res.status(400).json({ error: 'Invalid member ID' });
    }

    const deletedMember = await familyMemberService.deleteFamilyMember(userId, memberId);
    if (!deletedMember) {
      return res.status(404).json({ error: 'Family member not found or not authorized' });
    }
    res.status(200).json({ message: 'Family member deleted successfully' });
  } catch (error) {
    console.error('Error deleting family member:', error);
    res.status(500).json({ error: 'Failed to delete family member' });
  }
});

export default router;
