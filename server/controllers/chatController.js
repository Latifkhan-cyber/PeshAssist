import { processChatMessage } from '../services/geminiService.js'

export const handleChat = async (req, res, next) => {
  try {
    const { message, history } = req.body

    if (!message) {
      return res.status(400).json({
        success: false,
        error: { message: 'Message field is required in request body.' },
      })
    }

    const chatResponse = await processChatMessage(message, history)

    res.status(200).json({
      success: true,
      data: chatResponse,
    })
  } catch (error) {
    next(error)
  }
}

export const getSuggestedQueries = (req, res) => {
  const suggestions = [
    { text: 'Namak Mandi mein best Dumbah Karahi', category: 'restaurants', tag: 'Food' },
    { text: 'Hayatabad mein 24/7 Emergency Hospital', category: 'hospitals', tag: 'Emergency' },
    { text: 'Deans Saddar mein laptop repair shop', category: 'services', tag: 'Repairs' },
    { text: 'Peshawar museum timings & history', category: 'tourism', tag: 'Heritage' },
    { text: 'Zu Peshawar BRT station near Saddar', category: 'transport', tag: 'Transit' },
    { text: 'Family restaurants on University Road', category: 'restaurants', tag: 'Dining' },
  ]

  res.status(200).json({
    success: true,
    data: suggestions,
  })
}
