import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

interface MongooseConnectionOptions extends mongoose.ConnectOptions {
  dbName?: string;
  useNewUrlParser?: boolean;
  useUnifiedTopology?: boolean;
  autoIndex?: boolean;
}

const dbConfig = {
  connectionString: process.env.DB_CONN_STRING || '',
  dbName: process.env.DB_NAME || '',
  webAppName: process.env.DB_WEB_APP || '',
  

  options: {
    dbName: process.env.DB_NAME,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    autoIndex: true,
  } as MongooseConnectionOptions,
  
  
  storageQuotas: {
    free: 15 * 1024 * 1024 * 1024,     // 15GB
    premium: 100 * 1024 * 1024 * 1024, // 100GB
    business: 500 * 1024 * 1024 * 1024 // 500GB
  }
};

// Validate essential configuration
if (!dbConfig.connectionString || !dbConfig.dbName) {
  console.error('Database connection string or name is not defined in environment variables');
  process.exit(1);
}

export default dbConfig;
