import mongoose from "mongoose";
import { MONGO_URI } from "../config";

export function connectDB() {
  mongoose
    .connect(MONGO_URI)
    .then(() => {
      console.log("Database connected successfully");
    })
    .catch((error) => {
      console.log("fail to connect database", error);
    });
}
