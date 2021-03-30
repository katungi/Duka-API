const express = require('express');
const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');
require('dotenv/config');

// middleware

app.use(express.json());
app.use(morgan('tiny'));

// model

const productSchema = mongoose.Schema({
  name: String,
  image: String,
  countInStock: Number,
});

const Product = mongoose.model('Product', productSchema);

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

app.get(`${api}/products`, async (req, res) => {
  const productList = await Product.find();
  res.send(productList);
});

app.post(`${api}/products`, (req, res) => {
  const product = new Product({
    name: req.body.name,
    image: req.body.image,
    countInStock: req.body.countInStock,
  });

  product
    .save()
    .then((createdProduct) => {
      res.status(201).json(createdProduct);
      console.log('Created new product');
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
        success: false,
      });
    });
  // console.log(newProduct);
  // res.send(product);
});

app.listen(3000, () => {
  console.log(api);
  console.log(`running at 3000`);
});
