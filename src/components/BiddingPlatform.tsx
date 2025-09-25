import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ArrowLeft, Gavel, TrendingUp, Users, Clock, LogOut } from 'lucide-react';
import { OwnerBiddingBoard } from './bidding/OwnerBiddingBoard';
import { CustomerBidsView } from './bidding/CustomerBidsView';
import { AdminBiddingOps } from './bidding/AdminBiddingOps';

interface BiddingPlatformProps {
  userType: 'owner' | 'member' | 'customer' | 'admin';
  onBack: () => void;
  onLogout: () => void;
}

const PlatformHeader = ({ userType, onBack, onLogout }: BiddingPlatformProps) => (
  <div className="bg-white/95 backdrop-blur-md border-b border-border/10 shadow-[0_8px_32px_rgba(0,0,0,0.1)] relative">
    {/* Subtle gradient overlay */}
    <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-accent/3 to-secondary/5"></div>
    
    <div className="relative px-8 py-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onBack} 
            className="text-muted-foreground hover:text-foreground hover:bg-primary/5 p-2 rounded-lg transition-all duration-200 border-0"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent rounded-xl blur-sm opacity-50"></div>
              <div className="relative p-3 bg-gradient-to-br from-primary to-accent rounded-xl shadow-lg">
                <Gavel className="h-6 w-6 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground tracking-tight">
                Bidding Platform
              </h1>
              <p className="text-sm text-muted-foreground font-medium mt-1">
                {userType === 'owner' && 'Manage bidding operations and opportunities'}
                {userType === 'customer' && 'View live bids on your service requests'}
                {userType === 'admin' && 'Administrative platform controls'}
                {userType === 'member' && 'Browse available opportunities'}
              </p>
            </div>
          </div>
        </div>
        <Button 
          variant="ghost" 
          onClick={onLogout} 
          className="text-sm font-medium text-muted-foreground hover:text-red-600 hover:bg-red-50 px-4 py-2 h-9 gap-2 transition-all duration-200 rounded-lg"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden lg:inline">Logout</span>
        </Button>
      </div>
    </div>
  </div>
);

const PlatformStats = () => (
  <div className="grid gap-6 md:grid-cols-4 p-8">
    <Card className="bg-gradient-to-br from-primary/15 to-primary/5 border-primary/20 hover-lift shadow-[var(--shadow-lg)] backdrop-blur-sm">
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-[var(--gradient-primary)] rounded-xl shadow-[var(--shadow-brand)]">
            <Gavel className="h-6 w-6 text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold text-muted-foreground">Active Auctions</p>
            <p className="text-3xl font-bold text-foreground">24</p>
            <p className="text-xs text-green-600 font-semibold">+3 today</p>
          </div>
        </div>
      </CardContent>
    </Card>
    
    <Card className="card-yellow hover-lift backdrop-blur-sm">
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-[var(--gradient-yellow)] rounded-xl shadow-[var(--shadow-lg)]">
            <TrendingUp className="h-6 w-6 text-foreground" />
          </div>
          <div>
            <p className="text-sm font-semibold text-muted-foreground">Avg Savings</p>
            <p className="text-3xl font-bold text-foreground">18%</p>
            <p className="text-xs text-green-600 font-semibold">+2% this week</p>
          </div>
        </div>
      </CardContent>
    </Card>
    
    <Card className="bg-gradient-to-br from-secondary/15 to-secondary/5 border-secondary/20 hover-lift shadow-[var(--shadow-lg)] backdrop-blur-sm">
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-[var(--gradient-secondary)] rounded-xl shadow-[var(--shadow-brand)]">
            <Users className="h-6 w-6 text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold text-muted-foreground">Active Bidders</p>
            <p className="text-3xl font-bold text-foreground">156</p>
            <p className="text-xs text-green-600 font-semibold">+12 this month</p>
          </div>
        </div>
      </CardContent>
    </Card>
    
    <Card className="bg-gradient-to-br from-blue-500/15 to-blue-500/5 border-blue-500/20 hover-lift shadow-[var(--shadow-lg)] backdrop-blur-sm">
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
            <Clock className="h-6 w-6 text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold text-muted-foreground">Avg Response</p>
            <p className="text-3xl font-bold text-foreground">2.3h</p>
            <p className="text-xs text-green-600 font-semibold">-0.5h improved</p>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
);

export const BiddingPlatform = ({ userType, onBack, onLogout }: BiddingPlatformProps) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - minimal styling */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={onBack} 
                className="text-gray-400 hover:text-gray-600 hover:bg-gray-50 p-2 rounded-lg transition-colors duration-200"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-800 rounded-md flex items-center justify-center">
                  <span className="text-white font-medium text-xs">B2C</span>
                </div>
                <div>
                  <h1 className="text-lg font-medium text-gray-900">Bidding Platform</h1>
                  <div className="h-0.5 w-8 bg-blue-600 rounded-full"></div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-500">
                {userType === 'owner' && 'Franchise Owner Portal'}
                {userType === 'customer' && 'Customer Dashboard'}
                {userType === 'admin' && 'Administrative Portal'}
                {userType === 'member' && 'Member Portal'}
              </div>
              <Button 
                variant="ghost" 
                onClick={onLogout} 
                className="text-sm text-gray-500 hover:text-red-600 hover:bg-red-50 px-3 py-2 h-8 gap-2 transition-colors duration-200 rounded-md"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden lg:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards - minimal styling */}
      {(userType === 'owner' || userType === 'admin') && (
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="grid gap-4 md:grid-cols-4">
            <div className="bg-white rounded-lg border border-gray-200 p-5 hover:border-gray-300 transition-colors duration-200">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-gray-100 rounded-md flex items-center justify-center">
                  <Gavel className="h-4 w-4 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Active Auctions</p>
                  <p className="text-xl font-semibold text-gray-900">24</p>
                  <p className="text-xs text-gray-500">+3 today</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg border border-gray-200 p-5 hover:border-gray-300 transition-colors duration-200">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-yellow-50 rounded-md flex items-center justify-center">
                  <TrendingUp className="h-4 w-4 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Avg Savings</p>
                  <p className="text-xl font-semibold text-gray-900">18%</p>
                  <p className="text-xs text-gray-500">+2% this week</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg border border-gray-200 p-5 hover:border-gray-300 transition-colors duration-200">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-gray-100 rounded-md flex items-center justify-center">
                  <Users className="h-4 w-4 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Active Bidders</p>
                  <p className="text-xl font-semibold text-gray-900">156</p>
                  <p className="text-xs text-gray-500">+12 this month</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg border border-gray-200 p-5 hover:border-gray-300 transition-colors duration-200">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-blue-50 rounded-md flex items-center justify-center">
                  <Clock className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Avg Response</p>
                  <p className="text-xl font-semibold text-gray-900">2.3h</p>
                  <p className="text-xs text-gray-500">-0.5h improved</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        {userType === 'owner' && (
          <div className="bg-white rounded-lg border border-gray-200">
            <OwnerBiddingBoard />
          </div>
        )}
        
        {userType === 'customer' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-5 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900 flex items-center gap-2 mb-1">
                  <Gavel className="h-4 w-4 text-yellow-600" />
                  Your Active Bids
                </h2>
                <p className="text-gray-600 text-sm">
                  Live bidding on your cleaning service requests
                </p>
              </div>
              <div className="p-5">
                <Tabs defaultValue="quote-1" className="space-y-4">
                  <TabsList className="grid w-full grid-cols-3 bg-gray-50 p-1 h-auto rounded-md">
                    <TabsTrigger 
                      value="quote-1" 
                      className="data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm py-2 text-sm font-medium rounded-sm"
                    >
                      Office Complex - $850
                    </TabsTrigger>
                    <TabsTrigger 
                      value="quote-2"
                      className="data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm py-2 text-sm font-medium rounded-sm"
                    >
                      Medical Center - $1200
                    </TabsTrigger>
                    <TabsTrigger 
                      value="quote-3"
                      className="data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm py-2 text-sm font-medium rounded-sm"
                    >
                      Retail Space - $650
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="quote-1" className="space-y-4">
                    <CustomerBidsView quoteId="quote-1" />
                  </TabsContent>
                  <TabsContent value="quote-2" className="space-y-4">
                    <CustomerBidsView quoteId="quote-2" />
                  </TabsContent>
                  <TabsContent value="quote-3" className="space-y-4">
                    <CustomerBidsView quoteId="quote-3" />
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        )}
        
        {userType === 'admin' && (
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="p-5 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900 flex items-center gap-2 mb-1">
                <Gavel className="h-4 w-4 text-yellow-600" />
                Platform Administration
              </h2>
              <p className="text-gray-600 text-sm">
                Manage bidding platform settings and operations
              </p>
            </div>
            <div className="p-5">
              <AdminBiddingOps />
            </div>
          </div>
        )}
        
        {userType === 'member' && (
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="p-5 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900 flex items-center gap-2 mb-1">
                <Gavel className="h-4 w-4 text-yellow-600" />
                Available Opportunities
              </h2>
              <p className="text-gray-600 text-sm">
                Browse and bid on cleaning service opportunities
              </p>
            </div>
            <div className="p-5">
              <div className="text-center py-12 text-gray-500">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Gavel className="h-6 w-6 text-gray-400" />
                </div>
                <p className="text-base mb-3">Member bidding interface coming soon</p>
                <div className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-600 rounded-md text-sm">
                  Feature in Development
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="text-center py-4 text-xs text-gray-400 border-t border-gray-200">
        <p>© 2024 Bid2Clean. Professional cleaning services you can trust.</p>
      </div>
    </div>
  );
};