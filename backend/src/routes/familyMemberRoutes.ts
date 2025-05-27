import express, { Request, Response, NextFunction } from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import * as familyMemberService from '../services/familyMemberService';

const router = express.Router();

// Apply authMiddleware to all routes in this router
router.use(authMiddleware);

// POST /family-members
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId!; // userId is guaranteed by authMiddleware
    const { name, relation, dateOfBirth } = req.body;

    if (!name || !relation || !dateOfBirth) {
      // Specific client error, handle directly
      return res.status(400).json({ error: 'Name, relation, and dateOfBirth are required' });
    }
    if (typeof name !== 'string' || typeof relation !== 'string' || typeof dateOfBirth !== 'string') {
        return res.status(400).json({ error: 'Invalid data types for name, relation, or dateOfBirth' });
    }
    // Validate dateOfBirth format (simple check, can be made more robust)
    if (isNaN(new Date(dateOfBirth).getTime())) {
        return res.status(400).json({ error: 'Invalid dateOfBirth format. Please use a valid date string.' });
    }


    const member = await familyMemberService.addFamilyMember(userId, { name, relation, dateOfBirth });
    res.status(201).json(member);
  } catch (error) {
    // Pass other errors to the centralized error handler
    next(error);
  }
});

// GET /family-members
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId!;
    const members = await familyMemberService.getFamilyMembers(userId);
    res.status(200).json(members);
  } catch (error) {
    next(error);
  }
});

// GET /family-members/:memberId
router.get('/:memberId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId!;
    const memberId = parseInt(req.params.memberId, 10);

    if (isNaN(memberId)) {
      return res.status(400).json({ error: 'Invalid member ID' });
    }

    const member = await familyMemberService.getFamilyMemberById(userId, memberId);
    if (!member) {
      // Specific "not found" case
      return res.status(404).json({ error: 'Family member not found' });
    }
    res.status(200).json(member);
  } catch (error) {
    next(error);
  }
});

// PUT /family-members/:memberId
router.put('/:memberId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId!;
    const memberId = parseInt(req.params.memberId, 10);
    const { name, relation, dateOfBirth } = req.body;

    if (isNaN(memberId)) {
      return res.status(400).json({ error: 'Invalid member ID' });
    }
    
    if (!name && !relation && !dateOfBirth) {
      return res.status(400).json({ error: 'No update data provided. At least one field (name, relation, dateOfBirth) must be present.' });
    }
    
    // Optional: Add type validation for provided fields
    if (name !== undefined && typeof name !== 'string') {
        return res.status(400).json({ error: 'Invalid data type for name.' });
    }
    if (relation !== undefined && typeof relation !== 'string') {
        return res.status(400).json({ error: 'Invalid data type for relation.' });
    }
    if (dateOfBirth !== undefined) {
        if (typeof dateOfBirth !== 'string' || isNaN(new Date(dateOfBirth).getTime())) {
             return res.status(400).json({ error: 'Invalid dateOfBirth format. Please use a valid date string.' });
        }
    }

    const updatedMember = await familyMemberService.updateFamilyMember(userId, memberId, { name, relation, dateOfBirth });
    
    if (!updatedMember) {
      // This implies the service layer handled the "not found or not authorized" case by returning null
      // The service could also throw a custom error that the centralized handler would catch.
      // For now, keeping the 404 here as per original logic for updateFamilyMember.
      return res.status(404).json({ error: 'Family member not found or not authorized for update' });
    }
    res.status(200).json(updatedMember);
  } catch (error) {
    next(error);
  }
});

// DELETE /family-members/:memberId
router.delete('/:memberId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId!;
    const memberId = parseInt(req.params.memberId, 10);

    if (isNaN(memberId)) {
      return res.status(400).json({ error: 'Invalid member ID' });
    }

    const deletedMember = await familyMemberService.deleteFamilyMember(userId, memberId);
    if (!deletedMember) {
      // Similar to PUT, keeping the 404 logic here for now.
      return res.status(404).json({ error: 'Family member not found or not authorized for deletion' });
    }
    res.status(200).json({ message: 'Family member deleted successfully' });
  } catch (error) {
    next(error);
  }
});

export default router;
