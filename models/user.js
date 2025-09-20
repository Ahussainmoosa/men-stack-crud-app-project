const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});
// user.js
const foodSchema = new mongoose.Schema({
  //creat and Define properties of food schema similer to above.
});
const User = mongoose.model('User', userSchema);

module.exports = User;