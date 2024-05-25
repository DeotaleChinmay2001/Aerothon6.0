const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  userType: { type: String, default: 'regular' }
});

const User = mongoose.model('User', userSchema);

module.exports = User;