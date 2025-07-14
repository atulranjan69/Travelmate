import Listing from "../models/listing.js";
import mbxGeocoding from "@mapbox/mapbox-sdk/services/geocoding.js";
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

const index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { listings });
};

const renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

const showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing you requested dor does not exist!");
    res.redirect("/listings");
  }
  res.render("listings/show.ejs", { listing });
};

const createListing = async (req, res) => {
  let response = await geocodingClient
    .forwardGeocode({
      query: req.body.listing.location,
      limit: 1,
    })
    .send();
  console.log("GEOCODE RESPONSE:", response.body.features);

  let url = req.file.path;
  let filename = req.file.filename;
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };
  newListing.geometry = response.body.features[0].geometry;
  let savedListing = await newListing.save();
  console.log(savedListing);
  req.flash("success", "New Listing Created!");
  res.redirect("/listings");
};

const renderEditForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing you requested for does not exist!");
    return res.redirect("/listings");
  }
  let originalImageUrl = listing.image.url;
  originalImageUrl = originalImageUrl.replace("/uploads/", "/upload/,w_250/");
  res.render("listings/edit.ejs", { listing, originalImageUrl });
};

const updateListing = async (req, res) => {
  const { id } = req.params;
  const data = req.body.listing;
  const listing = await Listing.findById(id);

  if (!listing) {
    req.flash("error", "Listing not found.");
    return res.redirect("/listings");
  }

  // If a new image is uploaded, replace it
  if (req.file) {
    listing.image = {
      url: req.file.path,
      filename: req.file.filename,
    };
  }

  // Update other fields (excluding image if not uploaded)
  listing.title = data.title;
  listing.description = data.description;
  listing.price = data.price;
  listing.country = data.country;
  listing.location = data.location;

  await listing.save();
  req.flash("success", "Listing Updated!");
  res.redirect(`/listings/${id}`);
};

const destroyListing = async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  req.flash("success", "Listing Deleted!");
  res.redirect("/listings");
};

console.log("MAPBOX TOKEN:", process.env.MAP_TOKEN);

export {
  index,
  renderNewForm,
  showListing,
  createListing,
  renderEditForm,
  updateListing,
  destroyListing,
};
