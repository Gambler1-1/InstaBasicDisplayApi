const express = require('express')
const router = express.Router()
const isAuth = require('../middlewares/is-auth')
const isAdmin = require('../middlewares/isAdmin')

const admin = require('../controllers/admin')
const {
  AddProduct,
  postAddProduct,
  deleteProduct,
  getProduct,
  updateProduct,
  
} = require('../controllers/admin')

// router.route('/add-product').get(isAuth,AddProduct)
router.route('/add-product').get(isAdmin,AddProduct)

router.route('/postAddProduct').post(postAddProduct)

router.route('/product/:id').get(getProduct).delete(deleteProduct).patch(updateProduct)


module.exports = router
