const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const postSchema = new Schema({
  caption: {
    type: String,
    required: true,
    unique: true,
    default: "No Caption",
  },

  media_url: {
    type: String,
  },
});

module.exports = mongoose.model("Post", postSchema);
