const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://istoynev:istoynev@cluster0.mongodb.net/Web?retryWrites=true&w=majority";
const client = new MongoClient(uri);

async function run() {
    try {
        await client.connect();
        const db = client.db('Web');
        const collection = db.collection('Test');

        const docs = await collection.find({}).limit(5).toArray();
        console.log('Sample documents:', docs);
    } catch (err) {
        console.error('MongoDB connection error:', err);
    } finally {
        await client.close();
    }
}

run();