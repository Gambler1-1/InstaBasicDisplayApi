const express = require("express");
const router = express.Router();
const isAuth = require("../middlewares/is-auth");

const {
  HomePage,
  getIndex,
  viewProduct,
  addToCart,
  getCart,
} = require("../controllers/home");

router.route("/").get(getIndex);
router.route("/cart").get(getCart);

router.route("/addToCart/:id").get(isAuth, addToCart);
router.route("/product/:id").get(viewProduct);

module.exports = router;
