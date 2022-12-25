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

  let products = Product.find(queryObject)

  if (sort) {
    const sortList = sort.split(',').join(' ')
    products = products.sort(sortList)
  } else {
    products = products.sort('createdAt _id')
  }

  if (fields) {
    const fieldsList = fields.split(',').join(' ')
    products = products.select(fieldsList)
  }

  // (a) setup pagination
  const page = Number(req.query.page) || 1
  const limit = Number(req.query.limit) || 10
  const skip = (page - 1) * limit

  console.log(sort, page, limit, skip)
  // (b)
  products = products.limit(limit).skip(skip)

  const newProducts = await products

  res.status(200).json({ nbHits: products.length, newProducts })
}

module.exports = { getAllProducts, getAllProductsStatic }
