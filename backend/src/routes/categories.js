const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category');
const authMiddleware = require('../middlewares/auth');

// List all categories 
router.get('/list', categoryController.list);

// Returns a specific category 
router.get('/:id', categoryController.get);

// Register a new category
router.post('/create', authMiddleware.isAdmin, categoryController.add);

// Update a category 
router.put('/:id', authMiddleware.isAdmin, categoryController.update);

// Delete a category
router.delete('/delete/:id', authMiddleware.isAdmin, categoryController.remove);

module.exports = router;
