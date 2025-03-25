const express = require('express');
const router = express.Router();
const categoryController = require('../controller/categorycontroller');

router.post('/category', categoryController.createCategory);
router.get('/category', categoryController.getCategory);
router.patch('/category/:categoryId', categoryController.updateCategory);

module.exports = router;
