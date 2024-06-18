const Router = require('express')
const router = new Router()
const feedbackController = require('../controllers/feedbackController')

router.post('/', feedbackController.createReview)
router.get('/', feedbackController.getAllReviews)

module.exports = router 
