const { Product } = require('../models/product');
const express = require('express');
const { Category } = require('../models/category');
const mongoose = require('mongoose');
const router = express.Router();

router.get(`/`, async (req, res) => {
  // let's not forget to query by category
  let filterByCategory = {};
  if (req.query.categories) {
    filterByCategory = { category: req.query.categories.split(',') };
  }
  const productList = await Product.find(filterByCategory).populate('category');

  if (!productList) {
    res.status(500).json({ success: false });
  }
  res.send(productList);
});

router.get(`/:id`, async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(500).json({ success: false });
  }
  res.send(product);
});

router.post(`/`, async (req, res) => {
  const category = await Category.findById(req.body.category);
  if (!category) return res.status(400).send('Invalid Category');

  let product = Product({
    name: req.body.name,
    description: req.body.description,
    richDescription: req.body.richDescription,
    image: req.body.image,
    brand: req.body.brand,
    price: req.body.price,
    category: req.body.category,
    countInStock: req.body.countInStock,
    rating: req.body.rating,
    numReviews: req.body.numReviews,
    isFeatured: req.body.isFeatured,
  });

  product = await product.save();

  if (!product) return res.status(500).send('The Product cannot be created');

  return res.status(200).send(product);
});

router.put('/:id', async (req, res) => {
  let id = req.params.id;
  if (!mongoose.isValidObjectId(req.params.id)) {
    res.status(400).send('Invalid product ID');
  }

  const category = await Category.findById(req.body.category);
  if (!category) return res.status(400).send('Invalid Category');

  const product = await Product.findByIdAndUpdate(
    id,
    {
      name: req.body.name,
      description: req.body.description,
      richDescription: req.body.richDescription,
      image: req.body.image,
      brand: req.body.brand,
      price: req.body.price,
      category: req.body.category,
      countInStock: req.body.countInStock,
      rating: req.body.rating,
      numReviews: req.body.numReviews,
      isFeatured: req.body.isFeatured,
    },
    { new: true }
  );

  if (!product) return res.status(404).send('the Product cannot be created!');

  res.send(product);
});

router.delete('/:id', (req, res) => {
  let id = req.params.id;
  Product.findByIdAndRemove(id)
    .then((product) => {
      if (product) {
        return res
          .status(200)
          .json({ success: true, message: 'the product is deleted!' });
      } else {
        return res
          .status(404)
          .json({ success: false, message: 'product not found' });
      }
    })
    .catch((err) => {
      return res.status(400).json({ success: false, error: err });
    });
});

// get stats like the count (This is just for good practice)
router.get(`/get/count`, async (req, res) => {
  const productCount = await Product.countDocuments((count) => {
    count;
  });

  if (!productCount) {
    res.status(500).json({ success: false });
  }
  res.send({
    productCount: productCount,
  });
});

// let's get the featured products
router.get(`/get/featured/:count`, async (req, res) => {
  // basically if you pass a count, we will display featured elements as that count, else display all
  const count = req.params.count ? req.params.count : 0;
  const product = await Product.find({ isFeatured: true }).limit(+count);

  if (!product) {
    res.status(500).json({ success: false });
  }
  res.send({
    product: product,
  });
});

// filter by category using query parameters

module.exports = router;
