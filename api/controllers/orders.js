const mongoose = require("mongoose")
const Order = require("../models/order")
const Product = require("../models/product")

exports.getAllOrders = (req, res, next) => {
  Order.find()
  .select("product quantity _id")
  .populate("product", "name")
  .exec()
  .then(docs => {
    res.status(200).json({
      count: docs.length,
      orders: docs.map(doc => {
        return {
          _id:doc._id,
          product: doc.product,
          quantity: doc.quantity,
          request: {
            type: "GET",
            url: "http://localhost:3000/orders/" + doc._id
          }
        }
      }),
    })
  })
  .catch(err => {
    console.log(err)
    res.status(500).json({error: err})
  })
}

exports.createOrder = (req, res, next) => {
  Product.findById(req.body.productId)
  .then(product => {
    if (!product) {
      return res.status(404).json({
        message: "Product not found"
      })
    }
    const order = new Order({
      _id: new mongoose.Types.ObjectId,
      product: req.body.productId,
      quantity: req.body.quantity
    });
    return order.save()
  })
  .then(result => {
    console.log(result);
    res.status(201).json({
      message: "OrderStored",
      createdOrder: {
        _id: result._id,
        product: result.product,
        quantity: result.quantity
      },
      request: {
        type: "GET",
        url: "http://localhost:3000/orders/" + result._id
      }
    });
  })
  .catch(err => {
    console.log(err)
    res.status(500).json({error: err})
  })
}

exports.getSingleOrder = (req, res, next) => {
  const id = req.params.orderId;
  Order.findById(id)
  .select("_id product quantity")
  .populate("product", "_id name price")
  .exec()
  .then(order => {
    if (!order) {
      return res.status(404).json({
        message: "Order not found"
      })
    }
    res.status(200).json({
      order: order,
      request: {
        type: "GET",
        url: "http.localhost/orders"
      }
    })
  })
  .catch(err => {
    console.log(err)
    res.status(500).json({error: err})
  });
}

exports.deleteOrder = (req, res, next) => {
  const id = req.params.orderId
  Order.remove({_id: id})
  .exec()
  .then(() => {
    res.status(200).json({
      message: "Order Deleted",
      request: {
        type : "POST",
        url: "http://localhost:3000/orders",
        body: {
          name: "String",
          quantity: "Number"
        }
      }
    })
  })
  .catch(err => {
    console.log(err)
    res.status(500).json({error: err})
  })
}