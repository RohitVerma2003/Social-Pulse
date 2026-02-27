const express = require('express');
const auth = require('../middleware/auth');
const Post = require('../models/Post');

const router = express.Router();

// GET /api/analytics - Get analytics data
router.get('/', auth, async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;

    // Build date filter
    const dateFilter = { userId: req.userId };
    if (startDate || endDate) {
      dateFilter.createdAt = {};
      if (startDate) dateFilter.createdAt.$gte = new Date(startDate);
      if (endDate) dateFilter.createdAt.$lte = new Date(endDate);
    }

    // Get total engagement
    const totalEngagement = await Post.aggregate([
      { $match: { ...dateFilter, status: 'published' } },
      {
        $group: {
          _id: null,
          totalLikes: { $sum: '$engagement.likes' },
          totalComments: { $sum: '$engagement.comments' },
          totalShares: { $sum: '$engagement.shares' },
          totalViews: { $sum: '$engagement.views' },
          postCount: { $sum: 1 }
        }
      }
    ]);

    // Get engagement by platform
    const platformData = await Post.aggregate([
      { $match: { ...dateFilter, status: 'published' } },
      {
        $group: {
          _id: '$platform',
          posts: { $sum: 1 },
          engagement: {
            $sum: {
              $add: [
                '$engagement.likes',
                '$engagement.comments',
                '$engagement.shares'
              ]
            }
          },
          avgEngagement: {
            $avg: {
              $add: [
                '$engagement.likes',
                '$engagement.comments',
                '$engagement.shares'
              ]
            }
          }
        }
      },
      {
        $project: {
          platform: '$_id',
          posts: 1,
          engagement: 1,
          avgEngagement: { $round: ['$avgEngagement', 2] },
          _id: 0
        }
      }
    ]);

    // Get engagement trends (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const engagementTrends = await Post.aggregate([
      { 
        $match: { 
          userId: req.userId,
          status: 'published',
          publishedAt: { $gte: sevenDaysAgo }
        } 
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$publishedAt' }
          },
          likes: { $sum: '$engagement.likes' },
          comments: { $sum: '$engagement.comments' },
          shares: { $sum: '$engagement.shares' },
          posts: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } },
      {
        $project: {
          date: '$_id',
          likes: 1,
          comments: 1,
          shares: 1,
          posts: 1,
          _id: 0
        }
      }
    ]);

    // Get top performing posts
    const topPosts = await Post.find({
      userId: req.userId,
      status: 'published'
    })
      .sort({ 'engagement.likes': -1 })
      .limit(5)
      .select('title platform engagement publishedAt');

    // Calculate stats
    const stats = totalEngagement[0] || {
      totalLikes: 0,
      totalComments: 0,
      totalShares: 0,
      totalViews: 0,
      postCount: 0
    };

    const totalEngagementCount = stats.totalLikes + stats.totalComments + stats.totalShares;
    const avgEngagementRate = stats.postCount > 0 
      ? ((totalEngagementCount / stats.postCount) / 100 * 8.5).toFixed(2) 
      : 0;

    res.json({
      success: true,
      analytics: {
        stats: {
          totalEngagement: totalEngagementCount,
          totalReach: stats.totalViews || totalEngagementCount * 10,
          avgEngagementRate: parseFloat(avgEngagementRate),
          totalPosts: stats.postCount
        },
        platformData,
        engagementTrends,
        topPosts
      }
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;