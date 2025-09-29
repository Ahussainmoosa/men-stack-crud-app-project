// const express = require('express');
// const router = express.Router();
// const Cart = require ('../models/cart.js');
// const multer  = require('multer'); //for photo
// const { findByIdAndDelete, findByIdAndUpdate } = require('../models/user.js');
// const upload = multer({ dest: 'uploads/' })// for import the photo from uplods


// router.get('/',async(req,res)=>{
//     try {
//         res.render('products/cart.ejs');
//     } catch (error) {
//         res.send('error!');
//     }
// });

// router.post("/", async (req, res) => {
//   const newCart = new Cart(req.body);
//   await newCart.save();
//   res.redirect("/cart");
// });

// router.delete('/cart/:cartId', async (req, res) => {
//   await Cart.findByIdAndDelete(req.params.cartId);
//   res.redirect(`/users/${req.params.cartId}/cart`);
// });


// router.put('/cart/:cartId', upload.single('image'), async (req, res) => {
//   try {
//     const updateCart ={
//         name:req.body.name,
//         ingredients:req.body.ingredients,
//         description:req.body.description,
//         image : req.file ? req.file.filename :null
//     }
//     await Cart.findByIdAndUpdate(req.params.cartId, updateCart);
//     res.redirect(`/users/${req.params.cartId}/cart`);
//   } catch (error) {
//     res.send('error with updating with the cart !!')
//   }
// });

// module.exports=router;