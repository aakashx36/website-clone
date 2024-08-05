const express = require('express');
    const router = express.Router({mergeParams:true});
const catchi = require('../utils/catch');
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware');
const ExpressError = require('../utils/ExpressError');
const campground = require('../models/campground');
const Review = require("../controllers/review.js")


router.post('/', validateReview,isLoggedIn , catchi(Review.pos))
router.delete("/:reviewId",isReviewAuthor,isLoggedIn   ,catchi(Review.del))
module.exports = router;


