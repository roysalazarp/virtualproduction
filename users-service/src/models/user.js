import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userSchema = new Schema({
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
  createdScenes: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Scene'
    }
  ]
});

module.exports = mongoose.model('User', userSchema);