//foods.js
const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
  name: {type: String ,require: true},
  ingredients:{type: String ,require: true},
  description: { type: String},
  image :{type:String},
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

const Food = mongoose.model('Food', foodSchema);
module.exports = Food;