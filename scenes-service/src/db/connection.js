import mongoose from "mongoose";
import "dotenv/config";

const dbURI = process.env.DB_URI;

const ScenesServiceDBconnection = mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true });

export default ScenesServiceDBconnection;