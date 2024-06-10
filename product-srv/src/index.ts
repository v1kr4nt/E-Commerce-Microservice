import express from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import amqp from "amqplib";
import Product from "./models/Product";
import { isAuthenticated } from "./isAuthenticated";

const app = express();
const PORT = process.env.PORT_TWO || 8080;
app.use(express.json());

var channel, connection;

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
  return res.json(newProduct);
});

//buy a product

app.listen(PORT, () => {
  console.log(`Product-srv at port: ${PORT}`);
});
