import express, { Request, Response } from 'express';
import { register, login } from '../auth';

const router = express.Router();

// Simple email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

router.post('/register', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Basic presence check
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Email format validation
    if (typeof email !== 'string' || !emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Password length validation
    if (typeof password !== 'string' || password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters long' });
    }

    const user = await register(email, password);
    res.status(201).json(user);
  } catch (error) {
    if (error instanceof Error) {
      // Check for specific error messages from the auth service (e.g., "Email already in use")
      if (error.message === 'Email already in use') {
        return res.status(409).json({ error: error.message }); // 409 Conflict
      }
      return res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unexpected error occurred during registration' });
    }
  }
});

router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // It's good practice to also validate login inputs, though perhaps less strictly than registration.
    // For example, checking if email is a string.
    if (typeof email !== 'string' || typeof password !== 'string') {
        return res.status(400).json({ error: 'Invalid input types for email or password' });
    }

    const token = await login(email, password);
    res.status(200).json({ token });
  } catch (error) {
    if (error instanceof Error) {
      // "Invalid credentials" is a common message here.
      return res.status(401).json({ error: error.message }); // 401 Unauthorized for login failures
    } else {
      res.status(500).json({ error: 'An unexpected error occurred during login' });
    }
  }
});

export default router;
