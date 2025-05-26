import express, { Request, Response } from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import * as medicalRecordService from '../services/medicalRecordService';

// Ensure mergeParams is true to access :familyMemberId from the parent router
const router = express.Router({ mergeParams: true });

// Apply authMiddleware to all routes in this router
router.use(authMiddleware);

// POST / (relative to /api/family-members/:familyMemberId/medical-records)
router.post('/', async (req: Request, res: Response) => {
  try {
    const userId = req.userId!;
    const familyMemberId = parseInt(req.params.familyMemberId, 10); // Get from parent router params
    const { recordType, description, date, attachments } = req.body;

    if (isNaN(familyMemberId)) {
      return res.status(400).json({ error: 'Invalid familyMemberId' });
    }
    if (!recordType || !description || !date) {
      return res.status(400).json({ error: 'recordType, description, and date are required' });
    }

    const record = await medicalRecordService.addMedicalRecord(userId, familyMemberId, {
      recordType,
      description,
      date,
      attachments,
    });
    res.status(201).json(record);
  } catch (error) {
    if (error instanceof Error && error.message.includes('Family member not found')) {
        return res.status(404).json({ error: error.message});
    }
    console.error('Error adding medical record:', error);
    res.status(500).json({ error: 'Failed to add medical record' });
  }
});

// GET / (relative to /api/family-members/:familyMemberId/medical-records)
router.get('/', async (req: Request, res: Response) => {
  try {
    const userId = req.userId!;
    const familyMemberId = parseInt(req.params.familyMemberId, 10);

    if (isNaN(familyMemberId)) {
      return res.status(400).json({ error: 'Invalid familyMemberId' });
    }

    const records = await medicalRecordService.getMedicalRecords(userId, familyMemberId);
    res.status(200).json(records);
  } catch (error) {
    if (error instanceof Error && error.message.includes('Family member not found')) {
        return res.status(404).json({ error: error.message});
    }
    console.error('Error fetching medical records:', error);
    res.status(500).json({ error: 'Failed to fetch medical records' });
  }
});

// GET /:recordId (relative to /api/family-members/:familyMemberId/medical-records)
router.get('/:recordId', async (req: Request, res: Response) => {
  try {
    const userId = req.userId!;
    const familyMemberId = parseInt(req.params.familyMemberId, 10);
    const recordId = parseInt(req.params.recordId, 10);

    if (isNaN(familyMemberId) || isNaN(recordId)) {
      return res.status(400).json({ error: 'Invalid familyMemberId or recordId' });
    }

    const record = await medicalRecordService.getMedicalRecordById(userId, familyMemberId, recordId);
    if (!record) {
      return res.status(404).json({ error: 'Medical record not found' });
    }
    res.status(200).json(record);
  } catch (error) {
     if (error instanceof Error && error.message.includes('Family member not found')) {
        return res.status(404).json({ error: error.message});
    }
    console.error('Error fetching medical record by ID:', error);
    res.status(500).json({ error: 'Failed to fetch medical record' });
  }
});

// PUT /:recordId (relative to /api/family-members/:familyMemberId/medical-records)
router.put('/:recordId', async (req: Request, res: Response) => {
  try {
    const userId = req.userId!;
    const familyMemberId = parseInt(req.params.familyMemberId, 10);
    const recordId = parseInt(req.params.recordId, 10);
    const data = req.body;

    if (isNaN(familyMemberId) || isNaN(recordId)) {
      return res.status(400).json({ error: 'Invalid familyMemberId or recordId' });
    }
    if (Object.keys(data).length === 0) {
        return res.status(400).json({ error: 'No update data provided' });
    }

    const updatedRecord = await medicalRecordService.updateMedicalRecord(userId, familyMemberId, recordId, data);
    if (!updatedRecord) {
      return res.status(404).json({ error: 'Medical record not found or not authorized' });
    }
    res.status(200).json(updatedRecord);
  } catch (error) {
    if (error instanceof Error && error.message.includes('Family member not found')) {
        return res.status(404).json({ error: error.message});
    }
    console.error('Error updating medical record:', error);
    res.status(500).json({ error: 'Failed to update medical record' });
  }
});

// DELETE /:recordId (relative to /api/family-members/:familyMemberId/medical-records)
router.delete('/:recordId', async (req: Request, res: Response) => {
  try {
    const userId = req.userId!;
    const familyMemberId = parseInt(req.params.familyMemberId, 10);
    const recordId = parseInt(req.params.recordId, 10);

    if (isNaN(familyMemberId) || isNaN(recordId)) {
      return res.status(400).json({ error: 'Invalid familyMemberId or recordId' });
    }

    const deletedRecord = await medicalRecordService.deleteMedicalRecord(userId, familyMemberId, recordId);
    if (!deletedRecord) {
      return res.status(404).json({ error: 'Medical record not found or not authorized' });
    }
    res.status(200).json({ message: 'Medical record deleted successfully' });
  } catch (error) {
    if (error instanceof Error && error.message.includes('Family member not found')) {
        return res.status(404).json({ error: error.message});
    }
    console.error('Error deleting medical record:', error);
    res.status(500).json({ error: 'Failed to delete medical record' });
  }
});

export default router;
