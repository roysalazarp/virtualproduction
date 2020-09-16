import mongoose from "mongoose";
import "dotenv/config";

const dbURI = process.env.DB_URI;

const BookingsServiceDBconnection = mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true });

export default BookingsServiceDBconnection;