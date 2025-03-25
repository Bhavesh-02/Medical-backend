// models/categoryModel.js
const mongoose = require('mongoose');

// Category schema
const categorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    isDeleted: { type: Boolean, default: false }
}, { timestamps: true });

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
