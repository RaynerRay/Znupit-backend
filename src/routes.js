const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Company = require("./models/Company"); //including the company model
const Category = require("./models/Category");

router.get("/companies", async (req, res) => {
  try {
    const companies = await Company.find();
    return res.status(200).json(companies);
  } catch (error) {
    return res.status(500).json({ error: error });
  }
});

// create a company
router.post("/companies", async (req, res) => {
  try {
    const { name } = req.body;
    const { summary } = req.body;
    const { contact } = req.body;
    const { location } = req.body;
    const { photos } = req.body;
    const { categories } = req.body;

    const company = await Company.create({
      name,
      summary,
      contact,
      location,
      photos,
      categories,
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
    const { name, summary, contact, location, photos, categories } = req.body;

    let company = await Company.findOne({ _id });

    if (!company) {
      company = await Company.create({
        name,
        summary,
        contact,
        location,
        photos,
        categories,
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

module.exports = router;
