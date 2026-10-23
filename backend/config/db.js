import mongoose from "mongoose";

// Connect to MongoDB using the database link from the .env file.
// Stop the server if the connection fails because the app needs the database to work.
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    process.exit(1); 
  }
};

export default connectDB;