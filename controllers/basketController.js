const { Basket, BasketDevice, Device } = require('../models/models');

class BasketController {
    async addToBasket(req, res) {
        try {
            const { deviceId, quantity } = req.body;
            const userId = req.user.id;

            let basket = await Basket.findOne({ where: { userId } });

            if (!basket) {
                basket = await Basket.create({ userId });
            }

            let basketDevice = await BasketDevice.findOne({
                where: {
                    basketId: basket.id,
                    deviceId,
                },
            });

            if (basketDevice) {
                basketDevice.quantity += quantity;
                await basketDevice.save();
            } else {
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

            await BasketDevice.destroy({ where: { id: basketDeviceId } });

            return res.json({ message: 'Item removed from basket' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Failed to remove from basket', error });
        }
    }

    async getBasket(req, res) {
        try {
            const userId = req.user.id;
            const basket = await Basket.findOne({
                where: { userId },
                include: [{ model: BasketDevice, include: [Device] }]
            });
            res.json(basket);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Failed to fetch basket', error });
        }
    }
}

module.exports = new BasketController();
