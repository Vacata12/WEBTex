# MongoDB Range Query & Pagination Mini Project

This project demonstrates how to use range queries, cursors, and pagination with MongoDB and Node.js (Express).

## Features

- Express.js API
- MongoDB with Mongoose
- Range queries on numeric fields
- Cursor-based pagination
- Sorting by any field
- Data seeding script with realistic dates

## Setup

1. Install dependencies:

   ```sh
   npm install
   ```

2. Set up MongoDB (local or Atlas) and update `.env` if needed.

3. Seed the database:

   ```sh
   npm run seed
   # or
   node seed.js
   ```

4. Start the server:

   ```sh
   npm start
   # or
   node index.js
   ```

## API Usage

### GET /items

Query Parameters:

- `minValue`: Minimum value (inclusive)
- `maxValue`: Maximum value (inclusive)
- `limit`: Number of results per page (default: 10)
- `after`: MongoDB ObjectId to paginate after (cursor)
- `sortBy`: Field to sort by (default: createdAt)
- `sortOrder`: asc or desc (default: desc)

#### Example

```sh
GET http://localhost:3000/items?minValue=20&maxValue=150&limit=10&sortBy=value&sortOrder=asc
```

#### Response

```json
{
  "items": [ ... ],
  "nextCursor": "<ObjectId>",
  "count": 10
}
```

Use the `nextCursor` value as the `after` parameter for the next page.

## Project Structure

- `index.js` - Express server entry
- `models/Item.js` - Mongoose model (with indexes)
- `routes/items.js` - API route (detailed, flexible)
- `seed.js` - Data seeding script (realistic data)
- `.env` - Environment variables

---

