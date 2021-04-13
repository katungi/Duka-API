const express = require('express');
const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');

require('dotenv/config');

app.use(cors());
app.options('*', cors());

// middleware
app.use(express.json());
app.use(morgan('tiny'));

// model
const Product = require('./models/product');
// routes
const productsRoutes = require('./routes/products');
const categoriesRoutes = require('./routes/categories');
const usersRoutes = require('./routes/users');
const ordersRoutes = require('./routes/orders');

const api = process.env.API_URL;

mongoose
  .connect(process.env.DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'eshop',
  })
  .then(() => {
    console.log('DB connected....');
  })
  .catch(() => {
    console.log(err);
  });

// routes
app.use(`${api}/products`, productsRoutes);
app.use(`${api}/categories`, categoriesRoutes);
app.use(`${api}/users`, usersRoutes);
app.use(`${api}/ordersRoutes`, ordersRoutes);

app.listen(3000, () => {
  console.log(`running at 3000`);
});
