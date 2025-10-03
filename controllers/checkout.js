const express = require('express');
const router = express.Router();
const Cart = require('../models/cart');
const Order = require('../models/order');
const isSignedIn = require('../middleware/is-signed-in');

//checkout routes
router.get('/', async (req, res) => {
  try {
    let cartItems = [];
    let totalPrice = 0;
    if (req.session.user) {

      //get the cart from mongoos
      const cart = await Cart.findOne({ userId: req.session.user._id }).populate({
        path: 'items.product',
        select: '_id name price image'
      });
      if (cart) {
        cartItems = cart.items;
        totalPrice = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
      }
    } else {

      // to check the gust cart secssion
      if (!req.session.cart || req.session.cart.length === 0) {
        return res.send('Your cart is empty.');
      }
      cartItems = req.session.cart;
      totalPrice = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    }
    res.render('product/checkout', { cartItems, totalPrice });
  } catch (error) {
    res.send('Error loading checkout.');
  }
});

//cheack out post route
router.post('/', isSignedIn, async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.session.user._id }).populate({
      path: 'items.product',
      select: '_id name price image'
    });
    if (!cart || cart.items.length === 0) {
      return res.send('Your cart is empty.');
    }
    const totalPrice = cart.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const order = new Order({
      user: req.session.user._id,
      items: cart.items.map(item => ({
        product: item.product._id,
        quantity: item.quantity,
        price: item.product.price
      })),
      totalPrice,
      address: req.body.address,
      phone: req.body.phone,
      email: req.session.user.email,
      name: req.session.user.username
    });
    await order.save();
    await Cart.findByIdAndDelete(cart._id); //to empty the cart after the order submit.
    res.render('product/checkout-message');
  } catch (error) {
    console.log(error);
    res.send('Error placing order.');
  }
});

module.exports = router;
