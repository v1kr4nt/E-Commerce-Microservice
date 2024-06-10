import { Jwt } from "./../node_modules/@types/jsonwebtoken/index.d";
import express from "express";
import mongoose from "mongoose";
import User from "./models/User";
import jwt from "jsonwebtoken";

const app = express();
const PORT: any = process.env.PORT_ONE || 7070;

mongoose
  .connect("mongodb://127.0.0.1:27017/auth-srv")
  .then(() => {
    console.log("Auth-srv DB connected");
  })
  .catch((err) => {
    console.error(err);
  });

app.use(express.json());

app.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.json({ message: "User doesn't exist" });
  } else {
    //check if enetered pswd is valid
    if (password !== user.password) {
      return res.json({ message: "Password incorrect" });
    }
    const payload = {
      email,
      name: user.name,
    };
    jwt.sign(payload, "secret", (err, token) => {
      if (err) {
        console.error(err);
      } else {
        return res.json({ token });
      }
    });
  }
});

app.post("/auth/regiter", async (req, res) => {
  const { email, password, name } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.json({ message: "User already exists" });
  } else {
    const newUser = new User({
      name,
      email,
      password,
    });
    newUser.save();
    return res.json(newUser);
  }
});

app.listen(PORT, () => {
  console.log(`Auth-srv at port: ${PORT}`);
});
