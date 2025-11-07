var express = require('express');
var router = express.Router();
const OrdersSchema = require('../models/orders.model.js')

router.get('/', async function(req, res, next) {

  try {
    let orders = await OrdersSchema.find({})

    res.send({
      status: 200,
      message: "success",
      data: orders
    });
  } catch (error) {
    res.status(500).send({
      status: 500,
      message: "Server Timeout",
      data: []
    })
  }
});

module.exports = router;

