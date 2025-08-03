import mongoose from "mongoose";

export const connectDB = () => {
  mongoose
    .connect(process.env.MONGO_URI, {
      dbName: "linkedin-mini",
    })
    .then((c) => {
      console.log(`MongoDB connected: ${c.connection.host}`);
    })
    .catch((err) => {
      console.error(`Error connecting to MongoDB: ${err.message}`);
      process.exit(1);
    });
};
