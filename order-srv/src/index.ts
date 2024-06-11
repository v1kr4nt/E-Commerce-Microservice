import express from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import amqp from "amqplib";
import Order from "./models/Order";
import { isAuthenticated } from "./isAuthenticated";

const app = express();
const PORT = process.env.PORT_TWO || 9090;
app.use(express.json());

var channel: any, connection;

mongoose
  .connect("mongodb://127.0.0.1:27017/order-srv")
  .then(() => {
    console.log("order-srv DB connected");
  })
  .catch((err) => {
    console.error(err);
  });

async function connectmq() {
  const amqpServer = "amqp://localhost:5672";
  connection = await amqp.connect(amqpServer);
  channel = await connection.createChannel();
  await channel.assertQueue("ORDER");
}

connectmq().then(() => {
  channel.consume("ORDER", (data: any) => {
    const { products, userEmail } = JSON.parse(data.content);
    console.log("Consuming ORDER queue");
    console.log(products);
  });
});

app.listen(PORT, () => {
  console.log(`Order-srv at port: ${PORT}`);
});
