import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import useAuthStore from '../stores/authStore';
import api from '../utils/api';
import { toast } from 'sonner';

const SignupPage = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // TODO: Replace with actual API call when backend is ready
      // const response = await api.post('/auth/signup', formData);
      // login(response.data.user, response.data.token);

      // Mock signup for now
      const mockUser = {
        id: '1',
        name: formData.name,
        email: formData.email,
      };
      const mockToken = 'demo-token-12345';
      login(mockUser, mockToken);

      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Visual */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 items-center justify-center p-12">
        <div className="max-w-lg space-y-8">
          <h2 className="text-5xl font-heading font-bold tracking-tight">
            Start your journey to
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
              social media success
            </span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Join thousands of creators and businesses using AI to transform
            their social media strategy.
          </p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center">
              <span className="text-white font-bold text-2xl">SP</span>
            </div>
            <span className="text-3xl font-heading font-bold tracking-tight">
              SocialPulse AI
            </span>
          </div>

          {/* Header */}
          <div>
            <h1 className="text-4xl font-heading font-bold tracking-tight mb-2">
              Create account
            </h1>
            <p className="text-muted-foreground">
              Start managing your social media with AI
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="name"
                  data-testid="signup-name-input"
                  type="text"
                  placeholder="John Doe"
                  className="pl-10 h-12 rounded-full"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="email"
                  data-testid="signup-email-input"
                  type="email"
                  placeholder="you@example.com"
                  className="pl-10 h-12 rounded-full"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="password"
                  data-testid="signup-password-input"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a strong password"
                  className="pl-10 pr-10 h-12 rounded-full"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required
                />
                <button
                  type="button"
                  data-testid="toggle-password-visibility"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <Button
              data-testid="signup-submit-button"
              type="submit"
              className="w-full btn-primary h-12 text-base"
              disabled={loading}
            >
              {loading ? 'Creating account...' : 'Create account'}
            </Button>
          </form>

          {/* Login link */}
          <p className="text-center text-muted-foreground">
            Already have an account?{' '}
            <Link
              to="/login"
              data-testid="login-link"
              className="text-primary font-medium hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;