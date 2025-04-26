import mongoose from 'mongoose';
import dbConfig from '../config/db';

// Connect to MongoDB
const connectDB = async (): Promise<void> => {
  try {
    // Correct way to use mongoose.connect with the configuration
    await mongoose.connect(dbConfig.connectionString, dbConfig.options);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection failed:', error);
    process.exit(1);
  }
};

// Handle connection events
mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.warn('MongoDB disconnected');
});

process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('MongoDB connection closed due to app termination');
  process.exit(0);
});

export default connectDB;
