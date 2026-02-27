import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  Users,
  Calendar as CalendarIcon,
  MessageSquare,
  ArrowUpRight,
} from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import useAuthStore from '../stores/authStore';
import api from '../utils/api';
import { toast } from 'sonner';

const DashboardPage = () => {
  const { user } = useAuthStore();
  const [stats, setStats] = useState({
    totalPosts: 0,
    scheduledPosts: 0,
    draftPosts: 0,
    publishedPosts: 0,
  });
  const [recentPosts, setRecentPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch posts
      const postsResponse = await api.get('/posts?limit=5');
      if (postsResponse.data.success) {
        const posts = postsResponse.data.posts;
        setRecentPosts(posts);
        
        // Calculate stats from posts
        setStats({
          totalPosts: postsResponse.data.pagination.total,
          scheduledPosts: posts.filter(p => p.status === 'scheduled').length,
          draftPosts: posts.filter(p => p.status === 'draft').length,
          publishedPosts: posts.filter(p => p.status === 'published').length,
        });
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} ${diffMins === 1 ? 'minute' : 'minutes'} ago`;
    if (diffHours < 24) return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
    if (diffDays < 7) return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen">
      <Navbar title="Dashboard" subtitle={`Welcome back, ${user?.name || 'User'}!`} />

      <div className="p-6 lg:p-8 space-y-8">
        {/* Quick Actions */}
        <div className="flex flex-wrap gap-4">
          <Link to="/chatbot">
            <Button data-testid="quick-action-create-post" className="btn-primary">
              <MessageSquare className="h-4 w-4 mr-2" />
              Create Post with AI
            </Button>
          </Link>
          <Link to="/calendar">
            <Button data-testid="quick-action-schedule" variant="outline" className="rounded-full">
              <CalendarIcon className="h-4 w-4 mr-2" />
              Schedule Post
            </Button>
          </Link>
        </div>

        {/* Stats Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="glass-card border-none animate-pulse">
                <CardContent className="p-6">
                  <div className="h-16 bg-muted rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card data-testid="stat-card-total-posts" className="glass-card border-none">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Posts
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.totalPosts}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  All time
                </p>
              </CardContent>
            </Card>

            <Card data-testid="stat-card-scheduled" className="glass-card border-none">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Scheduled
                </CardTitle>
                <CalendarIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.scheduledPosts}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Ready to publish
                </p>
              </CardContent>
            </Card>

            <Card data-testid="stat-card-drafts" className="glass-card border-none">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Drafts
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.draftPosts}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  In progress
                </p>
              </CardContent>
            </Card>

            <Card data-testid="stat-card-published" className="glass-card border-none">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Published
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.publishedPosts}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Live posts
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Recent Posts */}
        <Card className="glass-card border-none">
          <CardHeader>
            <CardTitle className="text-2xl font-heading">Recent Posts</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="p-4 rounded-2xl bg-muted/50 animate-pulse">
                    <div className="h-20 bg-muted rounded"></div>
                  </div>
                ))}
              </div>
            ) : recentPosts.length > 0 ? (
              <div className="space-y-4">
                {recentPosts.map((post) => (
                  <div
                    key={post._id}
                    data-testid={`recent-post-${post._id}`}
                    className="flex items-start justify-between p-4 rounded-2xl bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="text-sm font-semibold capitalize">{post.platform}</span>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            post.status === 'published'
                              ? 'bg-accent/20 text-accent'
                              : post.status === 'scheduled'
                              ? 'bg-primary/20 text-primary'
                              : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          {post.status}
                        </span>
                      </div>
                      <p className="text-sm font-medium mb-1">{post.title}</p>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{post.content}</p>
                      <p className="text-xs text-muted-foreground">
                        {post.status === 'scheduled' && post.scheduledFor
                          ? `Scheduled for ${new Date(post.scheduledFor).toLocaleString()}`
                          : formatDate(post.createdAt)}
                      </p>
                    </div>
                    {post.engagement && post.status === 'published' && (
                      <div className="text-right ml-4">
                        <p className="text-2xl font-bold">{post.engagement.likes + post.engagement.comments + post.engagement.shares}</p>
                        <p className="text-xs text-muted-foreground">engagements</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">No posts yet. Create your first post!</p>
                <Link to="/chatbot">
                  <Button className="btn-primary">Create Post with AI</Button>
                </Link>
              </div>
            )}

            {!loading && recentPosts.length > 0 && (
              <div className="mt-6 text-center">
                <Link to="/content">
                  <Button
                    data-testid="view-all-posts-button"
                    variant="outline"
                    className="rounded-full"
                  >
                    View All Posts
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
