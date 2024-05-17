const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const connectDB = async (DB_USER, DB_PASS) => {
  try {        
    const DB_USER = process.env.DB_USER;
    const DB_PASS = process.env.DB_PASSWORD;
    const uri = `mongodb+srv://${DB_USER}:${DB_PASS}@airbus.s8edeg4.mongodb.net/?retryWrites=true&w=majority&appName=Airbus`;
    await mongoose.connect(uri);
    console.log(`Successfully connected to MongoDB 👍`);
  } catch (error) {
    console.error(`ERROR: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
