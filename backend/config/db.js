const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || (
      process.env.NODE_ENV === "production"
        ? ""
        : "mongodb://127.0.0.1:27017/CampusPulse"
    );

    if (!mongoUri) {
      throw new Error("MONGO_URI must be configured in production.");
    }

    await mongoose.connect(mongoUri, { dbName: "CampusPulse" });

    console.log("MongoDB connected successfully to database: CampusPulse");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    throw error;
  }
};

module.exports = connectDB;