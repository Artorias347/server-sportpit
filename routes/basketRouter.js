const Router = require('express');
const router = new Router();
const basketController = require('../controllers/basketController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/add', authMiddleware, basketController.addToBasket);
router.delete('/remove/:basketDeviceId', authMiddleware, basketController.removeFromBasket);
router.get('/', authMiddleware, basketController.getBasket);

module.exports = router;
