import express from 'express';
import authRoutes from './routes/authRoutes'; // Import auth routes
import familyMemberRoutes from './routes/familyMemberRoutes'; // Import family member routes
import medicalRecordRoutes from './routes/medicalRecordRoutes'; // Import medical record routes
import prescriptionRoutes from './routes/prescriptionRoutes'; // Import prescription routes
import healthIndicatorRoutes from './routes/healthIndicatorRoutes'; // Import health indicator routes
import { errorHandlerMiddleware } from './middleware/errorHandlerMiddleware'; // Import the centralized error handler

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json()); // Middleware to parse JSON bodies

// Mount auth routes
app.use('/api/auth', authRoutes);

// Mount family member routes
app.use('/api/family-members', familyMemberRoutes);

// Mount nested routes for medical records, prescriptions, and health indicators
app.use('/api/family-members/:familyMemberId/medical-records', medicalRecordRoutes);
app.use('/api/family-members/:familyMemberId/prescriptions', prescriptionRoutes);
app.use('/api/family-members/:familyMemberId/health-indicators', healthIndicatorRoutes);


app.get('/health', (req, res) => {
  res.status(200).json({ message: 'Server is healthy!' });
});

// Use the centralized error handling middleware as the last middleware
app.use(errorHandlerMiddleware);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
