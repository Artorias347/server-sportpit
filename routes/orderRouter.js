const Router = require('express')
const router = new Router()
const { Order, User, Device } = require('../models/models')


// Создание новой заявки
router.post('/', async (req, res) => {
    try {
        const { userId, deviceId, quantity } = req.body
        const order = await Order.create({ userId, deviceId, quantity })
        return res.json(order)
    } catch (e) {
        return res.status(500).json({ message: 'Error creating order', error: e.message })
    }
})

// Получение всех заявок пользователя
router.get('/user/:userId', async (req, res) => {
    try {
        const { userId } = req.params
        const orders = await Order.findAll({ where: { userId }, include: [Device] })
        return res.json(orders)
    } catch (e) {
        return res.status(500).json({ message: 'Error fetching orders', error: e.message })
    }
})

// Обновление статуса заявки
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params
        const { status } = req.body
        const order = await Order.findByPk(id)
        if (!order) {
            return res.status(404).json({ message: 'Order not found' })
        }
        order.status = status
        await order.save()
        return res.json(order)
    } catch (e) {
        return res.status(500).json({ message: 'Error updating order', error: e.message })
    }
})

// Удаление заявки
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params
        const order = await Order.findByPk(id)
        if (!order) {
            return res.status(404).json({ message: 'Order not found' })
        }
        await order.destroy()
        return res.json({ message: 'Order deleted successfully' })
    } catch (e) {
        return res.status(500).json({ message: 'Error deleting order', error: e.message })
    }
})

module.exports = router
