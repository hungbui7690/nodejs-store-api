const Product = require('../models/product')

const getAllProductsStatic = async (req, res) => {
  const products = await Product.find({}).sort('-name price')
  res.status(200).json({ products, nbHits: products.length })
}

const getAllProducts = async (req, res) => {
  // (a)
  const { featured, company, name, sort, fields } = req.query
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

  // to make sort work, need to change to let + remove await >> otherwise, will return error
  let products = Product.find(queryObject)

  if (sort) {
    const sortList = sort.split(',').join(' ')
    products = products.sort(sortList)
  } else {
    products = products.sort('createdAt')
  }

  // (b)
  if (fields) {
    const fieldsList = fields.split(',').join(' ')
    products = products.select(fieldsList)
  }

  // (c) must have this, otherwise error
  const newProducts = await products

  res.status(200).json({ nbHits: products.length, newProducts }) // using newProducts, not products
}

module.exports = { getAllProducts, getAllProductsStatic }
