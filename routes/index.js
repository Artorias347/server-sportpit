const Router = require('express')
const router = new Router()
const deviceRouter = require('./deviceRouter')
const userRouter = require('./userRouter')
const brandRouter = require('./brandRouter')
const typeRouter = require('./typeRouter')
const reviewRouter = require('./reviewRouter')
const orderRouter = require('./orderRouter')  // Новый роутер для заявок

router.use('/user', userRouter)
router.use('/type', typeRouter)
router.use('/brand', brandRouter)
router.use('/device', deviceRouter)
router.use('/review', reviewRouter)
router.use('/order', orderRouter)  // Добавлено использование роутера для заявок

module.exports = router
