const Listing = require('./models/listing');
const ExpressError = require('./utils/ExpressError');
const { reviewSchema, listingSchema } = require('./schema.js');
const Review = require('./models/review.js');

module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash('error', 'You are not logged in!');
        res.redirect('/login');
    }
    next();
}

module.exports.saveRedirectUrl = (req, res, next) => {
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if(res.locals.currUser &&  !listing.owner._id.equals(res.locals.currUser._id)) {
        req.flash('error', "You don't have permission");
        return res.redirect('/listings');
    }
    next();
}

module.exports.isReviewAuthor = async (req, res, next) => {
    let { id, reviewId } = req.params;
    let review = await Review.findById(reviewId);
    if(res.locals.currUser &&  !review.author._id.equals(res.locals.currUser._id)) {
        req.flash('error', "You don't have permission");
        return res.redirect(`/listings/${id}`);
    }
    next();
}
 
module.exports.validateReview = (req, res, next) => {
    let {error} = reviewSchema.validate(req.body);
    if(error) {
        console.log(error);
        let errMsg = error.details.map(er => er.message).join(',');
        throw new ExpressError(400, errMsg);
    }
    next();
}

module.exports.validateListing = (req, res, next) => {
    let {error} = listingSchema.validate(req.body);
    if(error) {
        console.log(error);
        let errMsg = error.details.map(er => er.message).join(',');
        throw new ExpressError(400, errMsg);
    }
    next();
}