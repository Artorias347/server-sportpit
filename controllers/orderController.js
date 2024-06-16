const { Order, Product } = require('../models');

class OrderController {
    async createOrder(req, res) {
        const { name, address, email, cart } = req.body;
        const userId = req.user.id;

        try {
            const order = await Order.create({ userId, name, address, email });

            for (const item of cart) {
                const product = await Product.findByPk(item.id);

                if (!product) {
                    return res.status(404).json({ message: `Товар с id ${item.id} не найден` });
                }

                if (product.quantity < item.quantity) {
                    return res.status(400).json({ message: `Недостаточное количество товара ${product.name}` });
                }

                product.quantity -= item.quantity;
                await product.save();

                await order.addProduct(product, { through: { quantity: item.quantity } });
            }

            return res.status(201).json(order);
        } catch (error) {
            console.error('Не удалось создать заказ:', error);
            return res.status(500).json({ message: 'Не удалось создать заказ', error });
        }
    }

    async getOrders(req, res) {
        const userId = req.user.id;

        try {
            const orders = await Order.findAll({ where: { userId } });
            return res.json(orders);
        } catch (error) {
            console.error('Не удалось получить заказы:', error);
            return res.status(500).json({ message: 'Не удалось получить заказы', error });
        }
    }
}

module.exports = new OrderController();
