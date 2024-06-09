const { Type } = require('../models/models');
const ApiError = require('../error/ApiError');

class TypeController {
    async create(req, res) {
        const { name } = req.body;
        const type = await Type.create({ name });
        return res.json(type);
    }

    async getAll(req, res) {
        const types = await Type.findAll();
        return res.json(types);
    }

    async delete(req, res, next) {
        try {
            const { id } = req.params;
            const type = await Type.findOne({ where: { id } });

            if (!type) {
                return next(ApiError.badRequest('Тип не найден'));
            }

            await Type.destroy({ where: { id } });
            return res.status(200).json({ message: 'Тип удален' });
        } catch (error) {
            return next(ApiError.internal('Ошибка при удалении типа'));
        }
    }
}

module.exports = new TypeController();
