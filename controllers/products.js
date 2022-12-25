const Product = require('../models/product')

const getAllProductsStatic = async (req, res) => {
  const products = await Product.find({}).sort('-name price')
  res.status(200).json({ products, nbHits: products.length })
}

const getAllProducts = async (req, res) => {
  // (a)
  const { featured, company, name, sort } = req.query
  const queryObject = {}

  if (featured) {
    queryObject.featured = featured === 'true' ? true : false
  }
  if (company) {
    queryObject.company = company
  }
  if (name) {
    queryObject.name = { $regex: name, $options: 'i' }
  }

  // (a) to make this work >>> must remove await & use let
  let products = Product.find(queryObject)

  if (sort) {
    // (b) sort
    const sortList = sort.split(',').join(' ') // we need space between each sort term >> name price, NOT nameprice (check getAllProductsStatic above)
    products = products.sort(sortList)
  } else {
    // (c)
    products = result.sort('createdAt')
  }

  res.status(200).json({ nbHits: products.length, products })
}

module.exports = { getAllProducts, getAllProductsStatic }
