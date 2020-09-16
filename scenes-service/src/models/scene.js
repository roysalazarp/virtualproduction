import mongoose from "mongoose";

const Schema = mongoose.Schema;

const sceneSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'User3dartist'
  }
});

module.exports = mongoose.model('Scene', sceneSchema);