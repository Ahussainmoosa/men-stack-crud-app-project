const express = require('express');
const router = express.Router();
const Cart = require('../models/cart.js');
const Product = require('../models/product.js');

//list cart items
router.get('/', async (req, res) => {
  try {
    console.log('Session user:', req.session.user);

    let cart = { items: [] };
    const products = await Product.find();

    if (req.session.user && req.session.user._id) {
      //for sign in user
      cart = await Cart.findOne({ userId: req.session.user._id });
      cart = cart || { items: [] };
      cart.items = cart.items || [];
      const productIds = cart.items.map(i => i.product);
      const productsMap = await Product.find({ _id: { $in: productIds } })
        .then(list => list.reduce((acc, p) => ({ ...acc, [p._id.toString()]: p }), {}));

      cart.items = cart.items.map(i => ({
        product: productsMap[i.product.toString()] || null,
        quantity: i.quantity
      }));
    } else {
      //for gust cart scession
      cart = req.session.cart || { items: [] };
      cart.items = cart.items || [];
      cart.items = cart.items.map(item => {
        const product = products.find(p => p._id.toString() === item.productId);
        return { product, quantity: item.quantity };
      });
    }
    res.render('product/cart', { cart, products });
  } catch (error) {
    console.error('Cart GET error:', error);
    res.send('Error loading the cart!');
  }
});

//add product to cart
router.post('/:productId', async (req, res) => {
  const productId = req.params.productId;
  const quantity = 1;
  if (req.session.user) {
    //for sign in user
    let cart = await Cart.findOne({ userId: req.session.user._id });
    if (!cart) {
      cart = new Cart({ userId: req.session.user._id, items: [{ product: productId, quantity }] });
    } else {
      //to check items array
      cart.items = cart.items || [];
      const existing = cart.items.find(i => i.product.toString() === productId);
      if (existing) existing.quantity += 1;
      else cart.items.push({ product: productId, quantity });
    }
    await cart.save();
  } else {
    //for gust
    if (!req.session.cart) req.session.cart = { items: [] };
    req.session.cart.items = req.session.cart.items || [];
    const existing = req.session.cart.items.find(i => i.productId === productId);
    if (existing) existing.quantity += 1;
    else req.session.cart.items.push({ productId, quantity });
  }
  res.redirect('/cart');
});

//remove item from cart
router.delete('/:productId', async (req, res) => {
  const productId = req.params.productId;

  if (req.session.user) {
    const cart = await Cart.findOne({ userId: req.session.user._id });
    if (cart && cart.items) {
      cart.items = cart.items.filter(i => i.product.toString() !== productId);
      await cart.save();
    }
  } else {
    if (req.session.cart && req.session.cart.items) {
      req.session.cart.items = req.session.cart.items.filter(i => i.productId !== productId);
    }
  }
  res.redirect('/cart');
});

//update the quantity of a product in the cart
router.put('/:productId', async (req, res) => {
  const productId = req.params.productId;
  const { quantity } = req.body;
  if (req.session.user) {
    //for sign in user
    const cart = await Cart.findOne({ userId: req.session.user._id });
    if (cart && cart.items) {
      const item = cart.items.find(i => i.product.toString() === productId);
      if (item) {
        item.quantity = Number(quantity);
        await cart.save();
      }
    }
  } else if (req.session.cart && req.session.cart.items) {
    //for gust
    const item = req.session.cart.items.find(i => i.productId === productId);
    if (item) {
      item.quantity = Number(quantity);
    }
  }
  res.redirect('/cart');
});

module.exports = router;
