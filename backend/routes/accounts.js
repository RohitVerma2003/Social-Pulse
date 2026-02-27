const express = require('express');
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const SocialAccount = require('../models/SocialAccount');

const router = express.Router();

// Validation middleware
const validateAccount = [
  body('platform').isIn(['twitter', 'linkedin', 'instagram']).withMessage('Invalid platform'),
  body('username').trim().notEmpty().withMessage('Username is required')
];

// GET /api/accounts - Get all connected accounts
router.get('/', auth, async (req, res, next) => {
  try {
    const accounts = await SocialAccount.find({ 
      userId: req.userId,
      isActive: true 
    }).select('-accessToken -refreshToken');

    // Format response to match frontend expectations
    const formattedAccounts = {
      twitter: null,
      linkedin: null,
      instagram: null
    };

    accounts.forEach(account => {
      formattedAccounts[account.platform] = {
        id: account._id,
        username: account.username,
        followers: account.followers,
        profileUrl: account.profileUrl,
        connectedAt: account.connectedAt
      };
    });

    res.json({
      success: true,
      accounts: formattedAccounts
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/accounts/connect - Connect a social account
router.post('/connect', auth, validateAccount, async (req, res, next) => {
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

    const { platform, username, accessToken, refreshToken, followers, profileUrl } = req.body;

    // Check if account already exists
    const existingAccount = await SocialAccount.findOne({
      userId: req.userId,
      platform
    });

    if (existingAccount) {
      // Update existing account
      existingAccount.username = username;
      existingAccount.accessToken = accessToken;
      existingAccount.refreshToken = refreshToken;
      existingAccount.followers = followers || existingAccount.followers;
      existingAccount.profileUrl = profileUrl;
      existingAccount.isActive = true;
      existingAccount.connectedAt = new Date();
      
      await existingAccount.save();

      return res.json({
        success: true,
        message: `${platform} account reconnected successfully`,
        account: {
          id: existingAccount._id,
          platform: existingAccount.platform,
          username: existingAccount.username,
          followers: existingAccount.followers,
          connectedAt: existingAccount.connectedAt
        }
      });
    }

    // Create new account connection
    const account = await SocialAccount.create({
      userId: req.userId,
      platform,
      username,
      accessToken,
      refreshToken,
      followers: followers || Math.floor(Math.random() * 10000), // Mock for demo
      profileUrl
    });

    res.status(201).json({
      success: true,
      message: `${platform} account connected successfully`,
      account: {
        id: account._id,
        platform: account.platform,
        username: account.username,
        followers: account.followers,
        connectedAt: account.connectedAt
      }
    });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/accounts/:platform - Disconnect a social account
router.delete('/:platform', auth, async (req, res, next) => {
  try {
    const { platform } = req.params;

    if (!['twitter', 'linkedin', 'instagram'].includes(platform)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid platform'
      });
    }

    const account = await SocialAccount.findOneAndUpdate(
      { userId: req.userId, platform },
      { isActive: false },
      { new: true }
    );

    if (!account) {
      return res.status(404).json({
        success: false,
        message: 'Account not found'
      });
    }

    res.json({
      success: true,
      message: `${platform} account disconnected successfully`
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/accounts/:platform - Get specific platform account
router.get('/:platform', auth, async (req, res, next) => {
  try {
    const { platform } = req.params;

    const account = await SocialAccount.findOne({
      userId: req.userId,
      platform,
      isActive: true
    }).select('-accessToken -refreshToken');

    if (!account) {
      return res.status(404).json({
        success: false,
        message: 'Account not found'
      });
    }

    res.json({
      success: true,
      account: {
        id: account._id,
        platform: account.platform,
        username: account.username,
        followers: account.followers,
        profileUrl: account.profileUrl,
        connectedAt: account.connectedAt
      }
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;