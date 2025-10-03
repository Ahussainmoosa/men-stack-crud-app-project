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

module.exports = router;
