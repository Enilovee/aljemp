import path from 'path'
import express from 'express'
const app = express()

import dotenv from 'dotenv'
 import cookieParser from 'cookie-parser'
dotenv.config()
import connectDB from './config/db.js';
import {notFound, errorHandler} from './middleware/errorHandler.js'
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoute.js';
import orderRoutes from './routes/orderRoute.js';
import uploadRoutes from './routes/uploadRoutes.js'
const port = process.env.PORT;

connectDB();


// body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

    // cookie paarser middleware
    app.use(cookieParser())



app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/upload', uploadRoutes);

app.get('/api/config/paypal', (req, res) =>
  res.send({ clientId: process.env.PAYPAL_CLIENT_ID })
);
 const __dirname = path.resolve() // set__dirname to currrent directory
 app.use('/uploads', express.static(path.join(__dirname, '/uploads')))

if (process.env.NODE_ENV ==='production') {
  // set static folder
  app.use(express.static(path.join(__dirname, '/frontend/build')))

  // any route that is not api will be redirected to index.html
  app.get('*', (req, res) =>
     res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html')))
} else {
  app.get('/',(req, res)=> {
    res.send('Api dey run ')
})
}

app.use(notFound);
app.use(errorHandler);




app.listen(port, ()=>console.log(`Server is running on ${port}`))