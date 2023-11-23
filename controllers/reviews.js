const Vendor = require('../models/vendor');
const Review = require('../models/review');

module.exports.postReview = async (req, res) => {
    const vendor = await Vendor.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    vendor.reviews.push(review);
    await review.save();
    await vendor.save();
    req.flash('success', 'Created new review!')
    res.redirect(`/vendors/${vendor._id}`);
}

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await Vendor.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted review!')
    res.redirect(`/vendors/${id}`);
}