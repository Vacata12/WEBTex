const express = require('express');
const { MongoClient } = require('mongodb');
const path = require('path');
const { performance } = require('perf_hooks');
const fs = require('fs');

const app = express();
const port = 3000;
const dbName = 'demoDB';
const client = new MongoClient('mongodb://localhost:27017');

// Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, 'public')));

// API routes
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
            .sort({ _id: 1 }) // Ensure consistent ordering
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
        const lastCursor = req.query.lastCursor || null; // Accept the last cursor from the query params

        if (limit < 1) {
            return res.status(400).json({ error: 'Limit must be a positive integer.' });
        }

        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection('users');

        // Query to fetch documents after the last cursor
        const query = lastCursor ? { _id: { $gt: new MongoClient.ObjectId(lastCursor) } } : {};
        const options = { sort: { _id: 1 }, limit };

        const startTime = performance.now();
        const data = await collection.find(query, options).toArray();
        const endTime = performance.now();

        const timeTaken = (endTime - startTime).toFixed(2);

        // Determine the next cursor
        const nextCursor = data.length > 0 ? data[data.length - 1]._id : null;

        res.json({
            method: 'with-cursor',
            data,
            limit,
            nextCursor,
            timeTaken
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    } finally {
        await client.close();
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});