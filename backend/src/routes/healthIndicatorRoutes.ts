import express, { Request, Response } from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import * as healthIndicatorService from '../services/healthIndicatorService';

// Ensure mergeParams is true to access :familyMemberId from the parent router
const router = express.Router({ mergeParams: true });

// Apply authMiddleware to all routes in this router
router.use(authMiddleware);

// POST / (relative to /api/family-members/:familyMemberId/health-indicators)
router.post('/', async (req: Request, res: Response) => {
  try {
    const userId = req.userId!;
    const familyMemberId = parseInt(req.params.familyMemberId, 10);
    const { indicatorType, value, unit, date, notes } = req.body;

    if (isNaN(familyMemberId)) {
      return res.status(400).json({ error: 'Invalid familyMemberId' });
    }
    if (!indicatorType || !value || !date) {
      return res.status(400).json({ error: 'indicatorType, value, and date are required' });
    }

    const indicator = await healthIndicatorService.addHealthIndicator(userId, familyMemberId, {
      indicatorType,
      value,
      unit,
      date,
      notes,
    });
    res.status(201).json(indicator);
  } catch (error) {
    if (error instanceof Error && error.message.includes('Family member not found')) {
        return res.status(404).json({ error: error.message});
    }
    console.error('Error adding health indicator:', error);
    res.status(500).json({ error: 'Failed to add health indicator' });
  }
});

// GET / (relative to /api/family-members/:familyMemberId/health-indicators)
router.get('/', async (req: Request, res: Response) => {
  try {
    const userId = req.userId!;
    const familyMemberId = parseInt(req.params.familyMemberId, 10);

    if (isNaN(familyMemberId)) {
      return res.status(400).json({ error: 'Invalid familyMemberId' });
    }

    const indicators = await healthIndicatorService.getHealthIndicators(userId, familyMemberId);
    res.status(200).json(indicators);
  } catch (error) {
    if (error instanceof Error && error.message.includes('Family member not found')) {
        return res.status(404).json({ error: error.message});
    }
    console.error('Error fetching health indicators:', error);
    res.status(500).json({ error: 'Failed to fetch health indicators' });
  }
});

// GET /:indicatorId (relative to /api/family-members/:familyMemberId/health-indicators)
router.get('/:indicatorId', async (req: Request, res: Response) => {
  try {
    const userId = req.userId!;
    const familyMemberId = parseInt(req.params.familyMemberId, 10);
    const indicatorId = parseInt(req.params.indicatorId, 10);

    if (isNaN(familyMemberId) || isNaN(indicatorId)) {
      return res.status(400).json({ error: 'Invalid familyMemberId or indicatorId' });
    }

    const indicator = await healthIndicatorService.getHealthIndicatorById(userId, familyMemberId, indicatorId);
    if (!indicator) {
      return res.status(404).json({ error: 'Health indicator not found' });
    }
    res.status(200).json(indicator);
  } catch (error) {
     if (error instanceof Error && error.message.includes('Family member not found')) {
        return res.status(404).json({ error: error.message});
    }
    console.error('Error fetching health indicator by ID:', error);
    res.status(500).json({ error: 'Failed to fetch health indicator' });
  }
});

// PUT /:indicatorId (relative to /api/family-members/:familyMemberId/health-indicators)
router.put('/:indicatorId', async (req: Request, res: Response) => {
  try {
    const userId = req.userId!;
    const familyMemberId = parseInt(req.params.familyMemberId, 10);
    const indicatorId = parseInt(req.params.indicatorId, 10);
    const data = req.body;

    if (isNaN(familyMemberId) || isNaN(indicatorId)) {
      return res.status(400).json({ error: 'Invalid familyMemberId or indicatorId' });
    }
    if (Object.keys(data).length === 0) {
        return res.status(400).json({ error: 'No update data provided' });
    }

    const updatedIndicator = await healthIndicatorService.updateHealthIndicator(userId, familyMemberId, indicatorId, data);
    if (!updatedIndicator) {
      return res.status(404).json({ error: 'Health indicator not found or not authorized' });
    }
    res.status(200).json(updatedIndicator);
  } catch (error) {
    if (error instanceof Error && error.message.includes('Family member not found')) {
        return res.status(404).json({ error: error.message});
    }
    console.error('Error updating health indicator:', error);
    res.status(500).json({ error: 'Failed to update health indicator' });
  }
});

// DELETE /:indicatorId (relative to /api/family-members/:familyMemberId/health-indicators)
router.delete('/:indicatorId', async (req: Request, res: Response) => {
  try {
    const userId = req.userId!;
    const familyMemberId = parseInt(req.params.familyMemberId, 10);
    const indicatorId = parseInt(req.params.indicatorId, 10);

    if (isNaN(familyMemberId) || isNaN(indicatorId)) {
      return res.status(400).json({ error: 'Invalid familyMemberId or indicatorId' });
    }

    const deletedIndicator = await healthIndicatorService.deleteHealthIndicator(userId, familyMemberId, indicatorId);
    if (!deletedIndicator) {
      return res.status(404).json({ error: 'Health indicator not found or not authorized' });
    }
    res.status(200).json({ message: 'Health indicator deleted successfully' });
  } catch (error) {
    if (error instanceof Error && error.message.includes('Family member not found')) {
        return res.status(404).json({ error: error.message});
    }
    console.error('Error deleting health indicator:', error);
    res.status(500).json({ error: 'Failed to delete health indicator' });
  }
});

export default router;
