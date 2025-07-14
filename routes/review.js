import express from "express";
const router = express.Router({ mergeParams: true });
import wrapAsync from "../utils/wrapAsync.js";
import ExpressError from "../utils/ExpressError.js";
import review from "../models/review.js";
import Listing from "../models/listing.js";
import { isLoggedIn, validateReview , isReviewAuthor} from "../middleware.js";
import { createReview, deleteReview } from "../controllers/reviews.js";


// REVIEWS ROUTES
router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsync(createReview)
);

// Delete Reviews Route

router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(deleteReview)
);

export default router;
