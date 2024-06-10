import express from "express";
import mongoose from "mongoose";
import jt from "jsonwebtoken";

const app = express();
const PORT = process.env.PORT_TWO || 8080;
app.use(express.json());

mongoose
  .connect("mongodb://127.0.0.1:27017/product-srv")
  .then(() => {
    console.log("product-srv DB connected");
  })
  .catch((err) => {
    console.error(err);
  });

app.listen(PORT, () => {
  console.log(`Product-srv at port: ${PORT}`);
});
