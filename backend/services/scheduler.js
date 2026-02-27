const cron = require('node-cron');
const Post = require('../models/Post');

// Mock publishing functions (replace with actual API calls)
const publishToTwitter = async (post) => {
  console.log(`📤 Publishing to Twitter: ${post.title}`);
  // TODO: Implement actual Twitter API call
  // const twitter = new TwitterApi({ ... });
  // const result = await twitter.v2.tweet(post.content);
  return { id: `tw_${Date.now()}`, success: true };
};

const publishToLinkedIn = async (post) => {
  console.log(`📤 Publishing to LinkedIn: ${post.title}`);
  // TODO: Implement actual LinkedIn API call
  return { id: `li_${Date.now()}`, success: true };
};

const publishToInstagram = async (post) => {
  console.log(`📤 Publishing to Instagram: ${post.title}`);
  // TODO: Implement actual Instagram API call
  return { id: `ig_${Date.now()}`, success: true };
};

// Process scheduled posts
const processScheduledPosts = async () => {
  try {
    const now = new Date();
    const oneMinuteAgo = new Date(now.getTime() - 60000);

    // Find posts scheduled within the last minute
    const postsToPublish = await Post.find({
      status: 'scheduled',
      scheduledFor: {
        $lte: now,
        $gte: oneMinuteAgo
      }
    });

    if (postsToPublish.length === 0) {
      return;
    }

    console.log(`📅 Processing ${postsToPublish.length} scheduled post(s)...`);

    for (const post of postsToPublish) {
      try {
        let result;

        // Publish to respective platform
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
          default:
            throw new Error(`Unknown platform: ${post.platform}`);
        }

        // Update post status
        post.status = 'published';
        post.publishedAt = new Date();
        post.platformPostId = result.id;
        await post.save();

        console.log(`✅ Successfully published post ${post._id} to ${post.platform}`);
      } catch (error) {
        console.error(`❌ Failed to publish post ${post._id}:`, error.message);
        
        // Mark as failed
        post.status = 'failed';
        await post.save();
      }
    }
  } catch (error) {
    console.error('❌ Scheduler error:', error);
  }
};

// Start the scheduler
const startScheduler = () => {
  // Run every minute
  cron.schedule('* * * * *', async () => {
    await processScheduledPosts();
  });

  console.log('📅 Post scheduler started (runs every minute)');
};

module.exports = {
  startScheduler,
  processScheduledPosts,
  publishToTwitter,
  publishToLinkedIn,
  publishToInstagram
};