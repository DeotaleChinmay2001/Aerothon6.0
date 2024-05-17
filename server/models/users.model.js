const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  userType: { type: String, default: 'regular' }
});

const User = mongoose.model('User', userSchema);

// const newUser = new User({
//   _id: new mongoose.Types.ObjectId(), 
//   username: 'chinmay',
//   password: '123',
//   userType: 'regular' 
// });

// newUser.save()
//   .then(() => {
//     console.log('User added successfully');
//   })
//   .catch((error) => {
//     console.error('Error adding user:', error);
//   });

module.exports = User;