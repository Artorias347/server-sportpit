const { Order, Product } = require('../models/models');

class OrderController {
    async createOrder(req, res) {
        const { name, address, email, cart } = req.body;
        const userId = req.user.id;

        try {
            // Создание заказа в базе данных
            const order = await Order.create({ userId, name, address, email });

            // Обработка товаров в корзине и учет их в заказе
            for (const item of cart) {
                const product = await Product.findByPk(item.id);

                if (!product) {
                    return res.status(404).json({ message: `Товар с id ${item.id} не найден` });
                }

                // Проверка наличия достаточного количества товара на складе
                if (product.quantity < item.quantity) {
                    return res.status(400).json({ message: `Недостаточное количество товара ${product.name}` });
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
            console.error('Не удалось создать заказ:', error);
            return res.status(500).json({ message: 'Не удалось создать заказ', error });
        }
    }
}

module.exports = new OrderController();
