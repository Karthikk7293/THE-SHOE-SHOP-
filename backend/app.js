const express = require('express')
const app = express()
const cookieParser = require('cookie-parser')
const cors = require('cors');

const errorMiddleware = require('./middleware/error')

app.use(express.json())
app.use(cookieParser())
app.use(cors());

//product routes
const products = require('./routes/productRoutes')
// user Routes
const users = require('./routes/userRoutes')
// order Routes
const order = require('./routes/orderRoutes')


 app.use('/api/v1',products)
 app.use('/api/v1',users)
 app.use('/api/v1',order)



 //middleware for error

app.use(errorMiddleware)




module.exports = app