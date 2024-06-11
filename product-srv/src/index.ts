import express from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import amqp from "amqplib";
import Product from "./models/Product";
import { isAuthenticated } from "./isAuthenticated";

const app = express();
const PORT = process.env.PORT_TWO || 8080;
app.use(express.json());

var channel: any, connection;

mongoose
  .connect("mongodb://127.0.0.1:27017/product-srv")
  .then(() => {
    console.log("product-srv DB connected");
  })
  .catch((err) => {
    console.error(err);
  });

async function connectmq() {
  const amqpServer = "amqp://localhost:5672";
  connection = await amqp.connect(amqpServer);
  channel = await connection.createChannel();
  await channel.assertQueue("PRODUCT");
}

connectmq();

//create a new product
app.post("/product/create", isAuthenticated, async (req, res) => {
  const { name, description, price } = req.body;
  const newProduct = new Product({
    name,
    description,
    price,
  });
  newProduct.save();
  return res.json(newProduct);
});

//buy a product
// user sends a list of product ids to buy
// creating an order with those products and total value of sum of products prices

app.post("/product/buy", isAuthenticated, async (req: any, res) => {
  const { ids } = req.body;
  const products = await Product.find({ _id: { $in: ids } });
  channel.sendToQueue(
    "ORDER",
    Buffer.from(
      JSON.stringify({
        products,
        userEmail: req.user.email,
      })
    )
  );
});

app.listen(PORT, () => {
  console.log(`Product-srv at port: ${PORT}`);
});
