const { Category } = require('../models/category');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  const categoryList = await Category.find();

  if (!categoryList) {
    res.status(500).json({ success: false });
  }
  res.status(200).send(categoryList);
});

router.put('/:id', async (req, res) => {
  let id = req.params.id;
  const category = await Category.findByIdAndUpdate(
    id,
    {
      name: req.body.name,
      icon: req.body.icon,
      color: req.body.color,
    },
    { new: true }
  );

  if (!category) return res.status(404).send('the category cannot be created!');

  res.send(category);
});

router.get('/:id', async (req, res) => {
  let id = req.params.id;
  const category = await Category.findById(id);

  if (!category)
    return res
      .status(500)
      .json({ message: 'The Category with the given ID was removed' });

  res.status(200).send(category);
});

router.post('/', async (req, res) => {
  let category = new Category({
    name: req.body.name,
    icon: req.body.icon,
    color: req.body.color,
  });

  category = await category.save();

  if (!category) return res.status(404).send('the category cannot be created!');

  res.send(category);
});

router.delete('/:id', (req, res) => {
  let id = req.params.id;
  Category.findByIdAndRemove(id)
    .then((category) => {
      if (category) {
        return res
          .status(200)
          .json({ success: true, message: 'the category is deleted!' });
      } else {
        return res
          .status(404)
          .json({ success: false, message: 'Category not found' });
      }
    })
    .catch((err) => {
      return res.status(400).json({ success: false, error: err });
    });
});
module.exports = router;
