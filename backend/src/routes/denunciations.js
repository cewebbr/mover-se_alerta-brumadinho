const express = require('express');
const router = express.Router();
const denunciationController = require('../controllers/denunciation');
const authMiddleware = require('../middlewares/auth');

// List all denunciations
router.get('/list/:sortBased&:order/:lastValue?/:lastId?', authMiddleware.isAuditor, denunciationController.list);

// Returns a denunciation by its searchId 
router.get('/fromSearchId/:searchId', denunciationController.getFromSearchId);

// List the denunciations of a city 
router.get('/fromCity/:uf&:city&:sortBased&:order/:lastValue?/:lastId?', denunciationController.getFromCity);

// List the denunciations of a user 
router.get('/fromEmail/:email&:sortBased&:order/:lastValue?/:lastId?', authMiddleware.isHimself, denunciationController.getFromEmail);

// List denunciations by email and status
router.get('/fromEmailAndStatus/:email&:status&:sortBased&:order/:lastValue?/:lastId?', authMiddleware.isHimself, denunciationController.getFromEmailAndStatus);

// List denunciations by its status 
router.get('/fromStatusAndCity/:status&:uf&:city&:sortBased&:order/:lastValue?/:lastId?', authMiddleware.isAuditor, denunciationController.getFromStatusAndCity);

// Returns the list of users who liked the denunciation.
router.get('/likes/:id', denunciationController.getLikes);

// Register a new denunciation
router.post('/create', denunciationController.add);

// Add a comment to the denunciation
router.post('/comment/:id', authMiddleware.isUser, denunciationController.comment);

// Remove a comment from the denunciation
router.post('/removeComment/:id', authMiddleware.canRemoveComment, denunciationController.removeComment);

// Add a like to the denunciation 
router.post('/like/:id', authMiddleware.isUser, denunciationController.like);

// Remove the like of a denunciation 
router.post('/removeLike/:id', authMiddleware.isUser, denunciationController.removeLike);

// The auditor updates a denunciation's data
router.put('/auditor/:id', authMiddleware.isAuditor, denunciationController.updateAuditor);

// The user updates your denunciation's data
router.put('/publisher/:id', authMiddleware.isMyDenunciation, denunciationController.updatePublisher);

// Delete a denunciation
router.delete('/delete/:id', authMiddleware.isMyDenunciation, denunciationController.removeDenunciation);

module.exports = router;