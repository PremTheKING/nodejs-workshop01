var express = require('express');
var router = express.Router();
const ProductsSchema = require('../models/products.model.js')
const OrdersSchema = require('../models/orders.model.js')

const tokenMiddleware = require('../middleware/token.middleware.js');

// แสดงรายการ Product ทั้งหมด
router.get('/', async function (req, res, next) {

  try {
    let prod = await ProductsSchema.find({})

    res.send({
      status: 200,
      message: "success",
      data: prod
    });
  } catch (error) {
    res.status(500).send({
      status: 500,
      message: "Server Timeout",
      data: []
    })
  }
});

// ดูรายการ Product 1 รายการ
router.get('/:id', async function (req, res, next) {
  try {
    let prod = await ProductsSchema.findOne({ _id: req.params.id });

    res.send({
      status: 200,
      message: "success",
      data: prod
    })
  } catch (error) {
    res.status(500).send({
      status: 500,
      message: "Server Timeout",
      data: []
    })
  }
});

// แสดง Order ทั้งหมดของ Product
router.get('/:id/orders', async function (req, res, next) {
  try {
    let prod = await ProductsSchema.findOne({ _id: req.params.id });
    let orders = await OrdersSchema.find({product: prod.product})

    res.send({
      status: 200,
      message: "success",
      data: orders
    })
  } catch (error) {
    res.status(500).send({
      status: 500,
      message: "Server Timeout",
      data: []
    })
  }
});

// เพิ่ม Order ใน Product
router.post('/:id/orders', async function (req, res, next) {

  try {
      const Prod = await ProductsSchema.findById(req.params.id);
      const { product, stock , price} = Prod;
      let { orders } = req.body;
      let total_price = price*orders
      if (stock >= orders) {
        let { id, username } = req.auth;
        let prod_order = new OrdersSchema({
          user_id: id,
          username: username,
          product: product,
          orders: orders,
          total_price: total_price

        })
        await prod_order.save()
        count = stock - orders
        let _Prod = await ProductsSchema.findByIdAndUpdate(req.params.id ,{
          stock: count
        }, {new: true})

        res.status(200).send({
          status: 200,
          message: "Add product success.",
          data: prod_order
        });
      } else {
        res.status(400).send({
          status: 400,
          message: "Insufficient stock of product.",
          data: null
        });
      }

  } catch (error) {
    res.status(500).send({
      status: 500,
      message: "Server Timeout",
      data: []
    })
  }
});
// เพิ่มรายการ Product
router.post('/', tokenMiddleware, async function (req, res, next) {
  try {
    let { product, price, stock } = req.body

    let prod = new ProductsSchema({
      product: product,
      price: price,
      stock: stock
    })
    await prod.save()

    res.status(200).send({
      status: 200,
      message: "Add product success.",
      data: prod
    })
  } catch (error) {
    res.status(500).send({
      status: 500,
      message: "Server Timeout",
      data: []
    })
  }
});

// แก้ไขรายการ Product
router.put('/:id', async function (req, res, next) {
  try {
    let { id } = req.params
    let { name, price, stock } = req.body

    let product = await ProductsSchema.findByIdAndUpdate(id, {
      name,
      price,
      stock
    }, { new: true })
    res.status(200).send({
      status: 200,
      message: "Update product success.",
      data: product
    })

  } catch (error) {
    res.status(500).send({
      status: 500,
      message: "Server Timeout",
      data: []
    })
  }
});

// ลบรายการ Product
router.delete('/:id', async function (req, res, next) {
  try {
    let { id } = req.params

    let product = await ProductsSchema.findByIdAndDelete(id)
    res.status(200).send({
      status: 200,
      message: "Delete product success.",
      data: product
    })

  } catch (error) {
    res.status(500).send({
      status: 500,
      message: "Server Timeout",
      data: []
    })
  }
});

module.exports = router;
