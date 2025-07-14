import mongoose from "mongoose";
import { data as sampleListings } from './data.js';
import Listing from "../models/listing.js";

const MONGO_URL = "mongodb://127.0.0.1:27017/travelmate";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  try {
    await Listing.deleteMany({});
    const listingsWithOwner = sampleListings.map((obj) => ({
      ...obj,
      owner: "6870c0a07cd29af41240db43", // your fixed owner ID
    }));
    await Listing.insertMany(listingsWithOwner);
    console.log("✅ Data was initialized successfully!");
  } catch (err) {
    console.error("❌ Error inserting data:", err);
  } finally {
    mongoose.connection.close(); // ✅ Always close the connection
  }
};

initDB();