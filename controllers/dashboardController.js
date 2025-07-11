const Product = require('../models/Product');
const Order = require('../models/Order');
const moment = require('moment');

const getDashboard = async (req, res) => {
  try {
    // Estadísticas básicas
    const totalProducts = await Product.countDocuments();
    const lowStockProducts = await Product.countDocuments({
      $expr: { $lte: ['$stock', '$minStock'] }
    });
    
    // Pedidos de hoy
    const todayStart = moment().startOf('day');
    const todayEnd = moment().endOf('day');
    const todayOrders = await Order.countDocuments({
      createdAt: { $gte: todayStart, $lte: todayEnd }
    });

    // Ingresos del mes
    const monthStart = moment().startOf('month');
    const monthEnd = moment().endOf('month');
    const monthlyRevenue = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: monthStart.toDate(), $lte: monthEnd.toDate() },
          paymentStatus: 'paid'
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$totalAmount' }
        }
      }
    ]);

    // Productos recientes
    const recentProducts = await Product.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('supplier');

    // Actividad reciente
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('items.product');

    const dashboardData = {
      stats: {
        totalProducts,
        lowStockProducts,
        todayOrders,
        monthlyRevenue: monthlyRevenue[0]?.total || 0
      },
      recentProducts,
      recentOrders
    };

    res.render('dashboard', { 
      title: 'Dashboard',
      data: dashboardData
    });
  } catch (error) {
    console.error('Error en dashboard:', error);
    res.status(500).render('error', { error: 'Error del servidor' });
  }
};

module.exports = {
  getDashboard
};