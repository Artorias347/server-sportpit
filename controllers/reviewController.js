// reviewController.js

const { Review } = require('../models/models')

class ReviewController {
  async createReview(req, res) {
    try {
      const { text, author } = req.body
      const review = await Review.create({ text, author })
      return res.json(review)
    } catch (e) {
      console.log(e)
      return res.status(500).json({ message: 'Что-то пошло не так...' })
    }
  }

  async getAllReviews(req, res) {
    try {
      const reviews = await Review.findAll()
      return res.json(reviews)
    } catch (e) {
      console.log(e)
      return res.status(500).json({ message: 'Что-то пошло не так...' })
    }
  }
}

module.exports = new ReviewController()
