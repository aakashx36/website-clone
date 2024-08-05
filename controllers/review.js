const Review = require("../review.js")
const campground = require('../models/campground');

module.exports.del = async (req , res)=>{
    const {id,reviewId} = req.params;
    await campground.findByIdAndUpdate(id ,{ $pull : {reviews: reviewId}})
 await Review.findByIdAndDelete(reviewId);
     req.flash('success', 'successfully deleted review!');

  res.redirect(`/allcamp/${id}`);

}

module.exports.pos = async (req, res) => {
    const camp = await campground.findById(req.params.id);
    const review = new Review(req.body.review);
      review.author = req.user._id;
    camp.reviews.push(review);
    await review.save();
    await camp.save();
    res.redirect(`/allcamp/${camp._id}`);

}