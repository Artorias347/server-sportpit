const uuid = require('uuid');
const path = require('path');
const { Device, DeviceInfo } = require('../models/models');
const ApiError = require('../error/ApiError');
const { Op } = require('sequelize');

class DeviceController {
    async create(req, res, next) {
        try {
            let { name, price, brandId, typeId, info, stock } = req.body;
            const { img } = req.files;
            let fileName = uuid.v4() + ".jpg";
            img.mv(path.resolve(__dirname, '..', 'static', fileName));
            const device = await Device.create({ name, price, brandId, typeId, img: fileName, stock });

            if (info) {
                info = JSON.parse(info);
                info.forEach(i =>
                    DeviceInfo.create({
                        title: i.title,
                        description: i.description,
                        deviceId: device.id
                    })
                );
            }

            return res.json(device);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }
    async delete(req, res, next) {
        try {
            const { id } = req.params;

            const device = await Device.findOne({ where: { id } });

            if (!device) {
                return next(ApiError.notFound('Устройство не найдено'));
            }

            // Удаляем связанные с устройством информационные данные (DeviceInfo)
            await DeviceInfo.destroy({ where: { deviceId: id } });

            // Удаляем само устройство
            await device.destroy();

            return res.json({ message: 'Устройство успешно удалено' });
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }
    async getAll(req, res) {
        let { brandId, typeId, priceMin, priceMax, limit, page } = req.query;
        page = page || 1;
        limit = limit || 9;
        let offset = page * limit - limit;

        let whereClause = {};

        if (brandId) whereClause.brandId = brandId;
        if (typeId) whereClause.typeId = typeId;
        if (priceMin && priceMax) whereClause.price = { [Op.between]: [priceMin, priceMax] };
        else if (priceMin) whereClause.price = { [Op.gte]: priceMin };
        else if (priceMax) whereClause.price = { [Op.lte]: priceMax };

        const devices = await Device.findAndCountAll({
            where: whereClause,
            limit,
            offset
        });

        return res.json(devices);
    }

    async getOne(req, res) {
        const { id } = req.params;
        const device = await Device.findOne({
            where: { id },
            include: [{ model: DeviceInfo, as: 'info' }]
        });
        return res.json(device);
    }

    // Новый метод для обновления устройства
    async update(req, res, next) {
        try {
            const { id } = req.params;
            const { name, price, brandId, typeId, stock, info } = req.body;
            const updatedData = { name, price, brandId, typeId, stock };

            // Обновление изображения, если оно предоставлено
            if (req.files && req.files.img) {
                const { img } = req.files;
                let fileName = uuid.v4() + ".jpg";
                img.mv(path.resolve(__dirname, '..', 'static', fileName));
                updatedData.img = fileName;
            }

            const device = await Device.findOne({ where: { id } });

            if (!device) {
                return next(ApiError.badRequest('Устройство не найдено'));
            }

            await device.update(updatedData);

            if (info) {
                info = JSON.parse(info);
                await DeviceInfo.destroy({ where: { deviceId: id } });
                info.forEach(i =>
                    DeviceInfo.create({
                        title: i.title,
                        description: i.description,
                        deviceId: id
                    })
                );
            }

            return res.json(device);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }
}

module.exports = new DeviceController();
