const { MongoClient } = require('mongodb');
const jwt = require('jsonwebtoken');
const dotenv = require("dotenv");
const User = require("../../models/users.model")
dotenv.config();


const secretKey = '123';

module.exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ username: email, password });
    if (user) {
      const token = jwt.sign({ email: user.email, userType: user.userType }, secretKey);
      res.status(200).json({ message: "User authenticated successfully", token });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    console.error("Error during user authentication:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
