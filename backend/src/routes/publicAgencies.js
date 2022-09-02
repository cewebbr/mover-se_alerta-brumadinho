const express = require('express');
const router = express.Router();
const agencyController = require('../controllers/publicAgency');
const authMiddleware = require('../middlewares/auth');

// List all public agencies and their data
router.get('/list/:sortBased&:order/:lastValue?/:lastId?', authMiddleware.isAdmin, agencyController.list);

// List all public agencies and their public data
router.get('/listPublic/:sortBased&:order/:lastValue?/:lastId?', authMiddleware.isUser, agencyController.listPublic);

// Returns a public agency's data
router.get('/:email', authMiddleware.isHimselfOrAdmin, agencyController.get);

// Returns a public agency's public data
router.get('/public/:email', authMiddleware.isUser, agencyController.getPublic);

// Returns public agencies by its verfification field 
router.get(
  '/fromVerification/:verification&:sortBased&:order/:lastValue?/:lastId?', 
  authMiddleware.isAdmin,
  agencyController.getFromVerification
);

// Register a new public agency
router.post('/create', agencyController.add);

// The administrator updates a public agency's data
router.put('/admin/:email', authMiddleware.isAdmin, agencyController.updateAdmin);

// A public agency updates his own data
router.put('/agency/:email', authMiddleware.isHimself, agencyController.updatePublicAgency);

// Delete a public agency
router.delete('/delete/:email', authMiddleware.isHimself, agencyController.remove);

module.exports = router;
