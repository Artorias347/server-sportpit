const Router = require('express');
const router = new Router();
const deviceRouter = require('./deviceRouter');
const userRouter = require('./userRouter');
const brandRouter = require('./brandRouter');
const typeRouter = require('./typeRouter');
const reviewRouter = require('./reviewRouter');
const orderRouter = require('./orderRouter'); // Добавлен роутер для заказов
const basketRouter = require('./routes/basketController');

router.use('/user', userRouter);
router.use('/type', typeRouter);
router.use('/brand', brandRouter);
router.use('/device', deviceRouter);
router.use('/review', reviewRouter);
router.use('/order', orderRouter); // Использование роутера для заказов
router.use('/cart', basketRouter);

module.exports = router;
