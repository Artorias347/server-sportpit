const { Basket, BasketDevice, Device } = require('../models');

class BasketController {
    async addToBasket(req, res) {
        try {
            const { deviceId, quantity } = req.body;
            const userId = req.user.id; // Предполагается, что в запросе есть авторизованный пользователь

            // Проверяем, есть ли у пользователя корзина
            let basket = await Basket.findOne({ where: { userId } });

            // Если у пользователя нет корзины, создаем новую
            if (!basket) {
                basket = await Basket.create({ userId });
            }

            // Проверяем, есть ли устройство уже в корзине
            let basketDevice = await BasketDevice.findOne({
                where: {
                    basketId: basket.id,
                    deviceId,
                },
            });

            // Если устройство уже есть в корзине, увеличиваем количество
            if (basketDevice) {
                basketDevice.quantity += quantity;
                await basketDevice.save();
            } else {
                // Если устройства нет в корзине, добавляем новое устройство
                basketDevice = await BasketDevice.create({
                    basketId: basket.id,
                    deviceId,
                    quantity,
                });
            }

            return res.json(basketDevice);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Failed to add to basket', error });
        }
    }

    async removeFromBasket(req, res) {
        try {
            const { basketDeviceId } = req.params;

            // Удаляем запись из корзины по идентификатору
            await BasketDevice.destroy({ where: { id: basketDeviceId } });

            return res.json({ message: 'Item removed from basket' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Failed to remove from basket', error });
        }
    }
}

module.exports = new BasketController();
