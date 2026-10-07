const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || (
      process.env.NODE_ENV === "production"
        ? ""
        : "mongodb://127.0.0.1:27017/campus-pulse"
    );

    if (!mongoUri) {
      throw new Error("MONGO_URI must be configured in production.");
    }

    await mongoose.connect(mongoUri);

    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    throw error;
  }
};

module.exports = connectDB;