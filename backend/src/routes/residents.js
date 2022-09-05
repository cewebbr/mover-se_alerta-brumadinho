const express = require('express');
const router = express.Router();
const residentController = require('../controllers/resident');
const authMiddleware = require('../middlewares/auth');

// List all residents and their data
router.get('/list/:sortBased&:order/:lastValue?/:lastId?', authMiddleware.isAdmin, residentController.list);

// List all residents and their public data
router.get('/listPublic/:sortBased&:order/:lastValue?/:lastId?', authMiddleware.isUser, residentController.listPublic);

// Returns a resident's data
router.get('/:email', authMiddleware.isHimselfOrAdmin, residentController.get);

// Returns a resident's public data
router.get('/public/:email', authMiddleware.isUser, residentController.getPublic);

// List residents by its type 
router.get('/fromType/:type&:sortBased&:order/:lastValue?/:lastId?', authMiddleware.isAdmin, residentController.getFromType);

// Register a new resident
router.post('/create', residentController.add);

// The administrator updates a resident's data
router.put('/admin/:email', authMiddleware.isAdmin, residentController.updateAdmin);

// A resident updates his own data
router.put('/resident/:email', authMiddleware.isHimself, residentController.updateResident);

// Delete a resident
router.delete('/delete/:email', authMiddleware.isHimself, residentController.remove);

module.exports = router;
