const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    stock: {
        type: Number,
        required: true,
        min: 0
    },
    images: [String],   // image URLs or file paths
    category: {
        type: String,
        default: ""
    },
    sellerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
}, {
    timestamps: true  // Adds createdAt and updatedAt fields
});

const ProductModel = mongoose.model("product", ProductSchema);
module.exports = ProductModel;
