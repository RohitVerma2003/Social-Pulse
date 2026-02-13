import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  Users,
  Calendar as CalendarIcon,
  MessageSquare,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import useAuthStore from '../stores/authStore';

const DashboardPage = () => {
  const { user } = useAuthStore();
  const [stats, setStats] = useState({
    totalPosts: 45,
    scheduledPosts: 12,
    engagement: 8.5,
    followers: 2840,
  });

  const recentPosts = [
    {
      id: 1,
      platform: 'Twitter',
      content: 'Just launched our new feature! Check it out 🚀',
      status: 'published',
      engagement: 245,
      date: '2 hours ago',
    },
    {
      id: 2,
      platform: 'LinkedIn',
      content: '5 tips for better social media engagement...',
      status: 'scheduled',
      scheduledFor: 'Tomorrow at 10:00 AM',
      date: 'Scheduled',
    },
    {
      id: 3,
      platform: 'Instagram',
      content: 'Behind the scenes of our content creation process',
      status: 'draft',
      date: 'Draft',
    },
  ];

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
              <p className="text-xs text-muted-foreground mt-1 flex items-center">
                <ArrowUpRight className="h-3 w-3 text-accent mr-1" />
                <span className="text-accent">+12%</span> from last month
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

          <Card data-testid="stat-card-engagement" className="glass-card border-none">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Avg Engagement
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.engagement}%</div>
              <p className="text-xs text-muted-foreground mt-1 flex items-center">
                <ArrowUpRight className="h-3 w-3 text-accent mr-1" />
                <span className="text-accent">+2.3%</span> from last week
              </p>
            </CardContent>
          </Card>

          <Card data-testid="stat-card-followers" className="glass-card border-none">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Followers
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.followers.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1 flex items-center">
                <ArrowUpRight className="h-3 w-3 text-accent mr-1" />
                <span className="text-accent">+5.2%</span> growth
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Posts */}
        <Card className="glass-card border-none">
          <CardHeader>
            <CardTitle className="text-2xl font-heading">Recent Posts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentPosts.map((post) => (
                <div
                  key={post.id}
                  data-testid={`recent-post-${post.id}`}
                  className="flex items-start justify-between p-4 rounded-2xl bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="text-sm font-semibold">{post.platform}</span>
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
                    <p className="text-sm text-foreground mb-2">{post.content}</p>
                    <p className="text-xs text-muted-foreground">
                      {post.status === 'scheduled' ? post.scheduledFor : post.date}
                    </p>
                  </div>
                  {post.engagement && (
                    <div className="text-right ml-4">
                      <p className="text-2xl font-bold">{post.engagement}</p>
                      <p className="text-xs text-muted-foreground">engagements</p>
                    </div>
                  )}
                </div>
              ))}
            </div>

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
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
