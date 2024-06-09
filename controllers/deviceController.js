const uuid = require('uuid')
const path = require('path');
const { Device, DeviceInfo } = require('../models/models')
const ApiError = require('../error/ApiError');
const { Op } = require('sequelize');

class DeviceController {
    async create(req, res, next) {
        try {
            let { name, price, brandId, typeId, info } = req.body
            const { img } = req.files
            let fileName = uuid.v4() + ".jpg"
            img.mv(path.resolve(__dirname, '..', 'static', fileName))
            const device = await Device.create({ name, price, brandId, typeId, img: fileName });

            if (info) {
                info = JSON.parse(info)
                info.forEach(i =>
                    DeviceInfo.create({
                        title: i.title,
                        description: i.description,
                        deviceId: device.id
                    })
                )
            }

            return res.json(device)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async getAll(req, res) {
        let { brandId, typeId, priceMin, priceMax, limit, page } = req.query
        page = page || 1
        limit = limit || 9
        let offset = page * limit - limit

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

        return res.json(devices)
    }

    async getOne(req, res) {
        const { id } = req.params
        const device = await Device.findOne({
            where: { id },
            include: [{ model: DeviceInfo, as: 'info' }]
        })
        return res.json(device)
    }
}

module.exports = new DeviceController()
