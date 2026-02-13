import React, { useState } from 'react';
import { User, Bell, Shield, Palette, HelpCircle } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Switch } from '../components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import useAuthStore from '../stores/authStore';
import { useTheme } from '../components/ThemeProvider';
import { toast } from 'sonner';

const SettingsPage = () => {
  const { user, updateUser } = useAuthStore();
  const { theme } = useTheme();
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: '',
  });

  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    schedule: true,
    analytics: false,
  });

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    updateUser(profileData);
    toast.success('Profile updated successfully!');
  };

  const handleNotificationToggle = (key) => {
    setNotifications({ ...notifications, [key]: !notifications[key] });
    toast.success('Notification preferences updated!');
  };

  return (
    <div className="h-screen flex flex-col">
      <Navbar 
        title="Settings" 
        subtitle="Manage your account and preferences"
      />

      <div className="flex-1 p-6 lg:p-8 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="glass-card rounded-full p-1 mb-8">
              <TabsTrigger data-testid="tab-profile" value="profile" className="rounded-full">
                <User className="h-4 w-4 mr-2" />
                Profile
              </TabsTrigger>
              <TabsTrigger data-testid="tab-notifications" value="notifications" className="rounded-full">
                <Bell className="h-4 w-4 mr-2" />
                Notifications
              </TabsTrigger>
              <TabsTrigger data-testid="tab-appearance" value="appearance" className="rounded-full">
                <Palette className="h-4 w-4 mr-2" />
                Appearance
              </TabsTrigger>
              <TabsTrigger data-testid="tab-security" value="security" className="rounded-full">
                <Shield className="h-4 w-4 mr-2" />
                Security
              </TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile">
              <Card className="glass-card border-none">
                <CardHeader>
                  <CardTitle className="text-2xl font-heading">Profile Information</CardTitle>
                  <CardDescription>Update your personal details</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleProfileUpdate} className="space-y-6">
                    <div className="flex items-center space-x-6">
                      <Avatar className="h-20 w-20">
                        <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                          {user?.name?.charAt(0) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <Button
                        data-testid="upload-avatar-button"
                        type="button"
                        variant="outline"
                        className="rounded-full"
                      >
                        Change Avatar
                      </Button>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        data-testid="profile-name-input"
                        value={profileData.name}
                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                        className="h-12 rounded-full"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        data-testid="profile-email-input"
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                        className="h-12 rounded-full"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Input
                        id="bio"
                        data-testid="profile-bio-input"
                        value={profileData.bio}
                        onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                        placeholder="Tell us about yourself"
                        className="h-12 rounded-full"
                      />
                    </div>

                    <Button
                      data-testid="save-profile-button"
                      type="submit"
                      className="btn-primary"
                    >
                      Save Changes
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Notifications Tab */}
            <TabsContent value="notifications">
              <Card className="glass-card border-none">
                <CardHeader>
                  <CardTitle className="text-2xl font-heading">Notification Preferences</CardTitle>
                  <CardDescription>Manage how you receive updates</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Email Notifications</p>
                      <p className="text-sm text-muted-foreground">Receive email updates about your account</p>
                    </div>
                    <Switch
                      data-testid="toggle-email-notifications"
                      checked={notifications.email}
                      onCheckedChange={() => handleNotificationToggle('email')}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Push Notifications</p>
                      <p className="text-sm text-muted-foreground">Receive push notifications in browser</p>
                    </div>
                    <Switch
                      data-testid="toggle-push-notifications"
                      checked={notifications.push}
                      onCheckedChange={() => handleNotificationToggle('push')}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Scheduling Reminders</p>
                      <p className="text-sm text-muted-foreground">Get reminded before posts go live</p>
                    </div>
                    <Switch
                      data-testid="toggle-schedule-notifications"
                      checked={notifications.schedule}
                      onCheckedChange={() => handleNotificationToggle('schedule')}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Analytics Reports</p>
                      <p className="text-sm text-muted-foreground">Weekly performance summaries</p>
                    </div>
                    <Switch
                      data-testid="toggle-analytics-notifications"
                      checked={notifications.analytics}
                      onCheckedChange={() => handleNotificationToggle('analytics')}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Appearance Tab */}
            <TabsContent value="appearance">
              <Card className="glass-card border-none">
                <CardHeader>
                  <CardTitle className="text-2xl font-heading">Appearance Settings</CardTitle>
                  <CardDescription>Customize how SocialPulse AI looks</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <p className="font-medium mb-4">Theme</p>
                      <p className="text-sm text-muted-foreground mb-4">
                        Current theme: <span className="font-semibold capitalize">{theme}</span>
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Use the theme toggle button in the navigation bar to switch between light and dark modes.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security">
              <Card className="glass-card border-none">
                <CardHeader>
                  <CardTitle className="text-2xl font-heading">Security Settings</CardTitle>
                  <CardDescription>Manage your account security</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="font-medium mb-2">Change Password</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Update your password to keep your account secure
                    </p>
                    <Button
                      data-testid="change-password-button"
                      variant="outline"
                      className="rounded-full"
                    >
                      Update Password
                    </Button>
                  </div>

                  <div>
                    <h3 className="font-medium mb-2">Two-Factor Authentication</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Add an extra layer of security to your account
                    </p>
                    <Button
                      data-testid="enable-2fa-button"
                      variant="outline"
                      className="rounded-full"
                    >
                      Enable 2FA
                    </Button>
                  </div>

                  <div className="pt-6 border-t border-border">
                    <h3 className="font-medium mb-2 text-destructive">Danger Zone</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Permanently delete your account and all associated data
                    </p>
                    <Button
                      data-testid="delete-account-button"
                      variant="destructive"
                      className="rounded-full"
                    >
                      Delete Account
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;