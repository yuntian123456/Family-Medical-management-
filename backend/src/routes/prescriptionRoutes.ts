import express, { Request, Response } from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import * as prescriptionService from '../services/prescriptionService';

// Ensure mergeParams is true to access :familyMemberId from the parent router
const router = express.Router({ mergeParams: true });

// Apply authMiddleware to all routes in this router
router.use(authMiddleware);

// POST / (relative to /api/family-members/:familyMemberId/prescriptions)
router.post('/', async (req: Request, res: Response) => {
  try {
    const userId = req.userId!;
    const familyMemberId = parseInt(req.params.familyMemberId, 10);
    const { medicationName, dosage, frequency, startDate, endDate, notes } = req.body;

    if (isNaN(familyMemberId)) {
      return res.status(400).json({ error: 'Invalid familyMemberId' });
    }
    if (!medicationName || !dosage || !frequency || !startDate) {
      return res.status(400).json({ error: 'medicationName, dosage, frequency, and startDate are required' });
    }

    const prescription = await prescriptionService.addPrescription(userId, familyMemberId, {
      medicationName,
      dosage,
      frequency,
      startDate,
      endDate,
      notes,
    });
    res.status(201).json(prescription);
  } catch (error) {
    if (error instanceof Error && error.message.includes('Family member not found')) {
        return res.status(404).json({ error: error.message});
    }
    console.error('Error adding prescription:', error);
    res.status(500).json({ error: 'Failed to add prescription' });
  }
});

// GET / (relative to /api/family-members/:familyMemberId/prescriptions)
router.get('/', async (req: Request, res: Response) => {
  try {
    const userId = req.userId!;
    const familyMemberId = parseInt(req.params.familyMemberId, 10);

    if (isNaN(familyMemberId)) {
      return res.status(400).json({ error: 'Invalid familyMemberId' });
    }

    const prescriptions = await prescriptionService.getPrescriptions(userId, familyMemberId);
    res.status(200).json(prescriptions);
  } catch (error) {
    if (error instanceof Error && error.message.includes('Family member not found')) {
        return res.status(404).json({ error: error.message});
    }
    console.error('Error fetching prescriptions:', error);
    res.status(500).json({ error: 'Failed to fetch prescriptions' });
  }
});

// GET /:prescriptionId (relative to /api/family-members/:familyMemberId/prescriptions)
router.get('/:prescriptionId', async (req: Request, res: Response) => {
  try {
    const userId = req.userId!;
    const familyMemberId = parseInt(req.params.familyMemberId, 10);
    const prescriptionId = parseInt(req.params.prescriptionId, 10);

    if (isNaN(familyMemberId) || isNaN(prescriptionId)) {
      return res.status(400).json({ error: 'Invalid familyMemberId or prescriptionId' });
    }

    const prescription = await prescriptionService.getPrescriptionById(userId, familyMemberId, prescriptionId);
    if (!prescription) {
      return res.status(404).json({ error: 'Prescription not found' });
    }
    res.status(200).json(prescription);
  } catch (error) {
     if (error instanceof Error && error.message.includes('Family member not found')) {
        return res.status(404).json({ error: error.message});
    }
    console.error('Error fetching prescription by ID:', error);
    res.status(500).json({ error: 'Failed to fetch prescription' });
  }
});

// PUT /:prescriptionId (relative to /api/family-members/:familyMemberId/prescriptions)
router.put('/:prescriptionId', async (req: Request, res: Response) => {
  try {
    const userId = req.userId!;
    const familyMemberId = parseInt(req.params.familyMemberId, 10);
    const prescriptionId = parseInt(req.params.prescriptionId, 10);
    const data = req.body;

    if (isNaN(familyMemberId) || isNaN(prescriptionId)) {
      return res.status(400).json({ error: 'Invalid familyMemberId or prescriptionId' });
    }
    if (Object.keys(data).length === 0) {
        return res.status(400).json({ error: 'No update data provided' });
    }

    const updatedPrescription = await prescriptionService.updatePrescription(userId, familyMemberId, prescriptionId, data);
    if (!updatedPrescription) {
      return res.status(404).json({ error: 'Prescription not found or not authorized' });
    }
    res.status(200).json(updatedPrescription);
  } catch (error) {
    if (error instanceof Error && error.message.includes('Family member not found')) {
        return res.status(404).json({ error: error.message});
    }
    console.error('Error updating prescription:', error);
    res.status(500).json({ error: 'Failed to update prescription' });
  }
});

// DELETE /:prescriptionId (relative to /api/family-members/:familyMemberId/prescriptions)
router.delete('/:prescriptionId', async (req: Request, res: Response) => {
  try {
    const userId = req.userId!;
    const familyMemberId = parseInt(req.params.familyMemberId, 10);
    const prescriptionId = parseInt(req.params.prescriptionId, 10);

    if (isNaN(familyMemberId) || isNaN(prescriptionId)) {
      return res.status(400).json({ error: 'Invalid familyMemberId or prescriptionId' });
    }

    const deletedPrescription = await prescriptionService.deletePrescription(userId, familyMemberId, prescriptionId);
    if (!deletedPrescription) {
      return res.status(404).json({ error: 'Prescription not found or not authorized' });
    }
    res.status(200).json({ message: 'Prescription deleted successfully' });
  } catch (error) {
    if (error instanceof Error && error.message.includes('Family member not found')) {
        return res.status(404).json({ error: error.message});
    }
    console.error('Error deleting prescription:', error);
    res.status(500).json({ error: 'Failed to delete prescription' });
  }
});

export default router;
