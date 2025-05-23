const { MongoClient } = require('mongodb');
const fs = require('fs');

const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);
const dbName = 'demoDB';

async function seedDatabase() {
    try {
        await client.connect();
        console.log('Connected to MongoDB');

        const db = client.db(dbName);
        const collection = db.collection('usersPolly');

        await collection.deleteMany({});
        const data = JSON.parse(fs.readFileSync('mockData.json', 'utf8'));
        await collection.insertMany(data);

        console.log('Базата данни е успешно заредена');
    } catch (err) {
        console.error('Грешка при зареждане на базата данни:', err);
    } finally {
        await client.close();
    }
}

seedDatabase();