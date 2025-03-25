// routes/productRoutes.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const postProduct = require('../controller/productcontroller');
const { getProduct } = require('../controller/productcontroller');
const { updateProduct } = require('../controller/productcontroller');
// const { updateVariant } = require('../controller/productcontroller');


const router = express.Router();

// Set up the storage engine for Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (file.fieldname === 'image') {
            cb(null, './uploads/images'); // Store image files in 'images' folder
        } else if (file.fieldname === 'brochure') {
            cb(null, './uploads/brochures'); // Store brochure files in 'brochures' folder
        } else {
            cb(new Error('Unknown field'));
        }
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Use timestamp for uniqueness
    }
});



// Create Multer instance with the storage configuration
const upload = multer({ storage: storage });

router.post('/Product', upload.fields([{ name: 'image', maxCount: 10 }, { name: 'brochure', maxCount: 5 }]), postProduct.Productcontroller);
router.get('/Product', getProduct);  
router.patch('/product/:productId', upload.fields([{ name: 'image', maxCount: 5 }, { name: 'brochure', maxCount: 5 }]), updateProduct);
// router.patch('/product/:productId/variant/:variantId', updateVariant);
module.exports = router;
