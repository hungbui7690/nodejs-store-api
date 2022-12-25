const Product = require('../models/product')

const getAllProductsStatic = async (req, res) => {
  const products = await Product.find({}).sort('-name price')
  res.status(200).json({ products, nbHits: products.length })
}

const getAllProducts = async (req, res) => {
  // === (1)
  const { featured, company, name, sort, fields, numericFilters } = req.query
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

  // (2) +++ NUMERIC FILTERS
  if (numericFilters) {
    // (a) stackoverflow
    const operatorMap = {
      '>': '$gt',
      '>=': '$gte',
      '=': '$eq',
      '<': '$lt',
      '<=': '$lte',
    }

    // (b)
    const regEx = /\b(<|>|>=|=|<|<=)\b/g
    let filters = numericFilters.replace(regEx, (match) => {
      return `-${operatorMap[match]}-`
    })
    console.log(filters)

    // === (2)
    const options = ['price', 'rating'] // these are 2 fields that have number value

    filters = filters.split(',').forEach((item) => {
      // (a)
      const [field, operator, value] = item.split('-')

      // (b)
      console.log(field, operator, value)

      // (c) add vào queryObject
      if (options.includes(field)) {
        queryObject[field] = { [operator]: Number(value) }
      }
    })
    console.log(queryObject)
  }

  let products = Product.find(queryObject)

  // +++ SORT
  if (sort) {
    const sortList = sort.split(',').join(' ')
    products = products.sort(sortList)
  } else {
    products = products.sort('createdAt _id')
  }

  // +++ FIELDS
  if (fields) {
    const fieldsList = fields.split(',').join(' ')
    products = products.select(fieldsList)
  }

  // +++ PAGINATION
  const page = Number(req.query.page) || 1
  const limit = Number(req.query.limit) || 10
  const skip = (page - 1) * limit

  products = products.limit(limit).skip(skip)

  const newProducts = await products

  res.status(200).json({ nbHits: products.length, newProducts })
}

module.exports = { getAllProducts, getAllProductsStatic }
