const { Order, Product } = require('../models/models');

class OrderController {
    async createOrder(req, res) {
        const { cart } = req.body;
        const userId = req.user.id;

        try {
            // Создание заказа в базе данных
            const order = await Order.create({ userId });

            // Обработка товаров в корзине и учет их в заказе
            for (const item of cart) {
                const product = await Product.findByPk(item.id);

                if (!product) {
                    return res.status(404).json({ message: `Product with id ${item.id} not found` });
                }

                // Проверка наличия достаточного количества товара на складе
                if (product.quantity < item.quantity) {
                    return res.status(400).json({ message: `Not enough quantity available for product ${product.name}` });
                }

                // Уменьшение количества товара на складе
                product.quantity -= item.quantity;
                await product.save();

                // Добавление товара в заказ с указанием количества
                await order.addProduct(product, { through: { quantity: item.quantity } });
            }

            // Успешный ответ с созданным заказом
            return res.status(201).json(order);
        } catch (error) {
            console.error('Failed to create order:', error);
            return res.status(500).json({ message: 'Failed to create order', error });
        }
    }

    async getOrders(req, res) {
        const userId = req.user.id;

        try {
            // Получение всех заказов пользователя
            const orders = await Order.findAll({ where: { userId } });
            return res.json(orders);
        } catch (error) {
            console.error('Failed to retrieve orders:', error);
            return res.status(500).json({ message: 'Failed to retrieve orders', error });
        }
    }
}

module.exports = new OrderController();
