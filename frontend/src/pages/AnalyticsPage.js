import React from 'react';
import { TrendingUp, Users, Heart, MessageCircle, Share2 } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const AnalyticsPage = () => {
  const engagementData = [
    { date: 'Jan 1', likes: 120, comments: 45, shares: 23 },
    { date: 'Jan 5', likes: 180, comments: 62, shares: 34 },
    { date: 'Jan 10', likes: 250, comments: 78, shares: 45 },
    { date: 'Jan 15', likes: 290, comments: 95, shares: 56 },
    { date: 'Jan 20', likes: 340, comments: 110, shares: 67 },
    { date: 'Jan 25', likes: 420, comments: 135, shares: 89 },
    { date: 'Jan 30', likes: 480, comments: 152, shares: 102 },
  ];

  const platformData = [
    { platform: 'Twitter', posts: 45, engagement: 8240 },
    { platform: 'LinkedIn', posts: 32, engagement: 6780 },
    { platform: 'Instagram', posts: 28, engagement: 5420 },
  ];

  const topPosts = [
    {
      id: 1,
      title: 'Product Launch Announcement',
      platform: 'Twitter',
      engagement: 2450,
      reach: 15600,
    },
    {
      id: 2,
      title: 'Industry Insights',
      platform: 'LinkedIn',
      engagement: 1890,
      reach: 12300,
    },
    {
      id: 3,
      title: 'Behind the Scenes',
      platform: 'Instagram',
      engagement: 1650,
      reach: 10200,
    },
  ];

  return (
    <div className="h-screen flex flex-col">
      <Navbar 
        title="Analytics" 
        subtitle="Track your social media performance"
      />

      <div className="flex-1 p-6 lg:p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card data-testid="metric-total-engagement" className="glass-card border-none">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Engagement
                </CardTitle>
                <Heart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">20.4K</div>
                <p className="text-xs text-accent mt-1">+18.2% from last month</p>
              </CardContent>
            </Card>

            <Card data-testid="metric-total-reach" className="glass-card border-none">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Reach
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">145K</div>
                <p className="text-xs text-accent mt-1">+24.5% from last month</p>
              </CardContent>
            </Card>

            <Card data-testid="metric-avg-engagement" className="glass-card border-none">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Avg Engagement Rate
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">8.5%</div>
                <p className="text-xs text-accent mt-1">+3.2% from last month</p>
              </CardContent>
            </Card>

            <Card data-testid="metric-total-posts" className="glass-card border-none">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Posts This Month
                </CardTitle>
                <MessageCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">105</div>
                <p className="text-xs text-muted-foreground mt-1">Across all platforms</p>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <Tabs defaultValue="engagement" className="w-full">
            <TabsList className="glass-card rounded-full p-1">
              <TabsTrigger data-testid="tab-engagement" value="engagement" className="rounded-full">
                Engagement Trends
              </TabsTrigger>
              <TabsTrigger data-testid="tab-platforms" value="platforms" className="rounded-full">
                Platform Performance
              </TabsTrigger>
            </TabsList>

            <TabsContent value="engagement" className="mt-6">
              <Card className="glass-card border-none">
                <CardHeader>
                  <CardTitle className="text-2xl font-heading">Engagement Over Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={engagementData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
                      <YAxis stroke="hsl(var(--muted-foreground))" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '12px',
                        }}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="likes"
                        stroke="hsl(var(--primary))"
                        strokeWidth={2}
                        dot={{ fill: 'hsl(var(--primary))' }}
                      />
                      <Line
                        type="monotone"
                        dataKey="comments"
                        stroke="hsl(var(--secondary))"
                        strokeWidth={2}
                        dot={{ fill: 'hsl(var(--secondary))' }}
                      />
                      <Line
                        type="monotone"
                        dataKey="shares"
                        stroke="hsl(var(--accent))"
                        strokeWidth={2}
                        dot={{ fill: 'hsl(var(--accent))' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="platforms" className="mt-6">
              <Card className="glass-card border-none">
                <CardHeader>
                  <CardTitle className="text-2xl font-heading">Platform Comparison</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={platformData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="platform" stroke="hsl(var(--muted-foreground))" />
                      <YAxis stroke="hsl(var(--muted-foreground))" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '12px',
                        }}
                      />
                      <Legend />
                      <Bar dataKey="posts" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
                      <Bar dataKey="engagement" fill="hsl(var(--secondary))" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Top Performing Posts */}
          <Card className="glass-card border-none">
            <CardHeader>
              <CardTitle className="text-2xl font-heading">Top Performing Posts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topPosts.map((post, index) => (
                  <div
                    key={post.id}
                    data-testid={`top-post-${index}`}
                    className="flex items-center justify-between p-4 rounded-2xl bg-muted/50"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-semibold">{post.title}</p>
                        <p className="text-sm text-muted-foreground">{post.platform}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold">{post.engagement.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">engagements</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;