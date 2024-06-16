const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController'); // Убедитесь, что путь к контроллеру правильный
const authMiddleware = require('../middleware/authMiddleware'); // Убедитесь, что путь к middleware правильный

// Определение маршрута для создания заказа
router.post('/create', authMiddleware, orderController.createOrder);

// Определение маршрута для получения заказов пользователя
router.get('/my-orders', authMiddleware, orderController.getOrders);

module.exports = router;
