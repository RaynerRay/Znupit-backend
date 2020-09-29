const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
  name: String,
  email: String,
  comments: String,
  companies: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: false,
    },
  ],
});

module.exports = mongoose.model("Comment", CommentSchema);
