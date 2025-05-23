const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const path = require('path');
const { performance } = require('perf_hooks');

const app = express();
const port = 3000;
const dbName = 'demoDB';
const client = new MongoClient('mongodb://localhost:27017');

app.use(express.static(path.join(__dirname, 'public')));

app.get('/no-cursor', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        if (page < 1 || limit < 1) {
            return res.status(400).json({ error: 'Page and limit must be positive integers.' });
        }

        const skip = (page - 1) * limit;

        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection('users');

        const startTime = performance.now();
        const data = await collection.find({})
            .sort({ _id: 1 })
            .skip(skip)
            .limit(limit)
            .toArray();
        const endTime = performance.now();

        const timeTaken = (endTime - startTime).toFixed(2);

        res.json({
            method: 'no-cursor',
            data,
            page,
            limit,
            timeTaken
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    } finally {
        await client.close();
    }
});

app.get('/with-cursor', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const lastCursor = req.query.lastCursor || null;
        const direction = req.query.direction || 'forward';

        if (limit < 1) {
            return res.status(400).json({ error: 'Limit must be a positive integer.' });
        }

        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection('users');

        let query = {};
        let sort = { _id: 1 };
        if (lastCursor) {
            try {
                if (direction === 'forward') {
                    query = { _id: { $gt: new ObjectId(lastCursor) } };
                } else if (direction === 'backward') {
                    query = { _id: { $lt: new ObjectId(lastCursor) } };
                    sort = { _id: -1 };
                }
            } catch (err) {
                console.error('Invalid lastCursor:', lastCursor);
                return res.status(400).json({ error: 'Invalid lastCursor value. Must be a valid ObjectId.' });
            }
        }

        const options = { sort, limit };

        const startTime = performance.now();
        let data = await collection.find(query, options).toArray();
        const endTime = performance.now();

        if (direction === 'backward') {
            data.reverse();
        }

        const timeTaken = (endTime - startTime).toFixed(2);
        const nextCursor = data.length > 0 ? data[data.length - 1]._id.toString() : null;

        res.json({
            method: 'with-cursor',
            data,
            limit,
            nextCursor,
            timeTaken
        });
    } catch (err) {
        console.error('Error in /with-cursor route:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        await client.close();
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});