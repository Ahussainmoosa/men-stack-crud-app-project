//product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String ,
    required: true,
  },
  type: {
    type:String ,
    required:true,
    },
  categoryId:{
    type: mongoose.Schema.Types.ObjectId,
    ref:'Category',
    required: true,
  },
  description: { 
    type: String,
  },
  image :{
    type:String,
  },
  price:{
    type:String,
    required: true,
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;