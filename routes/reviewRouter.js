const Router = require('express')
const router = new Router()
const reviewController = require('../controllers/reviewController')

router.post('/', reviewController.createReview)
router.get('/', reviewController.getAllReviews)

module.exports = router 