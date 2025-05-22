const express = require('express');
const { MongoClient } = require('mongodb');
const path = require('path');
const { performance } = require('perf_hooks');
const fs = require('fs');

const app = express();
const port = 3000;
const dbName = 'demoDB';
const client = new MongoClient('mongodb://localhost:27017');
const logFile = path.join(__dirname, 'pagination.log');

// Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, 'public')));

// API routes
app.get('/no-cursor', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection('users');

        const startTime = performance.now();
        const data = await collection.find({}).skip(skip).limit(limit).toArray();
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
    }
});

app.get('/with-cursor', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection('users');

        const startTime = performance.now();
        const cursor = collection.find({}).skip(skip).limit(limit);
        const data = [];
        while (await cursor.hasNext()) {
            data.push(await cursor.next());
        }
        const endTime = performance.now();

        const timeTaken = (endTime - startTime).toFixed(2);

        res.json({
            method: 'with-cursor',
            data,
            page,
            limit,
            timeTaken
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});