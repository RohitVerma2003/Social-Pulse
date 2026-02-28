// routes/linkedinAuth.js
const express = require('express');
const axios = require('axios');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const SocialAccount = require('../models/SocialAccount');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

const scope = "openid profile email w_member_social";

// STEP 1 → Redirect to LinkedIn
router.get('/linkedin', authMiddleware, async (req, res) => {
  try {
    const csrfToken = crypto.randomBytes(16).toString('hex');

    const statePayload = {
      userId: req.userId,
      csrf: csrfToken
    };

    const state = Buffer.from(JSON.stringify(statePayload)).toString('base64');

    const authUrl =
      "https://www.linkedin.com/oauth/v2/authorization" +
      "?response_type=code" +
      "&client_id=" + process.env.LINKEDIN_CLIENT_ID +
      "&redirect_uri=" + encodeURIComponent(process.env.LINKEDIN_REDIRECT_URI) +
      "&scope=" + encodeURIComponent(scope) +
      "&state=" + state;

    res.redirect(authUrl);

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "OAuth init failed" });
  }
});


// STEP 2 → Callback
router.get('/linkedin/callback', async (req, res) => {
  try {
    const { code, state } = req.query;

    if (!code || !state) {
      return res.redirect(`${process.env.FRONTEND_URL}/accounts?platform=linkedin&success=false`);
    }

    // Decode state safely
    let decodedState;
    try {
      decodedState = JSON.parse(
        Buffer.from(state, 'base64').toString()
      );
    } catch (err) {
      return res.redirect(`${process.env.FRONTEND_URL}/accounts?platform=linkedin&success=false`);
    }

    const userId = decodedState.userId;

    if (!userId) {
      return res.redirect(`${process.env.FRONTEND_URL}/accounts?platform=linkedin&success=false`);
    }

    // Exchange code for access token
    const tokenRes = await axios.post(
      'https://www.linkedin.com/oauth/v2/accessToken',
      new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: process.env.LINKEDIN_REDIRECT_URI,
        client_id: process.env.LINKEDIN_CLIENT_ID,
        client_secret: process.env.LINKEDIN_CLIENT_SECRET,
      }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );

    // After token exchange

    const accessToken = tokenRes.data.access_token;
    const expiresIn = tokenRes.data.expires_in;

    // OpenID profile
    const userInfo = await axios.get(
      "https://api.linkedin.com/v2/userinfo",
      {
        headers: { Authorization: `Bearer ${accessToken}` }
      }
    );

    const linkedinId = userInfo.data.sub;
    const username = userInfo.data.name;
    const email = userInfo.data.email;

    // Optional detailed profile
    let profileUrl = null;

    try {
      const profile = await axios.get(
        "https://api.linkedin.com/v2/me",
        {
          headers: { Authorization: `Bearer ${accessToken}` }
        }
      );

      if (profile.data.vanityName) {
        profileUrl = `https://www.linkedin.com/in/${profile.data.vanityName}`;
      }
    } catch (err) {
      console.log("Profile URL not available");
    }

    await SocialAccount.findOneAndUpdate(
      { userId, platform: "linkedin" },
      {
        platformUserId: linkedinId,
        username,
        accessToken,
        tokenExpiry: new Date(Date.now() + expiresIn * 1000),
        profileUrl,
        followers: 0,
        isActive: true,
        connectedAt: new Date(),
        lastSyncedAt: new Date()
      },
      { upsert: true }
    );

    return res.redirect(
      `${process.env.FRONTEND_URL}/accounts?platform=linkedin&success=true`
    );

  } catch (error) {
    console.error("LinkedIn OAuth Error:", error.response?.data || error.message);
    return res.redirect(
      `${process.env.FRONTEND_URL}/accounts?platform=linkedin&success=false`
    );
  }
});

module.exports = router;