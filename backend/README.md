# SocialPulse AI - Node.js Backend

Complete backend implementation for the SocialPulse AI social media management platform.

## 🎯 Features

- **Authentication**: JWT-based auth with bcrypt password hashing
- **AI Content Generation**: 
  - OpenAI GPT-4 for text content
  - Google Gemini for image prompts
- **Posts Management**: Full CRUD operations with scheduling
- **Social Accounts**: Connect/manage Twitter, LinkedIn, Instagram
- **Analytics**: Comprehensive analytics and engagement tracking
- **Automated Scheduling**: Node-cron for automated post publishing
- **Security**: Rate limiting, input validation, error handling

## 📦 Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT + bcryptjs
- **AI Services**: OpenAI API, Google Generative AI
- **Validation**: express-validator
- **Security**: express-rate-limit, cors

## 🚀 Installation

1. **Install Dependencies**:
```bash
cd /app/backend
npm install
```

2. **Configure Environment Variables**:
Update `/app/backend/.env` with your actual API keys:
```env
# Required for AI features
OPENAI_API_KEY=sk-your-actual-openai-key
GEMINI_API_KEY=your-actual-gemini-key
```

3. **Start the Server**:
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

## 📁 Project Structure

```
backend/
├── config/
│   └── database.js          # MongoDB connection
├── models/
│   ├── User.js              # User model with auth
│   ├── Post.js              # Post model with engagement
│   └── SocialAccount.js     # Social account connections
├── routes/
│   ├── auth.js              # Auth endpoints (signup, login)
│   ├── posts.js             # Posts CRUD + stats
│   ├── ai.js                # AI content generation
│   ├── accounts.js          # Social accounts management
│   └── analytics.js         # Analytics data
├── middleware/
│   ├── auth.js              # JWT verification
│   └── errorHandler.js      # Global error handling
├── services/
│   ├── aiService.js         # OpenAI + Gemini integration
│   └── scheduler.js         # Post scheduling with cron
├── utils/
│   └── jwt.js               # JWT utilities
├── server.js                # Main server file
├── package.json             # Dependencies
└── .env                     # Environment variables
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Posts
- `GET /api/posts` - Get all posts (with filters)
- `GET /api/posts/:id` - Get single post
- `POST /api/posts` - Create post
- `PUT /api/posts/:id` - Update post
- `DELETE /api/posts/:id` - Delete post
- `GET /api/posts/stats/summary` - Get post statistics

### AI Content Generation
- `POST /api/ai/generate` - Generate content (text or image prompt)

### Social Accounts
- `GET /api/accounts` - Get all connected accounts
- `POST /api/accounts/connect` - Connect social account
- `DELETE /api/accounts/:platform` - Disconnect account
- `GET /api/accounts/:platform` - Get platform account

### Analytics
- `GET /api/analytics` - Get comprehensive analytics data

## 🔐 Authentication Flow

1. **Signup/Login**: Returns JWT token
2. **Protected Routes**: Include `Authorization: Bearer <token>` header
3. **Token Verification**: Middleware validates on each request

## 🤖 AI Integration

### Text Generation (OpenAI GPT-4)
- Platform-specific content guidelines
- Character limits per platform
- Temperature-controlled creativity

### Image Prompts (Google Gemini)
- Enhanced prompt generation
- Visual and artistic descriptions
- Optimized for image generation tools

## 📅 Post Scheduling

The scheduler runs every minute and:
1. Finds posts scheduled for current time
2. Publishes to respective platforms
3. Updates post status (published/failed)
4. Records engagement metrics

## 🧪 Testing

### Manual Testing with cURL

**Signup**:
```bash
curl -X POST http://localhost:8001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'
```

**Login**:
```bash
curl -X POST http://localhost:8001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

**Generate AI Content** (replace TOKEN):
```bash
curl -X POST http://localhost:8001/api/ai/generate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "prompt": "Write a motivational post about productivity",
    "type": "text",
    "platform": "twitter"
  }'
```

**Create Post**:
```bash
curl -X POST http://localhost:8001/api/posts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title": "My First Post",
    "content": "Hello from SocialPulse AI!",
    "platform": "twitter",
    "status": "draft"
  }'
```

## 🔧 Configuration

### MongoDB Connection
The backend connects to MongoDB using the MONGODB_URI from .env:
```env
MONGODB_URI=mongodb://root:rootpassword@mongo:27017/socialpulse?authSource=admin
```

### CORS
Configured to accept requests from your frontend:
```env
FRONTEND_URL=https://degree-finale.preview.emergentagent.com
```

### Rate Limiting
- 100 requests per 15 minutes per IP
- Applies to all /api/ routes

## 🚨 Error Handling

The backend includes comprehensive error handling:
- **Validation Errors**: 400 with detailed messages
- **Authentication Errors**: 401 with clear reasons
- **Not Found**: 404 for missing resources
- **Server Errors**: 500 with error details (dev mode only)

## 📝 Data Models

### User
- name, email, password (hashed)
- bio, avatar
- timestamps

### Post
- userId, title, content
- platform, status (draft/scheduled/published/failed)
- scheduledFor, publishedAt
- engagement (likes, comments, shares, views)
- timestamps

### SocialAccount
- userId, platform
- username, followers
- accessToken (encrypted), refreshToken
- isActive, connectedAt

## 🔒 Security Features

1. **Password Hashing**: bcrypt with salt rounds
2. **JWT Tokens**: Signed with secret key
3. **Input Validation**: express-validator on all inputs
4. **Rate Limiting**: Prevents API abuse
5. **CORS**: Restricts cross-origin requests
6. **Error Sanitization**: No sensitive data in responses

## 🎓 Getting API Keys

### OpenAI
1. Visit https://platform.openai.com
2. Sign up / Login
3. Go to API Keys section
4. Create new secret key
5. Copy to .env as OPENAI_API_KEY

### Google Gemini
1. Visit https://makersuite.google.com/app/apikey
2. Sign in with Google account
3. Create API key
4. Copy to .env as GEMINI_API_KEY

## 📊 Database Indexes

- User: email (unique)
- Post: userId + status, userId + createdAt, scheduledFor + status
- SocialAccount: userId + platform (unique)

## 🚀 Deployment

The backend is already running in the container and can be accessed at:
- Internal: http://localhost:8001
- External: Will be proxied through the main domain

To restart backend:
```bash
sudo supervisorctl restart backend
```

## 🔄 Development Workflow

1. Make changes to backend files
2. Server auto-restarts (hot reload enabled)
3. Test with cURL or Postman
4. Check logs: `tail -f /var/log/supervisor/backend.*.log`

## 📚 Next Steps

1. **Add API Keys**: Update .env with OpenAI and Gemini keys
2. **Test Endpoints**: Use cURL or Postman to test all routes
3. **Connect Frontend**: Frontend is already configured to use backend
4. **Implement OAuth**: Add Twitter, LinkedIn, Instagram OAuth
5. **Deploy**: Backend is production-ready

## 💡 Tips

- Use `npm run dev` for development with nodemon
- Check supervisor logs for debugging
- MongoDB is already running in the container
- Frontend automatically includes JWT token in requests
- All routes are protected except auth routes

## 🐛 Troubleshooting

**MongoDB Connection Error**:
- Check if MongoDB service is running
- Verify MONGODB_URI in .env

**AI Generation Fails**:
- Verify API keys are correct
- Check API key has sufficient credits
- Review error logs for specific issues

**CORS Errors**:
- Ensure FRONTEND_URL matches your frontend domain
- Check if credentials are included in requests

## 📞 Support

For issues or questions:
- Check supervisor logs
- Review API documentation above
- Test with cURL examples
- Verify environment variables

---

Built with ❤️ for SocialPulse AI
