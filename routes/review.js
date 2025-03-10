const express = require('express');
const wrapAsync = require('../utils/WrapAsync');
const { validateReview } = require('../middleware.js');
const { isLoggedIn, isReviewAuthor } = require('../middleware.js');
const reviewController = require('../controllers/review.js');
const router = express.Router({ mergeParams: true });

// Post review
router.post('/', isLoggedIn, validateReview, wrapAsync(reviewController.createReview));

// Delete review 
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, wrapAsync(reviewController.deleteReview));

module.exports = router;