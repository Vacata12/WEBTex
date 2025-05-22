const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);
const dbName = 'demoDB';

async function seedData() {
    try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection('users');

        // Generate 100,000 documents
        const mockData = [];
        for (let i = 0; i < 100000; i++) {
            mockData.push({
                name: `User ${i}`,
                age: Math.floor(Math.random() * 100),
                score: Math.random() * 100,
                createdAt: new Date(),
            });
        }

        await collection.insertMany(mockData);
        console.log('Seed data inserted successfully.');
    } catch (err) {
        console.error(err);
    } finally {
        await client.close();
    }
}

seedData();