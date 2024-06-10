import mongoose from "mongoose";
import { Schema } from "mongoose";

const UserSchema = new Schema({
  name: String,
  email: {
    type: String,
    unique: true,
  },
  password: String,
  created_at: {
    type: Date,
    default: Date.now(),
  },
});

const User = mongoose.model("user", UserSchema);

export default User;
