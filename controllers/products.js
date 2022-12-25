const Product = require('../models/product')

const getAllProductsStatic = async (req, res) => {
  res.status(200).json({ msg: 'products testing route' })
}

const getAllProducts = async (req, res) => {
  // (a)
  const { featured, company, name } = req.query
  const queryObject = {}

  // (b) add featured to queryObject
  if (featured) {
    queryObject.featured = featured === 'true' ? true : false
  }

  // (c)
  if (company) {
    queryObject.company = company
  }

  // (d)
  if (name) {
    queryObject.name = { $regex: name, $options: 'i' }
  }

  console.log(queryObject)

  const products = await Product.find(queryObject) // apply here

  res.status(200).json({ nbHits: products.length, products })
}

module.exports = { getAllProducts, getAllProductsStatic }
