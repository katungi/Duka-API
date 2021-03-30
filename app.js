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

app.get(`${api}/products`, (req, res) => {
  const product = {
    id: 1,
    name: 'hair dresser',
    image: 'some_url',
  };
  res.send(product);
});

app.post(`${api}/products`, (req, res) => {
  const newProduct = req.body;
  console.log(newProduct);
  // res.send(product);
});

app.listen(3000, () => {
  console.log(api);
  console.log(`running at 3000`);
});
