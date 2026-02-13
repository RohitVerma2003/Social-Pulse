# SocialPulse AI - Frontend

An AI-powered social media management platform built with React, designed to help businesses and creators plan, create, and automate their social media content.

## 🎯 Project Overview

This is a comprehensive frontend application for managing social media across Twitter, LinkedIn, and Instagram with AI-powered content generation.

### Key Features
- **AI Content Creator**: Generate text content (GPT) and image prompts (Gemini)
- **Smart Calendar**: Schedule posts with FullCalendar integration
- **Content Library**: Manage drafts, scheduled, and published posts
- **Social Accounts**: Connect and manage multiple platforms
- **Analytics Dashboard**: Track performance metrics
- **Dark/Light Mode**: Full theme support with smooth transitions

## 🚀 Tech Stack

- **Framework**: React 19
- **Styling**: Tailwind CSS with custom vibrant design system
- **State Management**: Zustand
- **Calendar**: FullCalendar
- **UI Components**: Shadcn/UI (Radix UI primitives)
- **Icons**: Lucide React
- **Charts**: Recharts
- **Routing**: React Router DOM v7
- **HTTP Client**: Axios
- **Notifications**: Sonner

## 📦 Installation

All dependencies are already installed. The project uses Yarn as the package manager.

## 🎨 Design System

### Color Palette
- **Light Mode**:
  - Primary: Purple (#8B5CF6)
  - Secondary: Pink (#EC4899)
  - Accent: Teal (#14B8A6)

- **Dark Mode**:
  - Primary: Purple (#7C3AED)
  - Secondary: Pink (#DB2777)
  - Accent: Teal (#0D9488)

### Typography
- **Headings**: Clash Display (bold, tracking-tight)
- **Body**: Plus Jakarta Sans
- **Code**: JetBrains Mono

### Components
- Pill-shaped buttons with hover animations
- Glass-morphism cards with backdrop blur
- Rounded corners and smooth transitions
- High contrast for accessibility

## 📁 Project Structure

```
src/
├── components/
│   ├── layout/
│   │   ├── Sidebar.js          # Navigation sidebar
│   │   ├── Navbar.js           # Top navigation bar
│   │   └── MainLayout.js       # Main layout wrapper
│   ├── ui/                     # Shadcn UI components
│   ├── ThemeProvider.js        # Theme context provider
│   └── ThemeToggle.js          # Dark/light mode toggle
├── pages/
│   ├── LandingPage.js          # Marketing landing page
│   ├── LoginPage.js            # User login
│   ├── SignupPage.js           # User registration
│   ├── DashboardPage.js        # Main dashboard
│   ├── ChatbotPage.js          # AI content generator
│   ├── CalendarPage.js         # Post scheduling
│   ├── ContentPage.js          # Content library
│   ├── AccountsPage.js         # Social media accounts
│   ├── AnalyticsPage.js        # Performance analytics
│   └── SettingsPage.js         # User settings
├── stores/
│   ├── authStore.js            # Authentication state
│   ├── contentStore.js         # Content management state
│   ├── accountsStore.js        # Connected accounts state
│   └── themeStore.js           # Theme preference state
├── utils/
│   └── api.js                  # Axios instance with interceptors
├── App.js                      # Main app component with routes
├── App.css                     # Global styles
└── index.css                   # Tailwind base styles
```

## 🔌 Backend Integration Guide

### Environment Variables
The frontend connects to your backend via the `REACT_APP_BACKEND_URL` environment variable in `/app/frontend/.env`.

### API Endpoints Expected

Your Node.js backend should implement the following API endpoints:

#### Authentication
```javascript
POST /api/auth/login
Body: { email, password }
Response: { user: {...}, token: "..." }

POST /api/auth/signup
Body: { name, email, password }
Response: { user: {...}, token: "..." }
```

#### AI Content Generation
```javascript
POST /api/ai/generate
Headers: { Authorization: "Bearer <token>" }
Body: { 
  prompt: string,
  type: "text" | "image"
}
Response: { 
  content: string,
  metadata: {...}
}
```

#### Posts Management
```javascript
GET /api/posts
Headers: { Authorization: "Bearer <token>" }
Response: { posts: [...] }

POST /api/posts
Body: { title, content, platform, scheduledFor }
Response: { post: {...} }

PUT /api/posts/:id
Body: { title, content, platform, scheduledFor }
Response: { post: {...} }

DELETE /api/posts/:id
Response: { success: true }
```

#### Social Accounts
```javascript
GET /api/accounts
Headers: { Authorization: "Bearer <token>" }
Response: { accounts: {...} }

POST /api/accounts/connect
Body: { platform: "twitter" | "linkedin" | "instagram", credentials: {...} }
Response: { account: {...} }

DELETE /api/accounts/:platform
Response: { success: true }
```

#### Analytics
```javascript
GET /api/analytics
Headers: { Authorization: "Bearer <token>" }
Response: { 
  stats: {...},
  engagementData: [...],
  platformData: [...]
}
```

### API Integration Steps

1. **Set up your Node.js backend** with Express/Fastify
2. **Install required packages**:
   - MongoDB driver or Mongoose
   - JWT for authentication
   - OpenAI SDK for GPT text generation
   - Google Gemini SDK for image generation
   - Twitter/LinkedIn/Instagram API clients
   - Node-cron for scheduling

3. **Configure MongoDB** connection
4. **Implement authentication** with JWT
5. **Set up AI integrations**:
   - OpenAI GPT for text content
   - Google Gemini for image generation
6. **Implement social media OAuth**:
   - Twitter OAuth 2.0
   - LinkedIn OAuth 2.0
   - Instagram Basic Display API

7. **Update API calls in frontend**:
   All API calls are centralized in `/app/frontend/src/utils/api.js` and individual page files. Currently, they use mock data with `// TODO` comments indicating where to connect to your backend.

### Example Backend Structure

```
backend/
├── server.js               # Express/Fastify app
├── models/
│   ├── User.js
│   ├── Post.js
│   └── SocialAccount.js
├── routes/
│   ├── auth.js
│   ├── ai.js
│   ├── posts.js
│   ├── accounts.js
│   └── analytics.js
├── middleware/
│   └── auth.js            # JWT verification
├── services/
│   ├── openai.js          # GPT integration
│   ├── gemini.js          # Gemini integration
│   └── scheduler.js       # Post scheduling
└── .env
```

## 🔐 Authentication Flow

1. User signs up/logs in via frontend
2. Backend validates credentials and returns JWT token
3. Token is stored in Zustand store (persisted to localStorage)
4. All API requests include token in Authorization header
5. Backend middleware verifies token on protected routes

## 📝 Mock Data

Currently, the frontend uses mock data for demonstration purposes. You'll find mock data in:
- Dashboard stats
- Recent posts
- Analytics charts
- Connected accounts

Replace these with actual API calls to your backend.

## 🎯 Features Implementation Checklist

### ✅ Completed (Frontend)
- [x] Landing page with hero section
- [x] Login/Signup pages
- [x] Dashboard with stats
- [x] AI Chatbot interface
- [x] Calendar with FullCalendar
- [x] Content library with filters
- [x] Social accounts management
- [x] Analytics with charts
- [x] Settings page
- [x] Dark/Light mode
- [x] Responsive design
- [x] State management with Zustand
- [x] Route protection

### 🔄 TODO (Backend Integration)
- [ ] Connect authentication endpoints
- [ ] Integrate OpenAI GPT API for text generation
- [ ] Integrate Google Gemini API for image generation
- [ ] Connect posts CRUD operations
- [ ] Implement social media OAuth flows
- [ ] Set up post scheduling with node-cron
- [ ] Implement analytics data collection
- [ ] Add real-time notifications

## 🚀 Running the Project

The frontend is already running at `http://localhost:3000` (managed by supervisor).

To restart frontend:
```bash
sudo supervisorctl restart frontend
```

## 🎨 Customization

### Changing Colors
Update the color values in `/app/frontend/src/index.css` in the `:root` and `.dark` sections.

### Adding New Pages
1. Create new page component in `src/pages/`
2. Add route in `src/App.js`
3. Add navigation link in `src/components/layout/Sidebar.js`

### Modifying Components
All UI components are in `src/components/ui/` and can be customized while maintaining consistency.

## 📱 Pages Overview

1. **Landing Page** - Marketing page with features showcase
2. **Login/Signup** - Authentication forms
3. **Dashboard** - Overview with stats and quick actions
4. **AI Creator** - Chat interface for content generation
5. **Calendar** - Schedule posts with drag-and-drop
6. **Content** - Manage all posts (draft, scheduled, published)
7. **Accounts** - Connect social media platforms
8. **Analytics** - Performance metrics and charts
9. **Settings** - Profile, notifications, appearance, security

## 🔗 Important Notes

- All API calls are prepared but use mock data currently
- Backend URL is configured in `/app/frontend/.env`
- JWT token is automatically included in API requests
- Theme preference persists across sessions
- Social media OAuth needs backend implementation
- AI content generation requires API keys (GPT, Gemini)

## 📚 Additional Resources

- [React Documentation](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [FullCalendar React](https://fullcalendar.io/docs/react)
- [Zustand](https://github.com/pmndrs/zustand)
- [Shadcn/UI](https://ui.shadcn.com/)

## 🤝 Integration Tips

1. **Start with authentication** - Get login/signup working first
2. **Test with Postman** - Verify your backend endpoints
3. **Use environment variables** - Never hardcode API keys
4. **Handle errors** - Add proper error handling for API calls
5. **Add loading states** - Improve UX during API calls
6. **Implement rate limiting** - Protect your APIs
7. **Set up CORS** - Allow frontend to communicate with backend

---

Built with ❤️ for your college project. Good luck! 🚀
