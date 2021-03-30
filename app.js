const express = require('express');
const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');
require('dotenv/config');

// middleware
app.use(express.json());
app.use(morgan('tiny'));

// model
const Product = require('./models/product');
// routes
const productRouter = require('./routes/products');
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
app.use(`${api}/products`, productRouter);

app.listen(3000, () => {
  console.log(api);
  console.log(`running at 3000`);
});
