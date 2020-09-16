import mongoose from "mongoose";

const Schema = mongoose.Schema;

const bookingSchema = new Schema({
    scene: {
      type: Schema.Types.ObjectId,
      ref: 'Scene'
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'UserFilmmaker'
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Booking', bookingSchema);