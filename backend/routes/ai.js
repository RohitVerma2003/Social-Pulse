const express = require('express');
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const { generateAIContent } = require('../services/aiService');

const router = express.Router();

// Validation middleware
const validateGenerate = [
  body('prompt').trim().notEmpty().withMessage('Prompt is required').isLength({ max: 1000 }),
  body('type').isIn(['text', 'image']).withMessage('Type must be either text or image')
];

// POST /api/ai/generate - Generate AI content
router.post('/generate', auth, validateGenerate, async (req, res, next) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false,
        message: 'Validation failed',
        errors: errors.array() 
      });
    }

    const { prompt, type, platform } = req.body;

    // Generate content using AI service
    const content = await generateAIContent(prompt, type, platform);

    res.json({
      success: true,
      content,
      type,
      metadata: {
        generatedAt: new Date(),
        platform: platform || 'general'
      }
    });
  } catch (error) {
    console.error('AI generation error:', error);
    
    if (error.message.includes('API key')) {
      return res.status(500).json({
        success: false,
        message: 'AI service configuration error. Please check API keys.',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }

    next(error);
  }
});

module.exports = router;