const { vendorSchema, reviewSchema } = require('./schemas');
const ExpressError = require('./utils/ExpressError');
const Vendor = require('./models/vendor');
const Review = require('./models/review');

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash('error', 'You must be signed in first!');
        return res.redirect('/login');
    }
    next();
}

module.exports.validateVendor = (req, res, next) => {
    const { error } = vendorSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(400, msg)
    } else {
        next();
    }
}

module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const vendor = await Vendor.findById(id);
    if (!vendor?.author?.equals(req.user._id)) {
        req.flash('error', 'You are not authorized to do that!');
        return res.redirect(`/vendors/${id}`)
    }
    next();
}
module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'You are not authorized to do that!');
        return res.redirect(`/vendors/${id}`)
    }
    next();
}

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(400, msg)
    } else {
        next();
    }
}