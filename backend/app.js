const express = require('express')
const app = express()
const cookieParser = require('cookie-parser')
const cors = require('cors');
const bodyParser = require("body-parser")
const fileUpload = require("express-fileupload")

const errorMiddleware = require('./middleware/error')

app.use(express.json())
app.use(cookieParser())
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());

//product routes
const products = require('./routes/productRoutes')
// user Routes
const users = require('./routes/userRoutes')
// order Routes
const order = require('./routes/orderRoutes');

const urlencoded = require('body-parser/lib/types/urlencoded');


 app.use('/api/v1',products)
 app.use('/api/v1',users)
 app.use('/api/v1',order)

 app.get('/api/v1/config/paypal',(req,res)=>res.send(process.env.PAYPAL_CLIENT_ID))



 //middleware for error

app.use(errorMiddleware)




module.exports = app