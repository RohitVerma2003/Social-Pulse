import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Calendar,
  Zap,
  LineChart,
  Shield,
  Clock,
} from 'lucide-react';
import { Button } from '../components/ui/button';
import ThemeToggle from '../components/ThemeToggle';

const LandingPage = () => {
  const features = [
    {
      icon: Sparkles,
      title: 'AI-Powered Content',
      description:
        'Generate engaging posts with our advanced AI that understands your brand voice.',
    },
    {
      icon: Calendar,
      title: 'Smart Scheduling',
      description:
        'Plan and visualize your content calendar with an intuitive drag-and-drop interface.',
    },
    {
      icon: Zap,
      title: 'Auto Publishing',
      description:
        'Automatically post to Twitter, LinkedIn, and Instagram at optimal times.',
    },
    {
      icon: LineChart,
      title: 'Deep Analytics',
      description:
        'Track performance and engagement across all your social media platforms.',
    },
    {
      icon: Shield,
      title: 'Secure & Reliable',
      description:
        'Enterprise-grade security with reliable API integrations you can trust.',
    },
    {
      icon: Clock,
      title: 'Save Time',
      description:
        'Reduce content creation time by 80% with intelligent automation.',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-border backdrop-blur-md bg-background/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center">
                <span className="text-white font-bold text-xl">SP</span>
              </div>
              <span className="text-2xl font-heading font-bold tracking-tight">
                SocialPulse AI
              </span>
            </div>

            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <Link to="/login">
                <Button
                  data-testid="nav-login-button"
                  variant="ghost"
                  className="rounded-full"
                >
                  Login
                </Button>
              </Link>
              <Link to="/signup">
                <Button
                  data-testid="nav-signup-button"
                  className="btn-primary"
                >
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-20 dark:opacity-10"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1767482712541-d104b3826d3d?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzMzl8MHwxfHNlYXJjaHwyfHxhYnN0cmFjdCUyMDNkJTIwc2hhcGVzJTIwdmlicmFudCUyMGdyYWRpZW50fGVufDB8fHx8MTc3MDk4MDg2N3ww&ixlib=rb-4.1.0&q=85')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full glass-card mb-8">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Powered by Advanced AI</span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-heading font-bold tracking-tight mb-6">
            Create, Schedule &{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent">
              Automate
            </span>
            <br />
            Your Social Media
          </h1>

          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto mb-12">
            The all-in-one platform that helps businesses and creators generate
            engaging content, schedule posts, and publish automatically across
            all major social platforms.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/signup">
              <Button
                data-testid="hero-get-started-button"
                size="lg"
                className="btn-primary text-lg px-8 py-6"
              >
                Get Started Free
              </Button>
            </Link>
            <Button
              data-testid="hero-watch-demo-button"
              size="lg"
              variant="outline"
              className="rounded-full text-lg px-8 py-6"
            >
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-heading font-bold tracking-tight mb-4">
              Everything you need to
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                dominate social media
              </span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our platform combines AI content generation, smart scheduling, and
              automated publishing in one powerful tool.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  data-testid={`feature-card-${index}`}
                  className="p-8 rounded-3xl glass-card hover:-translate-y-2 transition-transform duration-300"
                >
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-6">
                    <Icon className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-xl font-heading font-semibold mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="p-12 rounded-3xl glass-card border-2 border-primary/20">
            <h2 className="text-4xl font-heading font-bold tracking-tight mb-6">
              Ready to transform your
              <br />
              social media strategy?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join thousands of creators and businesses using SocialPulse AI
            </p>
            <Link to="/signup">
              <Button
                data-testid="cta-get-started-button"
                size="lg"
                className="btn-primary text-lg px-8 py-6"
              >
                Start Your Free Trial
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-border">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-muted-foreground">
            © 2024 SocialPulse AI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;