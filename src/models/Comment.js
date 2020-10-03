const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
  name: String,
  email: String,
  comments: String,
  rating: Number,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  companies: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: false,
    },
  ],
});

module.exports = mongoose.model("Comment", CommentSchema);
