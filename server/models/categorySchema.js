const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  parentCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "category",
    default: null
  },
  image: {
    type: String,
    default: null
  }
}, { timestamps: true });

const CategoryModel = mongoose.model("category", CategorySchema);

module.exports = CategoryModel;
