const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    value: {
        type: Number,
        required: true,
        index: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        index: true
    }
});

itemSchema.index({ value: 1, createdAt: -1 });

module.exports = mongoose.model('Item', itemSchema);
