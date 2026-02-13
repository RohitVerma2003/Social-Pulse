import React, { useState } from 'react';
import { Search, Filter, Edit, Trash2, Clock, CheckCircle, FileText } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { toast } from 'sonner';

const ContentPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [posts, setPosts] = useState([
    {
      id: 1,
      title: 'Product Launch Announcement',
      platform: 'Twitter',
      status: 'published',
      content: 'Excited to announce our new feature! 🚀 Check it out now.',
      date: '2024-01-15',
      engagement: { likes: 245, comments: 32, shares: 18 },
    },
    {
      id: 2,
      title: 'Industry Insights Article',
      platform: 'LinkedIn',
      status: 'scheduled',
      content: '5 key trends shaping the future of social media marketing...',
      scheduledFor: '2024-01-20 10:00 AM',
      date: '2024-01-20',
    },
    {
      id: 3,
      title: 'Behind the Scenes',
      platform: 'Instagram',
      status: 'draft',
      content: 'A sneak peek into our content creation process...',
      date: '2024-01-14',
    },
    {
      id: 4,
      title: 'Customer Success Story',
      platform: 'LinkedIn',
      status: 'published',
      content: 'How our client increased engagement by 300% using SocialPulse AI',
      date: '2024-01-12',
      engagement: { likes: 189, comments: 45, shares: 67 },
    },
  ]);

  const filterByStatus = (status) => {
    if (status === 'all') return posts;
    return posts.filter((post) => post.status === status);
  };

  const handleDelete = (id) => {
    setPosts(posts.filter((post) => post.id !== id));
    toast.success('Post deleted successfully!');
  };

  const PostCard = ({ post }) => {
    const statusColors = {
      published: 'bg-accent/20 text-accent',
      scheduled: 'bg-primary/20 text-primary',
      draft: 'bg-muted text-muted-foreground',
    };

    const statusIcons = {
      published: CheckCircle,
      scheduled: Clock,
      draft: FileText,
    };

    const StatusIcon = statusIcons[post.status];

    return (
      <Card data-testid={`post-card-${post.id}`} className="glass-card border-none hover:-translate-y-1 transition-transform duration-300">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h3 className="text-lg font-heading font-semibold">{post.title}</h3>
                <Badge className={`${statusColors[post.status]} flex items-center space-x-1`}>
                  <StatusIcon className="h-3 w-3" />
                  <span className="capitalize">{post.status}</span>
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-3">{post.platform}</p>
            </div>
          </div>

          <p className="text-sm text-foreground mb-4">{post.content}</p>

          {post.status === 'scheduled' && (
            <p className="text-xs text-muted-foreground mb-4">
              Scheduled for: {post.scheduledFor}
            </p>
          )}

          {post.engagement && (
            <div className="flex items-center space-x-4 mb-4 text-sm">
              <span className="text-muted-foreground">
                {post.engagement.likes} likes
              </span>
              <span className="text-muted-foreground">
                {post.engagement.comments} comments
              </span>
              <span className="text-muted-foreground">
                {post.engagement.shares} shares
              </span>
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t border-border">
            <span className="text-xs text-muted-foreground">{post.date}</span>
            <div className="flex space-x-2">
              <Button
                data-testid={`edit-post-${post.id}`}
                variant="ghost"
                size="sm"
                className="rounded-full"
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                data-testid={`delete-post-${post.id}`}
                variant="ghost"
                size="sm"
                onClick={() => handleDelete(post.id)}
                className="rounded-full text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="h-screen flex flex-col">
      <Navbar 
        title="Content Library" 
        subtitle="Manage all your social media posts"
      />

      <div className="flex-1 p-6 lg:p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                data-testid="search-input"
                type="text"
                placeholder="Search posts..."
                className="pl-10 h-12 rounded-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button
              data-testid="filter-button"
              variant="outline"
              className="rounded-full"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>

          {/* Tabs for Status */}
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="glass-card rounded-full p-1">
              <TabsTrigger data-testid="tab-all" value="all" className="rounded-full">
                All Posts ({posts.length})
              </TabsTrigger>
              <TabsTrigger data-testid="tab-published" value="published" className="rounded-full">
                Published ({filterByStatus('published').length})
              </TabsTrigger>
              <TabsTrigger data-testid="tab-scheduled" value="scheduled" className="rounded-full">
                Scheduled ({filterByStatus('scheduled').length})
              </TabsTrigger>
              <TabsTrigger data-testid="tab-draft" value="draft" className="rounded-full">
                Drafts ({filterByStatus('draft').length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {posts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="published" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filterByStatus('published').map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="scheduled" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filterByStatus('scheduled').map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="draft" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filterByStatus('draft').map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ContentPage;