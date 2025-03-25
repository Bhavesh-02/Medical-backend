const mongoose = require('mongoose');

// Brand schema
const brandSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    isDeleted: { type: Boolean, default: false },
}, { timestamps: true });

const Brand = mongoose.model('Brand', brandSchema);

module.exports = Brand;
