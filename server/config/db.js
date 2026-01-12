import mongoose from "mongoose";

const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("MongoDB Connected");
};
console.log("ENV CHECK:", process.env.MONGO_URI);

export default connectDB;
