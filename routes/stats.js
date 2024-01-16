const express = require("express");
const asyncMiddleware = require("../middlewares/async");
const { Order } = require("../models/orders.model");
const router = express.Router();

router.get(
  "/",
  asyncMiddleware(async (req, res) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const todaysOrders = await Order.find({
      createdAt: {
        $gte: today,
        $lte: endOfDay,
      },
    });

    const todaysNewOrders = todaysOrders.filter(
      (order) => order.status === "pending"
    );

    const todaysCompletedOrders = todaysOrders.filter(
      (order) => order.status === "completed"
    );

    const todaysCancelledOrders = todaysOrders.filter(
      (order) => order.status === "cancelled"
    );

    const todaysSales = todaysCompletedOrders.reduce((acc, order) => {
      return (acc += order.amountToPay);
    }, 0);

    const totalSalesResult = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalAmountToPay: { $sum: "$amountToPay" },
        },
      },
    ]);

    const totalSales = totalSalesResult[0].totalAmountToPay;

    res.status(200).json({
      message: "Stats",
      stats: {
        todaysOrders,
        todaysNewOrders,
        todaysCompletedOrders,
        todaysCancelledOrders,
        todaysSales,
        totalSales,
      },
    });
  })
);

module.exports = router;
