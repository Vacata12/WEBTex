const mongoose = require('mongoose');

// Item schema with indexes for efficient range queries and sorting
const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  value: {
    type: Number,
    required: true,
    index: true // Index for range queries
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true // Index for sorting/pagination
  }
});

// Compound index for value and createdAt for advanced queries
itemSchema.index({ value: 1, createdAt: -1 });

module.exports = mongoose.model('Item', itemSchema);
