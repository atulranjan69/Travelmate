import express from "express";
import wrapAsync from "../utils/wrapAsync.js";
import Listing from "../models/listing.js";
import { isLoggedIn, isOwner, validateListing } from "../middleware.js";
const router = express.Router();
import {
  createListing,
  destroyListing,
  index,
  renderEditForm,
  renderNewForm,
  showListing,
  updateListing,
} from "../controllers/listings.js";

import multer from "multer";
import { storage } from "../cloudConfig.js";
const upload = multer({ storage });

router
  .route("/")
  .get(wrapAsync(index))
  .post(
    isLoggedIn,
    validateListing,
    upload.single("listing[image]"),
    wrapAsync(createListing)
  );

// New route
router.get("/new", isLoggedIn, renderNewForm);

router
  .route("/:id")
  .get(wrapAsync(showListing))
  .put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(updateListing)
  )
  .delete(isLoggedIn, isOwner, wrapAsync(destroyListing));

// Edit route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(renderEditForm));

export default router;
