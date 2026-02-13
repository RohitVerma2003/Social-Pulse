# Backend Integration Guide for SocialPulse AI

## 🎯 Overview

This guide will help you build the Node.js backend to connect with the frontend. The frontend is fully functional with mock data and is ready to integrate with your backend APIs.

## 📋 Prerequisites

- Node.js (v18 or higher)
- MongoDB (for database)
- API Keys:
  - OpenAI API key (for GPT text generation)
  - Google Gemini API key (for image generation)
  - Twitter Developer Account & API credentials
  - LinkedIn Developer Account & API credentials
  - Instagram Basic Display API credentials

## 🏗️ Backend Architecture

```
your-backend/
├── server.js                 # Main Express/Fastify server
├── config/
│   └── database.js          # MongoDB connection
├── models/
│   ├── User.js              # User schema
│   ├── Post.js              # Post schema
│   └── SocialAccount.js     # Connected accounts schema
├── routes/
│   ├── auth.js              # Authentication routes
│   ├── ai.js                # AI content generation
│   ├── posts.js             # Posts CRUD
│   ├── accounts.js          # Social accounts management
│   └── analytics.js         # Analytics endpoints
├── middleware/
│   ├── auth.js              # JWT verification
│   └── errorHandler.js      # Error handling
├── services/
│   ├── openai.js            # OpenAI GPT integration
│   ├── gemini.js            # Google Gemini integration
│   ├── twitter.js           # Twitter API integration
│   ├── linkedin.js          # LinkedIn API integration
│   ├── instagram.js         # Instagram API integration
│   └── scheduler.js         # Post scheduling logic
├── utils/
│   └── jwt.js               # JWT token generation
├── package.json
└── .env
```

## 📦 Required NPM Packages

```bash
npm install express
npm install mongoose
npm install jsonwebtoken
npm install bcryptjs
npm install dotenv
npm install cors
npm install openai
npm install @google/generative-ai
npm install twitter-api-v2
npm install linkedin-api
npm install node-cron
npm install axios
```

## 🔐 Environment Variables (.env)

```env
# Server
PORT=8001
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/socialpulse

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_EXPIRES_IN=7d

# OpenAI
OPENAI_API_KEY=sk-your-openai-api-key

# Google Gemini
GEMINI_API_KEY=your-gemini-api-key

# Twitter API
TWITTER_API_KEY=your-twitter-api-key
TWITTER_API_SECRET=your-twitter-api-secret
TWITTER_ACCESS_TOKEN=your-twitter-access-token
TWITTER_ACCESS_SECRET=your-twitter-access-secret

# LinkedIn API
LINKEDIN_CLIENT_ID=your-linkedin-client-id
LINKEDIN_CLIENT_SECRET=your-linkedin-client-secret

# Instagram API
INSTAGRAM_APP_ID=your-instagram-app-id
INSTAGRAM_APP_SECRET=your-instagram-app-secret

# Frontend URL (for CORS)
FRONTEND_URL=https://degree-finale.preview.emergentagent.com
```

## 📁 Database Schemas

### User Model (models/User.js)

```javascript
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  bio: String,
  avatar: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
```

### Post Model (models/Post.js)

```javascript
const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  platform: {
    type: String,
    enum: ['twitter', 'linkedin', 'instagram'],
    required: true,
  },
  status: {
    type: String,
    enum: ['draft', 'scheduled', 'published', 'failed'],
    default: 'draft',
  },
  scheduledFor: Date,
  publishedAt: Date,
  imageUrl: String,
  engagement: {
    likes: { type: Number, default: 0 },
    comments: { type: Number, default: 0 },
    shares: { type: Number, default: 0 },
  },
  platformPostId: String, // ID from social media platform
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: Date,
});

module.exports = mongoose.model('Post', postSchema);
```

### Social Account Model (models/SocialAccount.js)

```javascript
const mongoose = require('mongoose');

const socialAccountSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  platform: {
    type: String,
    enum: ['twitter', 'linkedin', 'instagram'],
    required: true,
  },
  platformUserId: String,
  username: String,
  accessToken: String,
  refreshToken: String,
  tokenExpiry: Date,
  followers: Number,
  isActive: {
    type: Boolean,
    default: true,
  },
  connectedAt: {
    type: Date,
    default: Date.now,
  },
});

// Compound index for user and platform
socialAccountSchema.index({ userId: 1, platform: 1 }, { unique: true });

module.exports = mongoose.model('SocialAccount', socialAccountSchema);
```

## 🛣️ API Endpoints Implementation

### Authentication Routes (routes/auth.js)

```javascript
const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// POST /api/auth/signup
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    const user = await User.create({ name, email, password });

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken(user._id);

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
```

### AI Content Generation Routes (routes/ai.js)

```javascript
const express = require('express');
const OpenAI = require('openai');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const auth = require('../middleware/auth');

const router = express.Router();

// Initialize AI clients
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// POST /api/ai/generate
router.post('/generate', auth, async (req, res) => {
  try {
    const { prompt, type } = req.body;

    if (type === 'text') {
      // Generate text content using GPT
      const completion = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a social media content expert. Generate engaging, platform-appropriate content.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: 500,
      });

      res.json({
        content: completion.choices[0].message.content,
        type: 'text',
      });
    } else if (type === 'image') {
      // Generate image prompt using Gemini
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
      const result = await model.generateContent(
        `Create a detailed image generation prompt for: ${prompt}`
      );
      const response = await result.response;
      const text = response.text();

      res.json({
        content: text,
        type: 'image',
      });
    } else {
      res.status(400).json({ message: 'Invalid type specified' });
    }
  } catch (error) {
    res.status(500).json({ message: 'AI generation failed', error: error.message });
  }
});

module.exports = router;
```

### Posts Routes (routes/posts.js)

```javascript
const express = require('express');
const Post = require('../models/Post');
const auth = require('../middleware/auth');

const router = express.Router();

// GET /api/posts - Get all posts for user
router.get('/', auth, async (req, res) => {
  try {
    const posts = await Post.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json({ posts });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST /api/posts - Create new post
router.post('/', auth, async (req, res) => {
  try {
    const { title, content, platform, scheduledFor, imageUrl } = req.body;

    const post = await Post.create({
      userId: req.userId,
      title,
      content,
      platform,
      scheduledFor: scheduledFor ? new Date(scheduledFor) : null,
      status: scheduledFor ? 'scheduled' : 'draft',
      imageUrl,
    });

    res.status(201).json({ post });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// PUT /api/posts/:id - Update post
router.put('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { ...req.body, updatedAt: new Date() },
      { new: true }
    );

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.json({ post });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// DELETE /api/posts/:id - Delete post
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.json({ success: true, message: 'Post deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
```

### Auth Middleware (middleware/auth.js)

```javascript
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};
```

### Main Server File (server.js)

```javascript
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));
app.use(express.json());

// Database connection
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/ai', require('./routes/ai'));
app.use('/api/posts', require('./routes/posts'));
app.use('/api/accounts', require('./routes/accounts'));
app.use('/api/analytics', require('./routes/analytics'));

// Health check
app.get('/api/', (req, res) => {
  res.json({ message: 'SocialPulse AI Backend API' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 8001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
```

## 🔄 Post Scheduling with Node-Cron

Create `services/scheduler.js`:

```javascript
const cron = require('node-cron');
const Post = require('../models/Post');
const { publishToTwitter } = require('./twitter');
const { publishToLinkedIn } = require('./linkedin');
const { publishToInstagram } = require('./instagram');

// Run every minute to check for scheduled posts
cron.schedule('* * * * *', async () => {
  try {
    const now = new Date();

    // Find posts scheduled for now (within 1-minute window)
    const posts = await Post.find({
      status: 'scheduled',
      scheduledFor: {
        $lte: now,
        $gte: new Date(now.getTime() - 60000),
      },
    });

    for (const post of posts) {
      try {
        let result;

        switch (post.platform) {
          case 'twitter':
            result = await publishToTwitter(post);
            break;
          case 'linkedin':
            result = await publishToLinkedIn(post);
            break;
          case 'instagram':
            result = await publishToInstagram(post);
            break;
        }

        // Update post status
        post.status = 'published';
        post.publishedAt = new Date();
        post.platformPostId = result.id;
        await post.save();

        console.log(`✅ Published post ${post._id} to ${post.platform}`);
      } catch (error) {
        post.status = 'failed';
        await post.save();
        console.error(`❌ Failed to publish post ${post._id}:`, error);
      }
    }
  } catch (error) {
    console.error('Scheduler error:', error);
  }
});

module.exports = { startScheduler: () => console.log('📅 Scheduler started') };
```

## 🔗 Connecting Frontend to Backend

1. **Update API endpoint in frontend** (already configured):
   - Frontend is configured to use `REACT_APP_BACKEND_URL` from `.env`

2. **CORS Configuration**:
   Your backend must allow requests from: `https://degree-finale.preview.emergentagent.com`

3. **API Response Format**:
   Ensure your responses match the expected format:

   ```javascript
   // Success response
   { user: {...}, token: "..." }
   { posts: [...] }
   { post: {...} }
   
   // Error response
   { message: "Error description" }
   ```

## 🧪 Testing Your Backend

Use cURL or Postman to test endpoints:

```bash
# Test signup
curl -X POST http://localhost:8001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'

# Test login
curl -X POST http://localhost:8001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Test AI generation (replace TOKEN)
curl -X POST http://localhost:8001/api/ai/generate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"prompt":"Write a motivational post","type":"text"}'
```

## 📚 Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [OpenAI API Documentation](https://platform.openai.com/docs)
- [Google Gemini API Documentation](https://ai.google.dev/docs)
- [Twitter API v2](https://developer.twitter.com/en/docs/twitter-api)
- [LinkedIn API](https://learn.microsoft.com/en-us/linkedin/)

## 🎓 Next Steps

1. Set up your Node.js project with the required packages
2. Create MongoDB database and configure connection
3. Implement authentication endpoints first
4. Add posts CRUD operations
5. Integrate OpenAI for text generation
6. Integrate Gemini for image prompts
7. Set up social media OAuth flows
8. Implement scheduling with node-cron
9. Test each endpoint with the frontend
10. Deploy your backend (Railway, Render, etc.)

## 💡 Tips

- Start with authentication and basic CRUD operations
- Use Postman to test APIs before connecting frontend
- Implement error handling for all routes
- Use environment variables for all sensitive data
- Add input validation using express-validator
- Implement rate limiting for API endpoints
- Set up logging for debugging
- Use MongoDB transactions for critical operations

Good luck with your college project! 🚀
