import React, { useState, useEffect } from 'react';
import { Search, Filter, Edit, Trash2, Clock, CheckCircle, FileText } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { toast } from 'sonner';
import api from '../utils/api';

const ContentPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await api.get('/posts?limit=50');
      if (response.data.success) {
        setPosts(response.data.posts);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast.error('Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  const filterByStatus = (status) => {
    if (status === 'all') return posts;
    return posts.filter((post) => post.status === status);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;

    try {
      await api.delete(`/posts/${id}`);
      setPosts(posts.filter((post) => post._id !== id));
      toast.success('Post deleted successfully!');
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error('Failed to delete post');
    }
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
      <Card data-testid={`post-card-${post._id}`} className="glass-card border-none hover:-translate-y-1 transition-transform duration-300">
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
              <p className="text-sm text-muted-foreground mb-3 capitalize">{post.platform}</p>
            </div>
          </div>

          <p className="text-sm text-foreground mb-4 line-clamp-3">{post.content}</p>

          {post.status === 'scheduled' && post.scheduledFor && (
            <p className="text-xs text-muted-foreground mb-4">
              Scheduled for: {new Date(post.scheduledFor).toLocaleString()}
            </p>
          )}

          {post.engagement && post.status === 'published' && (
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
            <span className="text-xs text-muted-foreground">
              {new Date(post.createdAt).toLocaleDateString()}
            </span>
            <div className="flex space-x-2">
              <Button
                data-testid={`edit-post-${post._id}`}
                variant="ghost"
                size="sm"
                className="rounded-full"
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                data-testid={`delete-post-${post._id}`}
                variant="ghost"
                size="sm"
                onClick={() => handleDelete(post._id)}
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

  const filteredPosts = filterByStatus(activeTab).filter(post =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
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

            <TabsContent value={activeTab} className="mt-6">
              {loading ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {[1, 2, 3, 4].map((i) => (
                    <Card key={i} className="glass-card border-none animate-pulse">
                      <CardContent className="p-6">
                        <div className="h-32 bg-muted rounded"></div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : filteredPosts.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {filteredPosts.map((post) => (
                    <PostCard key={post._id} post={post} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground mb-4">
                    {searchQuery ? 'No posts found matching your search.' : 'No posts yet.'}
                  </p>
                  <Button className="btn-primary" onClick={() => window.location.href = '/chatbot'}>
                    Create Your First Post
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ContentPage;
