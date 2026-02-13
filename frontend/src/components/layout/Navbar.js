import React from 'react';
import { Bell } from 'lucide-react';
import ThemeToggle from '../ThemeToggle';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

const Navbar = ({ title, subtitle }) => {
  return (
    <header className="sticky top-0 z-30 glass-card border-b border-border px-6 py-4 backdrop-blur-md bg-background/80">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold tracking-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
          )}
        </div>

        <div className="flex items-center space-x-3">
          <Button
            data-testid="notifications-button"
            variant="ghost"
            size="icon"
            className="rounded-full relative"
          >
            <Bell className="h-5 w-5" />
            <Badge
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-secondary text-xs"
            >
              3
            </Badge>
          </Button>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

export default Navbar;