require('dotenv').config();

const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017/';
const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    const db = client.db('ivanDB'); // Use your actual database name
    const collection = db.collection('Test');

    // Example: Find first 5 documents (best practice: always use projection in production)
    const docs = await collection.find({}).limit(5).toArray();
    console.log('Sample documents:', docs);
  } catch (err) {
    console.error('MongoDB connection error:', err);
  } finally {
    await client.close();
  }
}

run();