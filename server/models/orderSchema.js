const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
    customerId: mongoose.Schema.Types.ObjectId,
    items:Array,
    totalAmount:Number,
    status:String,
     createdAt: {
        type: Date,
        default: Date.now
    }
});

const OrderModel = mongoose.model("order", OrderSchema);
module.exports = OrderModel;
