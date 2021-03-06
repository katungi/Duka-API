const { Product } = require('../models/product');
const express = require('express');
const { Category } = require('../models/category');
const mongoose = require('mongoose');
const multer = require('multer');
const router = express.Router();

const FILE_TYPE_MAP = {
  'image/png': 'png',
  'image/jpg': 'jpg',
  'image/jpeg': 'jpeg',
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const isValid = FILE_TYPE_MAP[file.mimetype];
    let uploadError = new Error('Invalid Image Type');
    if (isValid) {
      uploadError = null;
    }
    cb(uploadError, '/public/uploads');
  },
  filename: function (req, file, cb) {
    const filename = file.originalname.split(' ').join('-');
    const extension = FILE_TYPE_MAP[file.mimetype];
    cb(null, `${filename}-${Date.now()}.${extension}`);
  },
});

const uploadOptions = multer({ storage: storage });

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

router.post(`/`, uploadOptions.single('image'), async (req, res) => {
  const category = await Category.findById(req.body.category);
  if (!category) return res.status(400).send('Invalid Category');

  const file = req.file;
  if (!file) return res.status(400).send('No uploaded file');
  const fileName = req.file.filename;
  const basePath = `${req.protocol}://${req.get('host')}/public/upload/`;
  let product = Product({
    name: req.body.name,
    description: req.body.description,
    richDescription: req.body.richDescription,
    image: `${basePath}${fileName}`,
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

router.put(
  'gallery-images/:id',
  uploadOptions.array('images', 10),
  async (req, res) => {
    let id = req.params.id;
    if (!mongoose.isValidObjectId(req.params.id)) {
      res.status(400).send('Invalid product ID');
    }
    const files = req.files;
    let imagePaths = [];
    const basePath = `${req.protocol}://${req.get('host')}/public/upload/`;
    if (files) {
      files.map((file) => {
        imagePaths.push(`${basePath}${file.fileName}`);
      });
    }

    const product = await Product.findByIdAndUpdate(
      id,
      {
        image: imagePaths,
      },
      { new: true }
    );
    if (!product) return res.status(404).send('the Product cannot be created!');

    res.send(product);
  }
);
// filter by category using query parameters

module.exports = router;
