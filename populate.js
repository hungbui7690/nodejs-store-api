require('dotenv').config()

const connectDB = require('./db/connect')
const Product = require('./models/product')

const jsonProduct = require('./products.json')

const start = async () => {
  try {
    // ====== Connect to DB
    await connectDB(process.env.MONGO_URI)
    console.log('Success Connecting to DB...')

    // ====== populate
    await Product.deleteMany()
    await Product.create(jsonProduct)
    console.log('Success Populating to DB...')
    process.exit(0)
  } catch (error) {
    console.log(error)
    process.exit(1)
  }
}

start()
