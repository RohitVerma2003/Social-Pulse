const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  content: {
    type: String,
    required: [true, 'Content is required'],
    maxlength: [5000, 'Content cannot exceed 5000 characters']
  },
  platform: {
    type: String,
    enum: ['twitter', 'linkedin', 'instagram'],
    required: [true, 'Platform is required']
  },
  status: {
    type: String,
    enum: ['draft', 'scheduled', 'published', 'failed'],
    default: 'draft'
  },
  scheduledFor: {
    type: Date
  },
  publishedAt: Date,
  imageUrl: String,
  engagement: {
    likes: { type: Number, default: 0 },
    comments: { type: Number, default: 0 },
    shares: { type: Number, default: 0 },
    views: { type: Number, default: 0 }
  },
  platformPostId: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: Date
});

// Index for efficient queries
postSchema.index({ userId: 1, status: 1 });
postSchema.index({ userId: 1, createdAt: -1 });
postSchema.index({ scheduledFor: 1, status: 1 });

module.exports = mongoose.model('Post', postSchema);