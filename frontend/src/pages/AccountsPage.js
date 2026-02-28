import React, { useEffect, useState } from 'react';
import { Twitter, Linkedin, Instagram, Link2, CheckCircle, XCircle } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import useAccountsStore from '../stores/accountsStore';
import { toast } from 'sonner';

const AccountsPage = () => {
  const { connectedAccounts, fetchAccounts, connectAccountAPI, disconnectAccountAPI, isLoading, error, clearError } = useAccountsStore();
  const [connecting, setConnecting] = useState(null);

  // Fetch accounts on component mount and handle OAuth callback
  useEffect(() => {
    fetchAccounts();

    // Handle OAuth callback
    const params = new URLSearchParams(window.location.search);
    const platform = params.get('platform');
    const success = params.get('success');

    if (platform && success === 'true') {
      toast.success(`${platform.charAt(0).toUpperCase() + platform.slice(1)} connected successfully!`);
      // Refresh accounts to show newly connected account
      fetchAccounts();
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    if (platform && success === 'false') {
      const error = params.get('error');
      toast.error(error || `Failed to connect ${platform}`);
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    if (error) {
      toast.error(error);
      clearError();
    }
  }, [fetchAccounts, error, clearError]);

  const platforms = [
    {
      id: 'twitter',
      name: 'Twitter',
      icon: Twitter,
      color: '#1DA1F2',
      description: 'Connect your Twitter account to schedule and publish tweets',
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      icon: Linkedin,
      color: '#0077B5',
      description: 'Connect your LinkedIn profile to share professional content',
    },
    {
      id: 'instagram',
      name: 'Instagram',
      icon: Instagram,
      color: '#E4405F',
      description: 'Connect your Instagram account to post photos and stories',
    },
  ];

  const handleConnect = async (platformId) => {
    try {
      const oauthUrl = `${process.env.REACT_APP_BACKEND_URL}/api/auth/linkedin`;

      window.location.href = oauthUrl;

    } catch (err) {
      toast.error(`Failed to initiate ${platformId} connection`);
    }
  };

  const handleDisconnect = async (platformId) => {
    setConnecting(platformId);
    try {
      await disconnectAccountAPI(platformId);
      toast.success(`${platformId.charAt(0).toUpperCase() + platformId.slice(1)} disconnected successfully!`);
    } catch (err) {
      toast.error(err.response?.data?.message || `Failed to disconnect ${platformId}`);
    } finally {
      setConnecting(null);
    }
  };

  return (
    <div className="h-screen flex flex-col">
      <Navbar
        title="Connected Accounts"
        subtitle="Manage your social media connections"
      />

      <div className="flex-1 p-6 lg:p-8 overflow-y-auto">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Overview Card */}
          <Card className="glass-card border-none">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-heading font-semibold mb-1">Account Status</h3>
                  <p className="text-sm text-muted-foreground">
                    {Object.values(connectedAccounts).filter(Boolean).length} of {platforms.length} accounts connected
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Link2 className="h-8 w-8 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Platform Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {platforms.map((platform) => {
              const Icon = platform.icon;
              const isConnected = !!connectedAccounts[platform.id];
              const account = connectedAccounts[platform.id];
              const isConnectingThis = connecting === platform.id;

              return (
                <Card
                  key={platform.id}
                  data-testid={`platform-card-${platform.id}`}
                  className="glass-card border-none hover:-translate-y-2 transition-transform duration-300"
                >
                  <CardHeader>
                    <div className="flex items-center justify-between mb-4">
                      <div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center"
                        style={{ backgroundColor: `${platform.color}15` }}
                      >
                        <Icon
                          className="h-7 w-7"
                          style={{ color: platform.color }}
                        />
                      </div>
                      <Badge
                        className={isConnected ? 'bg-accent/20 text-accent' : 'bg-muted text-muted-foreground'}
                      >
                        {isConnected ? (
                          <>
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Connected
                          </>
                        ) : (
                          <>
                            <XCircle className="h-3 w-3 mr-1" />
                            Not Connected
                          </>
                        )}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl font-heading">{platform.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      {platform.description}
                    </p>

                    {isConnected && account && (
                      <div className="mb-4 p-3 rounded-xl bg-muted/50">
                        <p className="text-sm font-medium">{account.username}</p>
                        <p className="text-xs text-muted-foreground">
                          {account.followers?.toLocaleString()} followers
                        </p>
                      </div>
                    )}

                    {isConnected ? (
                      <Button
                        data-testid={`disconnect-${platform.id}`}
                        onClick={() => handleDisconnect(platform.id)}
                        variant="outline"
                        className="w-full rounded-full"
                        disabled={isConnectingThis || isLoading}
                      >
                        {isConnectingThis ? 'Disconnecting...' : 'Disconnect'}
                      </Button>
                    ) : (
                      <Button
                        data-testid={`connect-${platform.id}`}
                        onClick={() => handleConnect(platform.id)}
                        className="w-full rounded-full"
                        style={{
                          backgroundColor: platform.color,
                          color: 'white',
                        }}
                        disabled={isConnectingThis || isLoading}
                      >
                        {isConnectingThis ? 'Connecting...' : `Connect ${platform.name}`}
                      </Button>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Info Card */}
          <Card className="glass-card border-none border-l-4 border-l-primary">
            <CardContent className="p-6">
              <h3 className="text-lg font-heading font-semibold mb-2">How to connect accounts?</h3>
              <p className="text-sm text-muted-foreground mb-4">
                When you connect your social media accounts, you'll be redirected to authenticate securely with each platform.
                We only request the permissions necessary to schedule and publish your content.
              </p>
              <p className="text-sm text-muted-foreground">
                <strong>Note:</strong> Your credentials are encrypted and never stored in plain text. We use secure OAuth authentication.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AccountsPage;