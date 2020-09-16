import mongoose from "mongoose";

const Schema = mongoose.Schema;

const user3dartistSchema = new Schema({
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

module.exports = mongoose.model('User3dartist', user3dartistSchema);