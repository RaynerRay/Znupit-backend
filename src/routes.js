const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const auth = require("./verifyToken");

const Company = require("./models/Company"); //including the company model
const Category = require("./models/Category");
const User = require("./models/User");
const Comment = require("./models/Comment");

//create a comment
router.post("/comment", async (req, res) => {
  try {
    const { name } = req.body;
    const { email } = req.body;
    const { comments } = req.body;
    const { companies } = req.body;

    const comment = await Comment.create({
      name,
      email,
      comments,
      companies,
    });

    return res.status(201).json(comment);
  } catch (error) {
    return res.status(500).json({ error: error });
  }
});

//get all comments
router.get("/comment", async (req, res) => {
  try {
    const comments = await Comment.find();
    return res.status(200).json(comments);
  } catch (error) {
    return res.status(500).json({ error: error });
  }
});

// delete comment
router.delete("/comment/:id", async (req, res) => {
  try {
    const _id = req.params.id;

    const comment = await Comment.deleteOne({ _id });

    if (comment.deletedCount === 0) {
      return res.status(404).json();
    } else {
      return res.status(204).json();
    }
  } catch (error) {
    return res.status(500).json({ error: error });
  }
});

//get all comments from a specific company
router.get("/comment/companies/:id", async (req, res) => {
  try {
    const _id = req.params.id;

    const comment = await Comment.find({ companies: _id });
    return res.status(200).json(comment);
  } catch (error) {
    return res.status(500).json({ error: error });
  }
});

//get all companies
router.get("/companies", async (req, res) => {
  try {
    const companies = await Company.find();
    return res.status(200).json(companies);
  } catch (error) {
    return res.status(500).json({ error: error });
  }
});

// create a company
router.post("/companies", auth, async (req, res) => {
  try {
    const { name } = req.body;
    const { summary } = req.body;
    const { contact } = req.body;
    const { location } = req.body;
    const { photos } = req.body;
    const { categories } = req.body;
    const { website } = req.body;
    const { about } = req.body;

    const company = await Company.create({
      name,
      summary,
      contact,
      location,
      photos,
      categories,
      website,
      about,
    });

    return res.status(201).json(company);
  } catch (error) {
    return res.status(500).json({ error: error });
  }
});

//update company
router.put("/companies/:id", async (req, res) => {
  try {
    const _id = req.params.id;
    const {
      name,
      summary,
      contact,
      location,
      photos,
      categories,
      website,
      about,
    } = req.body;

    let company = await Company.findOne({ _id });

    if (!company) {
      company = await Company.create({
        name,
        summary,
        contact,
        location,
        photos,
        categories,
        website,
        about,
      });
      return res.status(201).json(company);
    } else {
      // updates only the given fields
      if (name) {
        company.name = name;
      }
      if (summary) {
        company.summary = summary;
      }
      if (contact) {
        company.contact = contact;
      }
      if (location) {
        company.location = location;
      }
      if (photos) {
        company.photos = photos;
      }
      if (website) {
        company.website = website;
      }
      if (about) {
        company.about = about;
      }

      if (categories) {
        company.categories = categories.map((category) =>
          mongoose.Types.ObjectId(category)
        );
      }
      await company.save();
      return res.status(200).json(company);
    }
  } catch (error) {
    return res.status(500).json({ error: error });
  }
});

// delete company
router.delete("/companies/:id", async (req, res) => {
  try {
    const _id = req.params.id;

    const company = await Company.deleteOne({ _id });

    if (company.deletedCount === 0) {
      return res.status(404).json();
    } else {
      return res.status(204).json();
    }
  } catch (error) {
    return res.status(500).json({ error: error });
  }
});

//create a new category
router.post("/category", async (req, res) => {
  try {
    const { name } = req.body;
    const category = await Category.create({ name });
    return res.status(200).json(category);
  } catch (error) {
    return res.status(500).json({ error: error });
  }
});

// get all categories
router.get("/category", async (req, res) => {
  try {
    const categories = await Category.find();
    return res.status(200).json(categories);
  } catch (error) {
    return res.status(500).json({ error: error });
  }
});

//get all companies from a specific category
router.get("/companies/category/:id", async (req, res) => {
  try {
    const _id = req.params.id;

    const companies = await Company.find({ categories: _id });
    return res.status(200).json(companies);
  } catch (error) {
    return res.status(500).json({ error: error });
  }
});

//register a user
router.post("/register", async (req, res) => {
  //check if the user is already in database
  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist) return res.status(400).send("Email already exist");

  //Hash passwords
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  //create a new User
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
  });
  try {
    const savedUser = await user.save();
    res.send({ user: user._id });
  } catch (err) {
    res.status(400).send(err);
  }
});

//login
router.post("/login", async (req, res) => {
  //check if the email exist
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Email or Password is wrong");

  //is password is correct
  const validPass = await bcrypt.compare(req.body.password, user.password);
  if (!validPass) return res.status(400).send("Invalid password");

  //create and assign a token
  const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
  res.header("auth-token", token).send(token);
});
module.exports = router;
