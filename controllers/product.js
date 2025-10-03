const express = require('express');
const router = express.Router();
const multer  = require('multer'); //for photo
const Product = require ('../models/product.js');
const upload = multer({ dest: 'uploads/' }) // for import the photo from uploads

//to get all product
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.render('product/index', { products });
  } catch (error) {
    res.send('error with loading the product!');
  }
});

//to add a new product
router.get("/new", (req, res) => {
  res.render("product/new");
});

router.post("/", upload.single('image'), async (req, res) => {
  try {
    const newProduct = new Product({
      name: req.body.name,
      categoryId: req.body.categoryId,
      description: req.body.description,
      image: req.file ? req.file.filename : null,
      price: req.body.price,
      user: req.session.user ? req.session.user._id : null,
    });
    await newProduct.save(); //saving the new product
    res.redirect('/product');
  } catch (error) {
    res.send(error);
  }
});

//list single product
router.get("/:productId", async (req, res) => {
  const products = await Product.findById(req.params.productId);
  res.render("product/show", { products });
});

//delete product
router.delete('/:productId', async (req, res) => {
  await Product.findByIdAndDelete(req.params.productId);
  res.redirect('/product');
});

//to edit product
router.get("/:productId/edit", async (req, res) => {
  const products = await Product.findById(req.params.productId);
  res.render('product/edit', { products });
});

//to update product
router.put('/:productId', upload.single('image'), async (req, res) => {
  try {
    const updateProduct = {
      name: req.body.name,
      categoryId: req.body.categoryId,
      description: req.body.description,
      image: req.file ? req.file.filename : null,
      price: req.body.price,
    };
    await Product.findByIdAndUpdate(req.params.productId, updateProduct, { new: true });
    res.redirect('/product');
  } catch (error) {
    res.send(error);
  }
});

//add product to cart
router.post("/:productId/add-to-cart", async (req, res) => {
  const productId = req.params.productId;
  if (req.session.user) {
    //for sign in user
    const Cart = require('../models/cart');
    let cart = await Cart.findOne({ userId: req.session.user._id });
    if (!cart) {
      cart = new Cart({ userId: req.session.user._id, items: [{ product: productId, quantity: 1 }] });
    } else {
      const item = cart.items.find((i) => i.product.toString() === productId);
      if (item) item.quantity += 1;
      else cart.items.push({ product: productId, quantity: 1 });
    }
    await cart.save();
  } else {
    //to check gust cart secssion
    if (!req.session.cart) req.session.cart = [];
    const item = req.session.cart.find((i) => i.productId === productId);
    if (item) item.quantity += 1;
    else req.session.cart.push({ productId, quantity: 1 });
  }
  res.redirect("/cart");
});

module.exports = router;
