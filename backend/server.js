import dotenv from 'dotenv';
import connectDB from './config/db.js';
import app from './app.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB Database
connectDB();

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(
    `HRMS Server running in ${process.env.NODE_ENV || 'development'} mode on http://localhost:${PORT}`
  );
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`Unhandled Rejection Error: ${err.message}`);
  server.close(() => process.exit(1));
});
