import { PrismaClient, User } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

// JWT Secret Configuration
let JWT_SECRET = process.env.JWT_SECRET;
const DEFAULT_JWT_SECRET = 'your-secret-key';

if (!JWT_SECRET) {
  console.warn(
    'Warning: JWT_SECRET is not set in environment variables. Using default secret. ' +
    'This is NOT secure for production. Please set a strong, unique JWT_SECRET.'
  );
  JWT_SECRET = DEFAULT_JWT_SECRET;
} else if (JWT_SECRET === DEFAULT_JWT_SECRET) {
  console.warn(
    'Warning: JWT_SECRET is set to the default insecure value. ' +
    'This is NOT secure for production. Please set a strong, unique JWT_SECRET.'
  );
}

if (process.env.NODE_ENV === 'production') {
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET === DEFAULT_JWT_SECRET) {
    console.error(
      'CRITICAL ERROR: JWT_SECRET is not set or is using the default insecure value in a production environment. ' +
      'Application will now exit. Please set a strong, unique JWT_SECRET environment variable.'
    );
    process.exit(1); // Exit the application
  }
}


export const register = async (email: string, password: string): Promise<Omit<User, 'password'>> => {
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new Error('Email already in use');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

export const login = async (email: string, password: string): Promise<string> => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new Error('Invalid credentials');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error('Invalid credentials');
  }

  const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET!, { // Non-null assertion as process would exit if null in prod
    expiresIn: '1h', // Token expires in 1 hour
  });

  return token;
};
