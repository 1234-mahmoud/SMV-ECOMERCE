const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema({
name:String,
parentCategory:mongoose.Schema.Types.ObjectId
})

const CategoryModel = mongoose.model("category",CategorySchema);

module.exports = CategoryModel