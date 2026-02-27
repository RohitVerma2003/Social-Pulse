const express = require('express');
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const Post = require('../models/Post');

const router = express.Router();

// Validation middleware
const validatePost = [
  body('title').trim().notEmpty().withMessage('Title is required').isLength({ max: 200 }),
  body('content').trim().notEmpty().withMessage('Content is required').isLength({ max: 5000 }),
  body('platform').isIn(['twitter', 'linkedin', 'instagram']).withMessage('Invalid platform')
];

// GET /api/posts - Get all posts for current user
router.get('/', auth, async (req, res, next) => {
  try {
    const { status, platform, limit = 50, page = 1 } = req.query;

    // Build query
    const query = { userId: req.userId };
    if (status) query.status = status;
    if (platform) query.platform = platform;

    // Execute query with pagination
    const posts = await Post.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Post.countDocuments(query);

    res.json({
      success: true,
      posts,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/posts/:id - Get single post
router.get('/:id', auth, async (req, res, next) => {
  try {
    const post = await Post.findOne({ 
      _id: req.params.id, 
      userId: req.userId 
    });

    if (!post) {
      return res.status(404).json({ 
        success: false,
        message: 'Post not found' 
      });
    }

    res.json({
      success: true,
      post
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/posts - Create new post
router.post('/', auth, validatePost, async (req, res, next) => {
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

    const { title, content, platform, scheduledFor, imageUrl } = req.body;

    // Determine status based on scheduledFor
    let status = 'draft';
    if (scheduledFor) {
      const scheduleDate = new Date(scheduledFor);
      if (scheduleDate > new Date()) {
        status = 'scheduled';
      }
    }

    // Create post
    const post = await Post.create({
      userId: req.userId,
      title,
      content,
      platform,
      scheduledFor: scheduledFor ? new Date(scheduledFor) : null,
      status,
      imageUrl
    });

    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      post
    });
  } catch (error) {
    next(error);
  }
});

// PUT /api/posts/:id - Update post
router.put('/:id', auth, validatePost, async (req, res, next) => {
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

    const { title, content, platform, scheduledFor, imageUrl, status } = req.body;

    // Find and update post
    const post = await Post.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      {
        title,
        content,
        platform,
        scheduledFor: scheduledFor ? new Date(scheduledFor) : null,
        imageUrl,
        status,
        updatedAt: new Date()
      },
      { new: true, runValidators: true }
    );

    if (!post) {
      return res.status(404).json({ 
        success: false,
        message: 'Post not found' 
      });
    }

    res.json({
      success: true,
      message: 'Post updated successfully',
      post
    });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/posts/:id - Delete post
router.delete('/:id', auth, async (req, res, next) => {
  try {
    const post = await Post.findOneAndDelete({ 
      _id: req.params.id, 
      userId: req.userId 
    });

    if (!post) {
      return res.status(404).json({ 
        success: false,
        message: 'Post not found' 
      });
    }

    res.json({
      success: true,
      message: 'Post deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/posts/stats/summary - Get posts statistics
router.get('/stats/summary', auth, async (req, res, next) => {
  try {
    const stats = await Post.aggregate([
      { $match: { userId: req.userId } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const totalEngagement = await Post.aggregate([
      { $match: { userId: req.userId, status: 'published' } },
      {
        $group: {
          _id: null,
          totalLikes: { $sum: '$engagement.likes' },
          totalComments: { $sum: '$engagement.comments' },
          totalShares: { $sum: '$engagement.shares' }
        }
      }
    ]);

    res.json({
      success: true,
      stats: {
        byStatus: stats,
        engagement: totalEngagement[0] || { totalLikes: 0, totalComments: 0, totalShares: 0 }
      }
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;