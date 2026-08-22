import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

/**
 * Seed default admin and employee accounts if database is empty
 */
const seedDatabase = async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('Seeding default HRMS accounts...');
      const hashedPassword = await bcrypt.hash('password123', 10);

      await User.create([
        {
          employeeId: 'EMP-001',
          name: 'Sarah Connor',
          email: 'admin@dayflow.com',
          password: hashedPassword,
          role: 'Admin',
          department: 'Human Resources',
          designation: 'HR Director',
          phone: '+15550192834',
          address: '100 Cyberdyne Way, Tech City',
        },
        {
          employeeId: 'EMP-002',
          name: 'Alex Mercer',
          email: 'employee@dayflow.com',
          password: hashedPassword,
          role: 'Employee',
          department: 'Engineering',
          designation: 'Senior Software Engineer',
          phone: '+15550192835',
          address: '200 Innovation Blvd, Tech City',
        },
      ]);
      console.log('Default accounts created successfully:');
      console.log(' - Admin: admin@dayflow.com / password123');
      console.log(' - Employee: employee@dayflow.com / password123');
    }
  } catch (err) {
    console.error('Database seeding error:', err.message);
  }
};

/**
 * Connect to MongoDB database using Mongoose
 * Gracefully falls back to MongoMemoryServer if local Mongo service is not running.
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 3000,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    await seedDatabase();
  } catch (error) {
    console.warn(`Local MongoDB connection failed (${error.message}). Initializing In-Memory MongoDB...`);
    try {
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      const mongoServer = await MongoMemoryServer.create({
        binary: {
          version: '6.0.14',
        },
      });
      const mongoUri = mongoServer.getUri();
      const conn = await mongoose.connect(mongoUri);
      console.log(`MongoDB In-Memory Server Connected successfully!`);
      await seedDatabase();
    } catch (memErr) {
      console.error(`Database Connection Failed: ${memErr.message}`);
      process.exit(1);
    }
  }
};

export default connectDB;
