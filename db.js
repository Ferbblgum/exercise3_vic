import  mongoose  from "mongoose";
const MONGO_URI = "mongodb://localhost:27017/terceroa"

export const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Mongo DB connection error:");
}
};