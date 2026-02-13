import React from 'react';
import { Twitter, Linkedin, Instagram, Link2, CheckCircle, XCircle } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import useAccountsStore from '../stores/accountsStore';
import { toast } from 'sonner';

const AccountsPage = () => {
  const { connectedAccounts, connectAccount, disconnectAccount } = useAccountsStore();

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

  const handleConnect = (platformId) => {
    // TODO: Implement actual OAuth flow when backend is ready
    const mockAccountData = {
      id: `${platformId}-123`,
      username: `@demo_${platformId}`,
      followers: Math.floor(Math.random() * 10000),
      connectedAt: new Date().toISOString(),
    };

    connectAccount(platformId, mockAccountData);
    toast.success(`${platformId.charAt(0).toUpperCase() + platformId.slice(1)} connected successfully!`);
  };

  const handleDisconnect = (platformId) => {
    disconnectAccount(platformId);
    toast.success(`${platformId.charAt(0).toUpperCase() + platformId.slice(1)} disconnected successfully!`);
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
                      >
                        Disconnect
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
                      >
                        Connect {platform.name}
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
                <strong>Note:</strong> Your credentials are never stored on our servers. We use secure OAuth authentication.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AccountsPage;