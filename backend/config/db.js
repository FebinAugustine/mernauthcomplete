import mongoose from "mongoose";

const connectDb = async () => {
  console.log("Attempting to connect to MongoDB...");
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: "MERNAuthentication",
    });

    console.log("MongoDb connected");
  } catch (error) {
    console.log("Failed to connect:", error.message);
  }
};

export default connectDb;
