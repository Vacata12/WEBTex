// Script to seed the database with sample items

require('dotenv').config();
const { MongoClient } = require('mongodb');
const mongoose = require('mongoose');
const Item = require('./models/Item');

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    const db = client.db('Web');
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

const NUM_ITEMS = 50;

function randomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  await Item.deleteMany({});

  const items = [];
  for (let i = 1; i <= NUM_ITEMS; i++) {
    items.push({
      name: `Item ${i}`,
      value: Math.floor(Math.random() * 200),
      createdAt: randomDate(new Date(Date.now() - 1000 * 60 * 60 * 24 * 30), new Date()) // random date in last 30 days
    });
  }
  await Item.insertMany(items);
  console.log('Database seeded with', NUM_ITEMS, 'items!');
  mongoose.disconnect();
}

seed();
