const Product = require('../model/productmodel');
const Brand = require('../model/brandModel');
const Category = require('../model/categoryModel');

exports.Productcontroller = async (req, res) => {
    console.log(req.body);
    
    try {

        // Ensure req.files has 'image' property
        if (!req.files || !req.files['image']) {
            return res.status(400).json({ error: 'No files uploaded or incorrect field name' });
        }

        // Get data from the request body
        const { title, description, price, consume_type, return_policy, expiry_date, manufacturing_date, inStock, isRequirePrescription, variants, brandName, categoryName} = req.body;
        
        let existingProduct = await Product.findOne({ title });
        if (existingProduct) {
            return res.status(409).json({ error: 'Product already exists' });
        }

        let brandArray = [];
        let brand = await Brand.findOne({ name: brandName });
        if (!brand) {
            brand = new Brand({
                name: brandName,
                description: `${brandName} is a leading brand.`,
                brand_logo: req.file ? `http://localhost:3000/${req.file.path}` : null,  // if logo is provided in the form data
            });
            const savedBrand = await brand.save();
            brandArray.push(savedBrand);  // Push brand ID to the array
        } else {
            brandArray.push(brand);  // Push existing brand ID to the array
        }

        let categoryArray = [];
        for (const name of categoryName) {
            let category = await Category.findOne({ name });
            if (category) {
                categoryArray.push(category);
            } else {
                category = new Category({
                    name,
                    description: `${name} is a leading category.`,
                    category_logo: req.file ? `http://localhost:3000/${req.file.path}` : null,
                });

                const savedCategory = await category.save();
                categoryArray.push(savedCategory);  
            }
        }


        // Initialize an empty array for media files
        let mediaFiles = [];
        let parsedVariants = [];
        let brochures = [];


        req.files['image'].forEach(file => {
            const imageUrl = `http://localhost:3000/${file.path.replace('uploads/images/', '')}`;  
            mediaFiles.push({ url: imageUrl, mimetype: file.mimetype });
        });

        if (req.files['brochure']) {
            req.files['brochure'].forEach(file => {
                const brochureUrl = `http://localhost:3000/${file.path.replace('uploads/brochures/', '')}`;
                brochures.push({ url: brochureUrl, mimetype: file.mimetype });
            });
        }

      try {
          if (variants) {
              // Check if the variants is a valid JSON string and parse it
              if (typeof variants === 'string') {
                  parsedVariants = JSON.parse(variants);
              } else {
                  parsedVariants = variants; // Already an array
              }
          }
      } catch (error) {
          // Catch any errors while parsing variants and return an error message
          return res.status(400).json({ message: 'Variants parsing failed', error:error.message });
      }

        // Create a new product instance
        const newProduct = new Product({
            title,
            description,
            consume_type,
            price,
            return_policy,
            expiry_date,
            manufacturing_date,
            inStock,
            isRequirePrescription,
            mediaFiles,  
            variants: parsedVariants,  
            brochures,
            brand: brandArray,  
            category: categoryArray
        });

        // Save the new product to the database
        await newProduct.save();

        // Send success response
        res.status(201).json({
            message: 'Product created successfully',
            product: newProduct,
        });
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({
            error: 'Failed to create product',
            details: error.message,
        });
    }
};

exports.getProduct = async (req, res) => {
    try {
        // Find all products and populate the 'brand' and 'category' fields
        const products = await Product.find()
            .populate('brand')  // Populating the brand field
            .populate('category');  // Populating the category field

        if (!products || products.length === 0) {
            return res.status(404).json({ error: 'No products found' });
        }

        // Return all products
        res.status(200).json({
            message: 'Products retrieved successfully',
            products
        });
    } catch (error) {
        console.error('Error retrieving products:', error);
        res.status(500).json({
            error: 'Failed to retrieve products',
            details: error.message,
        });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const { productId } = req.params;  
        const {
            title,
            description,
            price,
            consume_type,
            return_policy,
            expiry_date,
            manufacturing_date,
            inStock,
            isRequirePrescription,
            variants,
            brandName,
            categoryName
        } = req.body;

        // Find the product to be updated
        let product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        let brandArray = product.brand;  // Retain existing brand(s)
        if (brandName) {
            let brand = await Brand.findOne({ name: brandName });
            if (!brand) {
                // Create new brand if it doesn't exist
                brand = new Brand({
                    name: brandName,
                    description: `${brandName} is a leading brand.`,
                    brand_logo: req.file ? `http://localhost:3000/${req.file.path}` : null,
                });
                const savedBrand = await brand.save();
                brandArray = [savedBrand];  // Update brand array with the new brand
            } else {
                // If brand exists, retain the existing brand
                brandArray = [brand];  // Update to existing brand
            }
        }


        let categoryArray = product.category;  // Retain existing category(s)
        if (categoryName) {
            let category = await Category.findOne({ name: categoryName });
            if (!category) {
                // Create new category if it doesn't exist
                category = new Category({
                    name: categoryName,
                    description: `${categoryName} is a leading category.`,
                    category_logo: req.file ? `http://localhost:3000/${req.file.path}` : null,
                });
                const savedCategory = await category.save();
                categoryArray = [savedCategory];  // Update brand array with the new category
            } else {
                categoryArray = [category];  // Update to existing category
            }
        }
        // Handle media files update
        let mediaFiles = product.mediaFiles || [];
        if (req.files['image']) {
            req.files['image'].forEach(file => {
                const imageUrl = `http://localhost:3000/${file.path.replace('uploads/images/', '')}`;
                mediaFiles.push({ url: imageUrl, mimetype: file.mimetype });
            });
        }

        // Handle brochure files update
        let brochures = product.brochures || [];
        if (req.files['brochure']) {
            req.files['brochure'].forEach(file => {
                const brochureUrl = `http://localhost:3000/${file.path.replace('uploads/brochures/', '')}`;
                brochures.push({ url: brochureUrl, mimetype: file.mimetype });
            });
        }



        let updatedVariants = product.variants || [];

        if (variants && Array.isArray(variants)) {
            for (let i = 0; i < variants.length; i++) {
                const variant = variants[i];
                const { _id, color, size, price, inStock, isDeleted, discount } = variant;

                // Log each variant we are processing
                console.log('Processing Variant:', variant);

                // Find the variant by _id in the product's variants array
                const variantIndex = updatedVariants.findIndex(v => v._id.toString() === _id);
                
                if (variantIndex !== -1) {
                    // Log the matching variant index
                    console.log('Found Variant at Index:', variantIndex);
                    
                    // Update the found variant
                    if (color) updatedVariants[variantIndex].color = color;
                    if (size) updatedVariants[variantIndex].size = size;
                    if (price) updatedVariants[variantIndex].price = price;
                    if (inStock !== undefined) updatedVariants[variantIndex].inStock = inStock;
                    if (isDeleted !== undefined) updatedVariants[variantIndex].isDeleted = isDeleted;
                    if (discount !== undefined) updatedVariants[variantIndex].discount = discount;
                } else {
                    // Log if variant not found
                    console.log('Variant Not Found:', _id);
                    return res.status(404).json({ error: `Variant with ID ${_id} not found` });
                }
            }
        }

        // Handle variants update
        // let parsedVariants = product.variants || [];
        // if (variants) {
        //     try {
        //         if (typeof variants === 'string') {
        //             parsedVariants = JSON.parse(variants);
        //         } else {
        //             parsedVariants = variants;  // Already an array
        //         }
        //     } catch (error) {
        //         return res.status(400).json({ message: 'Variants parsing failed', error: error.message });
        //     }
        // }

        // Update the product with the new data
        product = await Product.findByIdAndUpdate(productId, {
            title,
            description,
            consume_type,
            price,
            return_policy,
            expiry_date,
            manufacturing_date,
            inStock,
            isRequirePrescription,
            mediaFiles,
            variants: updatedVariants,
            brochures,
            brand: brandArray,
            category: categoryArray
        }, { new: true });

        // Return success response
        res.status(200).json({
            message: 'Product updated successfully',
            product
        });
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({
            error: 'Failed to update product',
            details: error.message,
        });
    }
};

// exports.updateVariant = async (req, res) => {
//     try {
//         const { productId, variantId } = req.params; // Get productId and variantId from URL params
//         const { size, color, price,  inStock } = req.body; // Get the updated variant values from request body

//         let product = await Product.findById(productId);
//         if (!product) {
//             return res.status(404).json({ error: 'Product not found' });
//         }

//         const variantIndex = product.variants.findIndex(variant => variant._id.toString() === variantId);
//         if (variantIndex === -1) {
//             return res.status(404).json({ error: 'Variant not found' });
//         }

//         if (size) product.variants[variantIndex].size = size;  
//         if (color) product.variants[variantIndex].color = color; 
//         if (price) product.variants[variantIndex].price = price; 
//         if (inStock) product.variants[variantIndex].price = inStock; 


//         // Step 4: Save the updated product
//         await product.save();

//         res.status(200).json({
//             message: 'Variant updated successfully',
//             product: product,  // Return the updated product
//         });
//     } catch (error) {
//         console.error('Error updating variant:', error);
//         res.status(500).json({
//             error: 'Failed to update variant',
//             details: error.message,
//         });
//     }
// };