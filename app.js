/*
  {{URL}}/products?featured=true&company=caressa&name=&sort=price,-name >> sort by price (high to low) + name (Z-A) >> name will be use when price is the same

*/

require('dotenv').config()
require('express-async-errors')

const express = require('express')
const app = express()

const connectDb = require('./db/connect')

const productsRouter = require('./routes/products')

const notFoundMiddleware = require('./middleware/not-found')
const errorMiddleware = require('./middleware/error-handler')

// middleware
app.use(express.json())

// routes
app.get('/', (req, res) => {
  res.send(`
    <h1>Store API</h1>
    <a href="/api/v1/products">Products Route</a>
  `)
})

// products route
app.use('/api/v1/products', productsRouter)

app.use(notFoundMiddleware)
app.use(errorMiddleware)

//==============================
// START SERVER
//==============================

const port = process.env.PORT || 5000

const start = async () => {
  try {
    await connectDb(process.env.MONGO_URI)

    app.listen(port, console.log(`Server is listening on port ${port}...`))
  } catch (error) {
    console.log(error)
  }
}

start()
