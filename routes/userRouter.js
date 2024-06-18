const Router = require('express');
const router = new Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/registration', userController.registration);
router.post('/login', userController.login);
router.get('/auth', authMiddleware, userController.check);
router.post('/reset-password', userController.resetPassword); // новый маршрут
router.post('/change-password', userController.changePassword); // маршрут для изменения пароля

module.exports = router;
