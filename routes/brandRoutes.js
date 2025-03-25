const express = require('express');
const router = express.Router();
const brandController = require('../controller/brandcontroller');

router.post('/brand', brandController.createBrand);
router.get('/brands', brandController.getBrands);
router.patch('/brands/:brandId', brandController.updateBrand);

module.exports = router;
