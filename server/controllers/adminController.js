const Order = require("../models/Order");
const Product = require("../models/Product");
const User = require("../models/User");

// @desc    Get Admin Dashboard Stats & Metrics
// @route   GET /api/admin/dashboard
// @access  Private/Admin
const getDashboardStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments({});
    const totalProducts = await Product.countDocuments({});
    const totalOrders = await Order.countDocuments({});

    // Calculate total revenue from paid or delivered orders
    const revenueData = await Order.aggregate([
      {
        $match: {
          $or: [{ isPaid: true }, { status: "Delivered" }],
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalPrice" },
        },
      },
    ]);

    const totalRevenue = revenueData.length > 0 ? revenueData[0].totalRevenue : 0;

    // Order status breakdown
    const pendingOrders = await Order.countDocuments({ status: "Pending" });
    const processingOrders = await Order.countDocuments({ status: "Processing" });
    const shippedOrders = await Order.countDocuments({ status: "Shipped" });
    const deliveredOrders = await Order.countDocuments({ status: "Delivered" });
    const cancelledOrders = await Order.countDocuments({ status: "Cancelled" });

    // Out of stock or low stock items (<= 5)
    const lowStockProducts = await Product.find({ countInStock: { $lte: 5 } })
      .select("title category price countInStock image")
      .limit(10);

    // Recent orders
    const recentOrders = await Order.find({})
      .populate("user", "name email")
      .sort("-createdAt")
      .limit(5);

    res.json({
      success: true,
      stats: {
        totalRevenue: Math.round(totalRevenue * 100) / 100,
        totalUsers,
        totalProducts,
        totalOrders,
        orderBreakdown: {
          pending: pendingOrders,
          processing: processingOrders,
          shipped: shippedOrders,
          delivered: deliveredOrders,
          cancelled: cancelledOrders,
        },
      },
      lowStockProducts,
      recentOrders,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats,
};
