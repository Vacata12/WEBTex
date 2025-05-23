import express from 'express';
import { MongoClient } from 'mongodb';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();  // Зарежда .env файла

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const uri = process.env.DB_CONN_STRING;   // Взима връзката от .env
const dbName = process.env.DB_NAME || 'testdb'; // Взима името на базата

const client = new MongoClient('mongodb://localhost:27017/');

async function main() {
  await client.connect();
  const db = client.db(dbName);
  const collection = db.collection('items');

  // Изчистване и добавяне на начални записи
  await collection.deleteMany({});
  await collection.insertMany([
    { name: 'Item 1', order: 1 },
    { name: 'Item 2', order: 2 },
    { name: 'Item 3', order: 3 },
    { name: 'Item 4', order: 4 },
    { name: 'Item 5', order: 5 },
    { name: 'Item 6', order: 6 },
  ]);

  app.get('/items', async (req, res) => {
    let page = parseInt(req.query.page) || 1;
    let pageSize = parseInt(req.query.pageSize) || 3;
    if (page < 1) page = 1;
    if (pageSize < 1) pageSize = 3;
    const skip = (page - 1) * pageSize;

    const items = await collection.find()
      .sort({ order: 1 })
      .skip(skip)
      .limit(pageSize)
      .toArray();

    const totalCount = await collection.countDocuments();

    res.json({
      page,
      pageSize,
      totalCount,
      totalPages: Math.ceil(totalCount / pageSize),
      items,
    });
  });

  app.post('/items', async (req, res) => {
    const name = req.body.name || 'New Item';
    await collection.updateMany({}, { $inc: { order: 1 } });
    const result = await collection.insertOne({ name, order: 1 });
    res.json({ insertedId: result.insertedId });
  });

  app.delete('/items/:order', async (req, res) => {
    const order = parseInt(req.params.order);
    if (isNaN(order)) return res.status(400).json({ error: 'Invalid order' });
    const result = await collection.deleteOne({ order });
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Not found' });
    }
    res.json({ deletedOrder: order });
  });

  app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
  });
}

main().catch(console.error);
