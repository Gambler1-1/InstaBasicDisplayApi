const path = require(`path`);
const Product = require("../models/product");
const Cart = require("../models/cart");
const { name } = require("ejs");
const { Result } = require("express-validator");
const { get } = require("http");

async function getIndex(req, res, next) {
  // let isAuthenticated = false
  // if(req.user){
  //    isAuthenticated = true
  // }
  const { name } = req.query;
  const queryObject = {};
  if (name) {
    queryObject.name = { $regex: name, $options: "i" };
  }

  if (req.user) {
    var username = req.user.name;
  }

  try {
    let products = await Product.find(queryObject);
    res.render("shop", {
      // isAuthenticated,
      prods: products,
      pageTitle: "Shop",
      Authenticate: true,
      name: username,
    });
  } catch (error) {
    console.error(error);
    res.redirect("/auth/login");
  }
}
////////////////////CARRRRRRTTT///////////////////////////////////////////
async function getCart(req, res, next) {
  if (req.user) {
    var username = req.user.name;
    var userId = req.user.id;
  }

  try {
    let cart = await Cart.findOne({ userId: userId });
    let cartItems = cart.items;

    async function readData(cartItems) {
      let data = [];

      for (let i = 0; i < cartItems.length; i++) {
        let iid = cartItems[i].productId;
        let qty = cartItems[i].quantity;
        let qtyObj = { qty };
        let cartProducts = await Product.findById({ _id: iid });
        const allRules = Object.assign({}, cartProducts._doc, qtyObj);

        // console.log(allRules);
        data.push(allRules);
      }
      return data;
    }
    let result = await readData(cartItems);
    let totalPrice = 0;
    for (let i = 0; i < result.length; i++) {
      totalPrice += result[i].price * result[i].qty;
    }
    // console.log(`TOTAL PRICE IS ${totalPrice}`);
    let itemsCount = result.length;
    // console.log(result);

    res.render("cart2", {
      // isAuthenticated,
      items: result,
      itemsCount: itemsCount,
      pageTitle: "Cart",
      Authenticate: true,
      name: username,
      totalPrice,
    });
  } catch (error) {
    console.error(error);
    res.redirect("/auth/login");
  }
}
// for (let i = 0; i < cartItems.length; i++) {
//   let prodId = cartItems[i].productId;
//   console.log(prodId);

//   let cartProducts = await Product.findOne({
//     productId: prodId,
//   });
//   // console.log(cartProducts);

//   let quantity = cartItems[i].quantity;
//   data.push(cartProducts, { quantity });
// }
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
async function addToCart(req, res, next) {
  const productId = req.params.id;
  const userId = req.user._id;
  try {
    const oldCart = await Cart.findOne({ userId });
    if (oldCart) {
      let found = false;
      console.log("CART FOUND");
      const oldItems = oldCart.items;

      for (let i = 0; i < oldItems.length; i++) {
        if (oldItems[i].productId == productId) {
          console.log("product found");
          found = true;
          console.log(`Old Qty: ${oldItems[i].quantity}`);
          newQty = oldItems[i].quantity + 1;
          oldItems[i].quantity = newQty;
          console.log(`New Qty: ${oldItems[i].quantity}`);
          await oldCart.save();
          res.redirect("/cart");
          break;
        }
      }
      if (!found) {
        console.log("Product is not in Cart... Adding it Now....");
        const newitem = {
          productId,
        };
        oldCart.items.push(newitem);
        const updatedList = await oldCart.save();
        console.log("Product Added in Cart");
        res.redirect("/");
      }
    } else {
      const cart = new Cart({
        userId: userId,
        items: [
          {
            productId: productId,
          },
        ],
      });
      await cart.save();
      console.log("Cart Created");
      res.redirect("/");
    }
  } catch (error) {
    console.log(error);
  }
}
// res.status(200).json({ product }).redirect('./add-product')

const viewProduct = async (req, res) => {
  const { id: prodID } = req.params;
  const product = await Product.findOne({ _id: prodID });

  if (!product) {
    res.status(200).json({ message: "Product not found" });
  }
  res.status(200).json({ product });
  console.log("Product Found");
  console.log(product);
};

module.exports = {
  getIndex,
  viewProduct,
  addToCart,
  getCart,
};
