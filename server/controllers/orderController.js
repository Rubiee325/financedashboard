const orderService = require('../services/orderService');

const Order = require('../models/Order');

const getAllOrders = async (req, res) => {
  try {

    const orders = await Order.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: orders
    });

  } catch (error) {

    console.error("Get orders error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch orders"
    });

  }
};

const getOrderById = async (req, res, next) => {
    try {
        const order = await orderService.getOrderById(req.params.id);
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }
        res.status(200).json({ success: true, data: order });
    } catch (err) {
        next(err);
    }
};

const createOrder = async (req, res, next) => {
    try {
        const order = await orderService.createOrder(req.body);
        if (req.io) req.io.emit('order_added', order);
        res.status(201).json({ success: true, data: order });
    } catch (err) {
        next(err);
    }
};

const updateOrder = async (req, res, next) => {
    try {
        const order = await orderService.updateOrder(req.params.id, req.body);
        if (req.io) req.io.emit('order_updated', order);
        res.status(200).json({ success: true, data: order });
    } catch (err) {
        next(err);
    }
};

const deleteOrder = async (req, res, next) => {
    try {
        await orderService.deleteOrder(req.params.id);
        if (req.io) req.io.emit('order_deleted', req.params.id);
        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        next(err);
    }
};


module.exports = {
    getAllOrders,
    getOrderById,
    createOrder,
    updateOrder,
    deleteOrder
};
