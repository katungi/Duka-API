const { Order } = require('../models/order');
const express = require('express');
const { OrderItem } = require('../models/order-item');
const router = express.Router();

router.get(`/`, async (req, res) => {
  const orderList = await Order.find()
    .populate('user', 'name')
    .sort({ dateOrdered: -1 });

  if (!orderList) {
    res.status(500).json({ success: false });
  }
  res.send(orderList);
});

router.get(`/:id`, async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate('user', 'name')
    .populate({
      path: 'orderItems',
      populate: {
        path: 'product',
        populate: 'category',
      },
    });

  if (!order) {
    res.status(500).json({ success: false });
  }
  res.send(order);
});

router.put('/:id', async (req, res) => {
  // only update order status

  let id = req.params.id;
  const order = await Category.findByIdAndUpdate(
    id,
    {
      status: req.body.status,
    },
    { new: true }
  );

  if (!order) return res.status(404).send('the order cannot be created!');

  res.send(order);
});

router.post('/', async (req, res) => {
  // you have to populate order-items first as an array
  const orderItemsIds = Promise.all(
    req.body.orderItems.map(async (orderItem) => {
      let newOrderItem = new OrderItem({
        quantity: orderItem.quantity,
        product: orderItem.product,
      });

      newOrderItem = await newOrderItem.save();
      return newOrderItem._id;
    })
  );

  const orderItemIdsResolved = await orderItemsIds;
  let order = new Order({
    orderItems: orderItemIdsResolved,
    shippingAddress1: req.body.shippingAddress1,
    shippingAddress2: req.body.shippingAddress2,
    city: req.body.city,
    zip: req.body.zip,
    country: req.body.country,
    phone: req.body.phone,
    status: req.body.status,
    totalPrice: req.body.totalPrice,
    user: req.body.user,
  });

  order = await order.save();

  if (!order) return res.status(404).send('the order cannot be created!');

  res.send(order);
});

router.delete('/:id', (req, res) => {

  // we also have to delete order items when order is deleted
  let id = req.params.id;
  Order.findByIdAndRemove(id)
    .then((order) => {
      if (order) {
        await order.orderItems.map(async orderItem=>{
          // I will probably need to catch some errors here
          await OrderItem.findByIdAndRemove(orderItem)
        });
        return res
          .status(200)
          .json({ success: true, message: 'the order is deleted!' });
      } else {
        return res
          .status(404)
          .json({ success: false, message: 'order not found' });
      }
    })
    .catch((err) => {
      return res.status(400).json({ success: false, error: err });
    });
});

module.exports = router;
