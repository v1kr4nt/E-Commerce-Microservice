import mongoose from "mongoose";
import { Schema } from "mongoose";

const OrderSchema = new Schema({
  products: [
    {
      product_id: String,
    },
  ],
  user: String,
  total_price: Number,
  created_at: {
    type: Date,
    default: Date.now(),
  },
});

const Order = mongoose.model("order", OrderSchema);

export default Order;
