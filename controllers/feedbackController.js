// feedbackController.js

const { feedback } = require('../models/models')

class feedbackController {
  async createfeedback(req, res) {
    try {
      const { text, author } = req.body
      const feedback = await feedback.create({ text, author })
      return res.json(feedback)
    } catch (e) {
      console.log(e)
      return res.status(500).json({ message: 'Что-то пошло не так...' })
    }
  }

  async getAllfeedbacks(req, res) {
    try {
      const feedbacks = await feedback.findAll()
      return res.json(feedbacks)
    } catch (e) {
      console.log(e)
      return res.status(500).json({ message: 'Что-то пошло не так...' })
    }
  }
}

module.exports = new feedbackController()
