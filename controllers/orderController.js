const { Order } = require('../models');

class OrderController {
    async createOrder(req, res) {
        const { total } = req.body;
        const userId = req.user.id;
        try {
            const order = await Order.create({ total, userId });
            return res.json(order);
        } catch (error) {
            return res.status(500).json({ message: 'Failed to create order', error });
        }
    }

    async getOrders(req, res) {
        const userId = req.user.id;
        try {
            const orders = await Order.findAll({ where: { userId } });
            return res.json(orders);
        } catch (error) {
            return res.status(500).json({ message: 'Failed to retrieve orders', error });
        }
    }
}

module.exports = new OrderController();
