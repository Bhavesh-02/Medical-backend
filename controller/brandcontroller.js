// controllers/brandController.js
const Brand = require('../model/brandModel');

exports.createBrand = async (req, res) => {
    try {
        const { name, description, brand_logo } = req.body;

        const newBrand = new Brand({
            name,
            description,
            brand_logo,
        });

        const savedBrand = await newBrand.save();
        res.status(201).json({
            message: 'Brand created successfully',
            brand: savedBrand,
        });
    } catch (error) {
        console.error('Error creating brand:', error);
        res.status(500).json({
            error: 'Failed to create brand',
            details: error.message,
        });
    }
};

exports.getBrands = async (req, res) => {
    try {
        const brands = await Brand.find({ isDeleted: false });
        res.status(200).json(brands);
    } catch (error) {
        console.error('Error fetching brands:', error);
        res.status(500).json({
            error: 'Failed to fetch brands',
            details: error.message,
        });
    }
};

exports.updateBrand = async (req, res) => {
    try {
        const { brandId } = req.params; // Get the brandId from the URL params
        const { name, description, brand_logo } = req.body; // Get the updated values from the request body

        // Find the brand by its ID
        let brand = await Brand.findById(brandId);
        if (!brand) {
            return res.status(404).json({ error: 'Brand not found' });
        }

        // Update the brand properties
        if (name) {
            brand.name = name;
        }
        if (description) {
            brand.description = description;
        }
        if (brand_logo) {
            brand.brand_logo = brand_logo; // Update the logo (if a new logo is provided)
        }

        // Save the updated brand to the database
        const updatedBrand = await brand.save();

        res.status(200).json({
            message: 'Brand updated successfully',
            brand: updatedBrand,
        });
    } catch (error) {
        console.error('Error updating brand:', error);
        res.status(500).json({
            error: 'Failed to update brand',
            details: error.message,
        });
    }
};