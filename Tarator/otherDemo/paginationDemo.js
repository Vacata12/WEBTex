const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);
const dbName = 'demoDB';

async function cursorPaginationDemo() {
    try {
        await client.connect();
        console.log('Connected to MongoDB');

        const db = client.db(dbName);
        const collection = db.collection('users');

        // Cursor-based pagination
        const pageSize = 10;
        let lastCursor = null; // Replace with the last cursor from the previous page if available

        const query = lastCursor ? { _id: { $gt: lastCursor } } : {};
        const options = { sort: { _id: 1 }, limit: pageSize };

        const items = await collection.find(query, options).toArray();
        console.log('Cursor-based Pagination Results:', items);

        if (items.length > 0) {
            lastCursor = items[items.length - 1]._id;
            console.log('Next Cursor:', lastCursor);
        }
    } catch (err) {
        console.error('Error in cursor-based pagination:', err);
    } finally {
        await client.close();
    }
}

async function offsetPaginationDemo() {
    try {
        await client.connect();
        console.log('Connected to MongoDB');

        const db = client.db(dbName);
        const collection = db.collection('users');

        // Offset-based pagination
        const pageSize = 10;
        const pageNumber = 1; // Replace with the desired page number

        const items = await collection.find({})
            .sort({ _id: 1 })
            .skip(pageSize * (pageNumber - 1))
            .limit(pageSize)
            .toArray();

        console.log('Offset-based Pagination Results:', items);
    } catch (err) {
        console.error('Error in offset-based pagination:', err);
    } finally {
        await client.close();
    }
}

cursorPaginationDemo();
offsetPaginationDemo();