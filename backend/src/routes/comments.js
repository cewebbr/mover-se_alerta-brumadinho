const express = require('express');
const router = express.Router();
const commentController = require('../controllers/comment');
const authMiddleware = require('../middlewares/auth');

// Returns a specific comment
router.get('/:id', commentController.get);

// Returns the list of users who liked the comment.
router.get('/likes/:id', commentController.getLikes);

// Register a new comment
router.post('/create', authMiddleware.isUser, commentController.add);

// Updates a comment data
router.put('/:id', authMiddleware.isMyComment, commentController.update);

// Add a like to the comment 
router.post('/like/:id', authMiddleware.isUser, commentController.like);

// Remove the like of a comment 
router.post('/removeLike/:id', authMiddleware.isUser, commentController.removeLike);

// Delete a comment 
router.delete('/delete/:id', authMiddleware.isMyComment, commentController.removeComment);

module.exports = router;
