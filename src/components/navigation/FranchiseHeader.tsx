import React, { useState } from 'react';
import { Button } from '../ui/button';
import { 
  Building2, 
  Users, 
  Info, 
  User, 
  Settings, 
  LogOut, 
  Gavel,
  FileText,
  MessageSquare,
  Menu,
  X
} from 'lucide-react';

interface FranchiseHeaderProps {
  userType: 'owner' | 'member';
  onNavigate: (view: string) => void;
  onLogout: () => void;
}

export const FranchiseHeader = ({ userType, onNavigate, onLogout }: FranchiseHeaderProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isOwner = userType === 'owner';
  
  const ownerNavItems = [
    { icon: Building2, label: 'Dashboard', action: () => { onNavigate('dashboard'); setMobileMenuOpen(false); } },
    { icon: Gavel, label: 'Bidding Platform', action: () => { onNavigate('bidding'); setMobileMenuOpen(false); } },
    { icon: Users, label: 'Franchise Members', action: () => { onNavigate('members'); setMobileMenuOpen(false); } },
    { icon: Info, label: 'Franchise Info', action: () => { onNavigate('franchise-info'); setMobileMenuOpen(false); } },
    { icon: MessageSquare, label: 'CRM', action: () => { onNavigate('crm'); setMobileMenuOpen(false); } },
    { icon: User, label: 'Profile', action: () => { onNavigate('profile'); setMobileMenuOpen(false); } },
    { icon: Settings, label: 'Settings', action: () => { onNavigate('settings'); setMobileMenuOpen(false); } }
  ];

  const memberNavItems = [
    { icon: Building2, label: 'Dashboard', action: () => { onNavigate('dashboard'); setMobileMenuOpen(false); } },
    { icon: Info, label: 'Franchise Info', action: () => { onNavigate('franchise-info'); setMobileMenuOpen(false); } },
    { icon: MessageSquare, label: 'CRM', action: () => { onNavigate('crm'); setMobileMenuOpen(false); } },
    { icon: FileText, label: 'Quotes', action: () => { onNavigate('quotes'); setMobileMenuOpen(false); } },
    { icon: User, label: 'Profile', action: () => { onNavigate('profile'); setMobileMenuOpen(false); } },
    { icon: Settings, label: 'Settings', action: () => { onNavigate('settings'); setMobileMenuOpen(false); } }
  ];

  const navItems = isOwner ? ownerNavItems : memberNavItems;

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-border/10 shadow-[0_8px_32px_rgba(0,0,0,0.1)] relative">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-accent/3 to-secondary/5"></div>
      
      <div className="relative px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          {/* Logo and Title Section */}
          <div className="flex items-center gap-3 sm:gap-6 min-w-0">
            <div className="flex items-center gap-2 sm:gap-4 min-w-0">
              <div className="relative flex-shrink-0">
                <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent rounded-xl blur-sm opacity-50"></div>
                <div className="relative p-2 sm:p-3 bg-gradient-to-br from-primary to-accent rounded-xl shadow-lg">
                  <Building2 className="h-5 w-5 sm:h-7 sm:w-7 text-white" />
                </div>
              </div>
              <div className="min-w-0">
                <h1 className="text-base sm:text-xl font-bold text-foreground tracking-tight whitespace-nowrap">
                  {isOwner ? 'Franchise Owner' : 'Franchise Member'}
                </h1>
                <p className="text-xs sm:text-sm text-muted-foreground font-medium hidden sm:block">
                  {isOwner ? 'Management Dashboard' : 'Member Portal'}
                </p>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item, index) => (
              <Button
                key={index}
                variant="ghost"
                onClick={item.action}
                className="relative text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-primary/5 px-3 lg:px-4 py-2 h-9 gap-2 transition-all duration-200 rounded-lg group border-0"
              >
                <item.icon className="h-4 w-4 transition-colors group-hover:text-primary" />
                <span className="hidden lg:inline">{item.label}</span>
                {/* Hover indicator */}
                <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-primary to-accent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200 rounded-full"></div>
              </Button>
            ))}
            
            {/* Desktop Logout Button */}
            <div className="ml-4 pl-4 border-l border-border/50">
              <Button
                variant="ghost"
                onClick={onLogout}
                className="text-sm font-medium text-muted-foreground hover:text-red-600 hover:bg-red-50 px-3 lg:px-4 py-2 h-9 gap-2 transition-all duration-200 rounded-lg group"
              >
                <LogOut className="h-4 w-4 transition-colors group-hover:text-red-600" />
                <span className="hidden lg:inline">Logout</span>
              </Button>
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 h-9 w-9"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border/10 bg-white/98 backdrop-blur-md">
            <div className="px-4 py-3 space-y-1">
              {navItems.map((item, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  onClick={item.action}
                  className="w-full justify-start gap-3 px-3 py-2 h-10 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-primary/5"
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Button>
              ))}
              
              {/* Mobile Logout Button */}
              <div className="pt-2 border-t border-border/10">
                <Button
                  variant="ghost"
                  onClick={() => { onLogout(); setMobileMenuOpen(false); }}
                  className="w-full justify-start gap-3 px-3 py-2 h-10 text-sm font-medium text-muted-foreground hover:text-red-600 hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};