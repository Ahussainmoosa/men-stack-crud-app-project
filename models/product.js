//product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String ,
    required: true,
  },
  categoryId:{
    type: mongoose.Schema.Types.ObjectId,
    ref:'Category',
    required: false,
  },
  description: { 
    type: String,
  },
  image :{
    type:String,
  },
  price:{
    type:Number,
    required: true,
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;