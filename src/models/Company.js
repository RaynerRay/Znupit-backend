const mongoose = require("mongoose");

const CompanySchema = new mongoose.Schema({
  name: String,
  email: String,
  summary: String,
  contact: String,
  website: String,
  location: String,
  about: String,
  logo: String,

  photos: [
    {
      image: {
        type: String,
        required: false,
      },
    },
  ],

  categories: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: false,
    },
  ],
});

module.exports = mongoose.model("Company", CompanySchema);
