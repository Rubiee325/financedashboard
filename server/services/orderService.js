const Order = require('../models/Order');
const moment = require('moment');

class OrderService {
    async createOrder(data) {
        const order = new Order(data);
        return await order.save();
    }

    async getOrders(filters = {}) {
        const query = {};
        
        if (filters.dateRange) {
            const days = parseInt(filters.dateRange);
            if (!isNaN(days)) {
                query.createdAt = {
                    $gte: moment().subtract(days, 'days').toDate()
                };
            }
        }

        if (filters.status) query.status = filters.status;
        if (filters.product) query.product = filters.product;

        return await Order.find(query).sort({ createdAt: -1 });
    }

    async getOrderById(id) {
        return await Order.findById(id);
    }

    async updateOrder(id, data) {
        return await Order.findByIdAndUpdate(id, data, { new: true });
    }

    async deleteOrder(id) {
        return await Order.findByIdAndDelete(id);
    }

    async getStats(filters = {}) {
        const query = {};
        if (filters.dateRange && filters.dateRange !== 'All time') {
            const rangeLimits = {
                'Today': 0,
                'Last 7 Days': 7,
                'Last 30 Days': 30,
                'Last 90 Days': 90
            };
            const days = rangeLimits[filters.dateRange] !== undefined ? rangeLimits[filters.dateRange] : parseInt(filters.dateRange);
            if (!isNaN(days)) {
                query.createdAt = {
                    $gte: moment().startOf('day').subtract(days, 'days').toDate()
                };
            }
        }

        const orders = await Order.find(query);
        
        const totalOrders = orders.length;
        const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
        const totalCustomers = new Set(orders.map(o => o.email)).size;
        const totalQuantity = orders.reduce((sum, o) => sum + (o.quantity || 0), 0);

        const monthlyRevenue = await Order.aggregate([
            { $match: { ...query, createdAt: { $gte: moment().subtract(6, 'months').toDate() } } },
            { $group: { 
                _id: { $month: "$createdAt" }, 
                revenue: { $sum: "$totalAmount" },
                name: { $first: { $dateToString: { format: "%b", date: "$createdAt" } } }
            }},
            { $sort: { "_id": 1 } }
        ]);

        const statusOverview = await Order.aggregate([
            { $match: query },
            { $group: { _id: "$status", value: { $count: {} } } },
            { $project: { name: "$_id", value: 1, _id: 0 } }
        ]);

        return {
            kpis: { totalOrders, totalRevenue, totalCustomers, totalQuantity },
            charts: { 
                monthlyRevenue: monthlyRevenue.map(m => ({ name: m.name, value: m.revenue })),
                statusOverview 
            }
        };
    }
}

module.exports = new OrderService();
