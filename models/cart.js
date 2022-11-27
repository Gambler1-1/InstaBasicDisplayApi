const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const cartSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  items: [
    {
      productId: {
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: { type: Number, required: true, default: 1 },
    },
  ],
});

module.exports = mongoose.model("Cart", cartSchema);
