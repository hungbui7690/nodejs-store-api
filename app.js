/*
  - Setup basic express server
  - Connect to DB 
    + setup env
    + app.js >> import connect.js and use
  - /controllers >> setup getAllProducts and getAllProductsStatic route >> the static one is used to test when we work in controller
  - /models >> setup model
  - when we have model: use that to populate data to db using populate.js
*/

require('dotenv').config()

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
