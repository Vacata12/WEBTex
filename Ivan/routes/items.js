const express = require('express');
const router = express.Router();
const Item = require('../models/Item');

/**
 * GET /items
 * Query Parameters:
 *   - minValue: Minimum value (inclusive)
 *   - maxValue: Maximum value (inclusive)
 *   - limit: Number of items per page (default 10)
 *   - after: Cursor (MongoDB ObjectId) for pagination
 *   - sortBy: Field to sort by (default: createdAt)
 *   - sortOrder: asc or desc (default: desc)
 *
 * Example: /items?minValue=10&maxValue=100&limit=5&after=<lastId>&sortBy=value&sortOrder=asc
 */
router.get('/', async (req, res) => {
  try {
    const {
      minValue,
      maxValue,
      limit = 10,
      after,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const query = {};
    if (minValue !== undefined) query.value = { ...query.value, $gte: Number(minValue) };
    if (maxValue !== undefined) query.value = { ...query.value, $lte: Number(maxValue) };
    if (after) query._id = { $gt: after };

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;
    sort._id = 1; // Ensure stable sorting for pagination

    // Use cursor for efficient pagination
    const items = await Item.find(query)
      .sort(sort)
      .limit(Number(limit));

    res.json({
      items,
      nextCursor: items.length ? items[items.length - 1]._id : null,
      count: items.length
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
