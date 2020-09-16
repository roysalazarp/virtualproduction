import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userFilmmakerSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  count: {
    type: Number,
    default: 0
  },
  bookedScenes: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Booking'
    }
  ]
});

module.exports = mongoose.model('UserFilmmaker', userFilmmakerSchema);