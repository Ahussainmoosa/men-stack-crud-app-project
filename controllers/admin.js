const express = require("express");
const router = express.Router();
const Order = require("../models/order");
const isSignedIn = require("../middleware/is-signed-in");
const isAdmin = require("../middleware/is-admin");

// routes
router.get("/orders",isSignedIn, isAdmin, async (req, res) => {
  const orders = await Order.find().populate("user").populate("items.product");
  res.render("product/order-list", { orders });
});

router.delete('/orders/:id', async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.redirect('/admin/orders');
  } catch (err) {
    console.error(err);
    res.send('Error deleting order');
  }
});

module.exports = router;
