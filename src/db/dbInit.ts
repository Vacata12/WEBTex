import connectDB from './connection';
import User from '../models/userModel';
import StorageQuota from '../models/storageQuotaModel';
import File from '../models/fileModel';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dbConfig from '../config/db';

const initializeDatabase = async (): Promise<void> => {
  try {
    
    await connectDB();
    console.log('Connected to MongoDB');

   
    const userCount = await User.countDocuments();
    if (userCount > 0) {
      console.log(`Database already contains ${userCount} users. Skipping initialization.`);
      return;
    }

    
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const adminUser = new User({
      firstName: 'Admin',
      lastName: 'User',
      username: 'admin',
      email: 'admin@example.com',
      password: hashedPassword,
      isVerified: true
    });

    const savedUser = await adminUser.save();
    console.log('Created default admin user');

    
    const adminQuota = new StorageQuota({
      userId: savedUser._id,
      totalSpace: dbConfig.storageQuotas.business,
      usedSpace: 0,
      plan: 'business'
    });

    await adminQuota.save();
    console.log('Created default admin storage quota');

   
    const rootDir = new File({
      name: 'root',
      type: 'directory',
      path: '/',
      owner: savedUser._id,
      parent: null,
      isPublic: false,
      originalName: 'root'
    });

    await rootDir.save();
    console.log('Created root directory for admin user');

    console.log('Database initialization completed successfully');
  } catch (error) {
    console.error('Database initialization failed:', error);
  } finally {
    
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
};


if (require.main === module) {
  initializeDatabase();
}

export default initializeDatabase;
