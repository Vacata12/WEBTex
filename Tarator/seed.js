const { MongoClient } = require('mongodb');

const url = 'mongodb://localhost:27017';
const dbName = 'demoDB';

async function seed() {
    const client = new MongoClient(url);
    try {
        await client.connect();
        console.log('Connected to MongoDB');

        const db = client.db(dbName);
        const collection = db.collection('users');

        // Clear existing data
        await collection.deleteMany({});

        const batchSize = 10000; // Insert in batches for better performance
        const totalRecords = 1000000; // 1 million records
        
        for (let i = 0; i < totalRecords; i += batchSize) {
            const batch = [];
            for (let j = 0; j < batchSize && (i + j) < totalRecords; j++) {
                const user = {
                    name: `User ${i + j}`,
                    email: `user${i + j}@example.com`,
                    age: Math.floor(Math.random() * 80) + 18,
                    registerDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
                    score: Math.floor(Math.random() * 100),
                    active: Math.random() > 0.2
                };
                batch.push(user);
            }
            
            await collection.insertMany(batch);
            console.log(`Inserted ${Math.min(i + batchSize, totalRecords)} / ${totalRecords} records`);
        }

        console.log('Seeding completed successfully');
    } catch (err) {
        console.error('Error seeding database:', err);
    } finally {
        await client.close();
    }
}

seed();