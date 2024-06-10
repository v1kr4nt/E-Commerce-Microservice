import mongoose from "mongoose";
import { Schema } from "mongoose";

const ProductSchema = new Schema({
  name: String,
  description: String,
  price: Number,
  created_at: {
    type: Date,
    default: Date.now(),
  },
});

const Product = mongoose.model("product", ProductSchema);

export default Product;
