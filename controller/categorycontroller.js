// controllers/categoryController.js
const Category = require('../model/categoryModel');

exports.createCategory = async (req, res) => {
    try {
        const {name, description } = req.body;

        const newCategory = new Category({
            name,
            description
        });

        const savedCategory = await newCategory.save();
        res.status(201).json({
            message: 'Category created successfully',
            category: savedCategory,
        });
    } catch (error) {
        console.error('Error creating category:', error);
        res.status(500).json({
            error: 'Failed to create category',
            details: error.message,
        });
    }
};

exports.getCategory = async (req, res) => {
    try {
        const categories = await Category.find({ isDeleted: false });
        res.status(200).json(categories);
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({
            error: 'Failed to fetch categories',
            details: error.message,
        });
    }
};

exports.updateCategory = async (req, res) => {
    try {
        const { categoryId } = req.params; // Get the categoryId from the URL params
        const { name, description, category_logo } = req.body; // Get the updated values from the request body

        // Find the category by its ID
        let category = await Category.findById(categoryId);
        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }

        // Update the category properties
        if (name) {
            category.name = name;
        }
        if (description) {
            category.description = description;
        }
        if (category_logo) {
            category.category_logo = category_logo; // Update the logo (if a new logo is provided)
        }

        // Save the updated category to the database
        const updatedCategory = await category.save();

        res.status(200).json({
            message: 'Category updated successfully',
            category: updatedCategory,
        });
    } catch (error) {
        console.error('Error updating category:', error);
        res.status(500).json({
            error: 'Failed to update category',
            details: error.message,
        });
    }
};