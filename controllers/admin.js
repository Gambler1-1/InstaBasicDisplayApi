
const Product = require("../models/product");
const path = require('path')

const getProduct = async (req, res) => {

  const { id: prodID } = req.params
  const product = await Product.findOne({ _id: prodID })

  if (!product) {
    res.status(200).json({message:'Product not found'})
  }
  res.status(200).json({ product })
  console.log('Product Found')
  console.log(product)
}

const deleteProduct = async (req, res) => {

   const { id: prodID } = req.params
   const product = await Product.findByIdAndRemove({ _id: prodID })

  if (!product) {
console.log("error not found")
  }
    res.status(200).json({message:'Product Removed'})
}

const AddProduct = (req, res) => {
  // let csrf = req.csrfToken();
//   csrf = res.locals.csrfToken
// console.log(csrf) 
console.log(res.Product)
  res.render('./admin/add-product');
}

const postAddProduct = async (req, res) => {
    const image = req.file
    const imageUrl = image.path  
    const product = new Product({
    name: req.body.name,
    price: req.body.price,
    description: req.body.description,
    imageUrl: imageUrl,
        // imageUrl: imageUrl,

  },
  
  );
  try {

    await product.save();
    console.log('Product Created')
      res.redirect('./add-product')
  } catch (error) {
    console.log(error)
  }
}

const updateProduct = async (req, res) => {
  const {
    body: { name, price },
    
    params: {id: prodID},
  } = req

  if (name === '' || price === '') {
    console.log(' fields cannot be empty')
  }
  const product = await Product.findByIdAndUpdate({ _id:prodID },req.body, { new: true, runValidators: true }
  )
  if (!product) {
   console.log(`No Product with id ${Id}`)
  }
  res.status(200).json({ product })
}



module.exports = {

  AddProduct,
  postAddProduct,
  updateProduct,
  deleteProduct,
  getProduct,
}


