import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Building2, Users, DollarSign, TrendingUp, Calendar, Star, Mail, Phone, Target, Award, Clock, BarChart3, User } from 'lucide-react';
import { FranchiseHeader } from './navigation/FranchiseHeader';

interface DashboardProps {
  userType: 'owner' | 'member' | 'customer' | 'admin';
  onSwitchView: (view: string) => void;
  onLogout: () => void;
}

// Mock data
const mockQuotes = [
  {
    id: '1',
    customerName: 'TechCorp Office',
    location: '123 Business Ave',
    sqft: 5000,
    frequency: 'Weekly',
    status: 'available',
    price: 850,
    submittedDate: '2024-01-15'
  },
  {
    id: '2',
    customerName: 'Medical Center',
    location: '456 Health St',
    sqft: 3200,
    frequency: 'Daily',
    status: 'accepted',
    price: 1200,
    submittedDate: '2024-01-14'
  }
];

const mockMembers = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john@cleanpro.com',
    phone: '(555) 123-4567',
    quotesAssigned: 3,
    revenue: 2850,
    rating: 4.8
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah@cleanpro.com',
    phone: '(555) 987-6543',
    quotesAssigned: 5,
    revenue: 4200,
    rating: 4.9
  }
];

const MetricsCard = ({ icon: Icon, title, value, subtitle, trend, variant = 'default' }: {
  icon: React.ElementType;
  title: string;
  value: string | number;
  subtitle: string;
  trend?: string;
  variant?: 'default' | 'primary' | 'secondary' | 'accent';
}) => {
  const variants = {
    default: 'card-gradient',
    primary: 'bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20',
    secondary: 'bg-gradient-to-br from-secondary/10 to-secondary/5 border-secondary/20',
    accent: 'bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20'
  };

  const iconVariants = {
    default: 'text-primary',
    primary: 'text-primary',
    secondary: 'text-secondary',
    accent: 'text-accent'
  };

  return (
    <Card className={`${variants[variant]} hover-lift transition-all duration-300 border-0 shadow-[var(--shadow-lg)]`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-sm font-semibold text-foreground">{title}</CardTitle>
        <div className={`p-2.5 ${variant === 'default' ? 'bg-primary/10' : `bg-${variant}/10`} rounded-xl`}>
          <Icon className={`h-5 w-5 ${iconVariants[variant]}`} />
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="text-3xl font-bold text-foreground mb-1">{value}</div>
        <p className="text-sm text-muted-foreground flex items-center gap-1">
          {trend && <span className="text-green-600 font-semibold">{trend}</span>}
          {subtitle}
        </p>
      </CardContent>
    </Card>
  );
};

export const OwnerDashboard = ({ onSwitchView, onLogout }: { onSwitchView: (view: string) => void; onLogout: () => void }) => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
    {/* Key Metrics */}
      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-5 hover:border-gray-300 transition-colors duration-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 sm:w-9 sm:h-9 bg-gray-100 rounded-md flex items-center justify-center flex-shrink-0">
              <Target className="h-4 w-4 text-gray-600" />
            </div>
            <div className="min-w-0">
              <p className="text-xs sm:text-sm text-gray-600">Available Quotes</p>
              <p className="text-lg sm:text-xl font-semibold text-gray-900">12</p>
              <p className="text-xs text-gray-500">+3 from last week</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-5 hover:border-gray-300 transition-colors duration-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 sm:w-9 sm:h-9 bg-yellow-50 rounded-md flex items-center justify-center flex-shrink-0">
              <Award className="h-4 w-4 text-yellow-600" />
            </div>
            <div className="min-w-0">
              <p className="text-xs sm:text-sm text-gray-600">Won Contracts</p>
              <p className="text-lg sm:text-xl font-semibold text-gray-900">8</p>
              <p className="text-xs text-gray-500">+2 from last week</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-5 hover:border-gray-300 transition-colors duration-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 sm:w-9 sm:h-9 bg-gray-100 rounded-md flex items-center justify-center flex-shrink-0">
              <DollarSign className="h-4 w-4 text-gray-600" />
            </div>
            <div className="min-w-0">
              <p className="text-xs sm:text-sm text-gray-600">Monthly Revenue</p>
              <p className="text-lg sm:text-xl font-semibold text-gray-900">$24,500</p>
              <p className="text-xs text-gray-500">+12% from last month</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-5 hover:border-gray-300 transition-colors duration-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 sm:w-9 sm:h-9 bg-blue-50 rounded-md flex items-center justify-center flex-shrink-0">
              <Users className="h-4 w-4 text-blue-600" />
            </div>
            <div className="min-w-0">
              <p className="text-xs sm:text-sm text-gray-600">Team Members</p>
              <p className="text-lg sm:text-xl font-semibold text-gray-900">{mockMembers.length}</p>
              <p className="text-xs text-gray-500">active members</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
        {/* Recent Quotes */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="p-4 sm:p-5 border-b border-gray-200">
              <h2 className="text-base sm:text-lg font-medium text-gray-900 flex items-center gap-2 mb-1">
                <Target className="h-4 w-4 text-yellow-600" />
                Recent Quotes
              </h2>
              <p className="text-gray-600 text-xs sm:text-sm">
                Latest cleaning service requests
              </p>
            </div>
            <div className="p-4 sm:p-5 overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-gray-700 font-medium text-xs sm:text-sm">Customer</TableHead>
                    <TableHead className="text-gray-700 font-medium text-xs sm:text-sm hidden sm:table-cell">Location</TableHead>
                    <TableHead className="text-gray-700 font-medium text-xs sm:text-sm">Value</TableHead>
                    <TableHead className="text-gray-700 font-medium text-xs sm:text-sm">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockQuotes.map((quote) => (
                    <TableRow key={quote.id} className="hover:bg-gray-50 transition-colors">
                      <TableCell className="font-medium text-gray-900 text-xs sm:text-sm">
                        <div>
                          <div>{quote.customerName}</div>
                          <div className="text-xs text-gray-500 sm:hidden">{quote.location}</div>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-600 text-xs sm:text-sm hidden sm:table-cell">{quote.location}</TableCell>
                      <TableCell className="font-medium text-gray-900 text-xs sm:text-sm">${quote.price.toLocaleString()}</TableCell>
                      <TableCell>
                        <div className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                          quote.status === 'available' 
                            ? 'bg-green-50 text-green-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {quote.status}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>

        {/* Team Performance */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-4 sm:p-5 border-b border-gray-200">
            <h2 className="text-base sm:text-lg font-medium text-gray-900 flex items-center gap-2 mb-1">
              <Users className="h-4 w-4 text-blue-600" />
              Team Performance
            </h2>
            <p className="text-gray-600 text-xs sm:text-sm">
              Top performing members
            </p>
          </div>
          <div className="p-4 sm:p-5 space-y-3">
            {mockMembers.map((member) => (
              <div key={member.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors duration-200">
                <div className="min-w-0">
                  <p className="font-medium text-gray-900 text-sm sm:text-base truncate">{member.name}</p>
                  <p className="text-xs sm:text-sm text-gray-600">${member.revenue.toLocaleString()} revenue</p>
                </div>
                <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded flex-shrink-0 ml-2">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-500" />
                  <span className="text-xs sm:text-sm font-medium text-yellow-700">{member.rating}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
);

export const MemberDashboard = ({ onSwitchView, onLogout }: { onSwitchView: (view: string) => void; onLogout: () => void }) => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
    {/* Key Metrics */}
      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-5 hover:border-gray-300 transition-colors duration-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 sm:w-9 sm:h-9 bg-gray-100 rounded-md flex items-center justify-center flex-shrink-0">
              <Calendar className="h-4 w-4 text-gray-600" />
            </div>
            <div className="min-w-0">
              <p className="text-xs sm:text-sm text-gray-600">Assigned Jobs</p>
              <p className="text-lg sm:text-xl font-semibold text-gray-900">5</p>
              <p className="text-xs text-gray-500">+2 from last week</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-5 hover:border-gray-300 transition-colors duration-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 sm:w-9 sm:h-9 bg-yellow-50 rounded-md flex items-center justify-center flex-shrink-0">
              <DollarSign className="h-4 w-4 text-yellow-600" />
            </div>
            <div className="min-w-0">
              <p className="text-xs sm:text-sm text-gray-600">Your Revenue</p>
              <p className="text-lg sm:text-xl font-semibold text-gray-900">$4,200</p>
              <p className="text-xs text-gray-500">+15% from last month</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-5 hover:border-gray-300 transition-colors duration-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 sm:w-9 sm:h-9 bg-blue-50 rounded-md flex items-center justify-center flex-shrink-0">
              <Star className="h-4 w-4 text-blue-600" />
            </div>
            <div className="min-w-0">
              <p className="text-xs sm:text-sm text-gray-600">Customer Rating</p>
              <p className="text-lg sm:text-xl font-semibold text-gray-900">4.9</p>
              <p className="text-xs text-gray-500">from 23 reviews</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-5 hover:border-gray-300 transition-colors duration-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 sm:w-9 sm:h-9 bg-green-50 rounded-md flex items-center justify-center flex-shrink-0">
              <Users className="h-4 w-4 text-green-600" />
            </div>
            <div className="min-w-0">
              <p className="text-xs sm:text-sm text-gray-600">Active Customers</p>
              <p className="text-lg sm:text-xl font-semibold text-gray-900">8</p>
              <p className="text-xs text-gray-500">regular clients</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
        {/* Assigned Jobs */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="p-4 sm:p-5 border-b border-gray-200">
              <h2 className="text-base sm:text-lg font-medium text-gray-900 flex items-center gap-2 mb-1">
                <Calendar className="h-4 w-4 text-blue-600" />
                Your Assigned Jobs
              </h2>
              <p className="text-gray-600 text-xs sm:text-sm">
                Current and upcoming cleaning assignments
              </p>
            </div>
            <div className="p-4 sm:p-5 overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-gray-700 font-medium text-xs sm:text-sm">Customer</TableHead>
                    <TableHead className="text-gray-700 font-medium text-xs sm:text-sm hidden sm:table-cell">Location</TableHead>
                    <TableHead className="text-gray-700 font-medium text-xs sm:text-sm hidden md:table-cell">Date</TableHead>
                    <TableHead className="text-gray-700 font-medium text-xs sm:text-sm">Value</TableHead>
                    <TableHead className="text-gray-700 font-medium text-xs sm:text-sm">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow className="hover:bg-gray-50 transition-colors">
                    <TableCell className="font-medium text-gray-900 text-xs sm:text-sm">
                      <div>
                        <div>Office Complex A</div>
                        <div className="text-xs text-gray-500 sm:hidden">Downtown Plaza</div>
                        <div className="text-xs text-gray-500 md:hidden">Jan 20, 2024</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-600 text-xs sm:text-sm hidden sm:table-cell">Downtown Plaza</TableCell>
                    <TableCell className="text-gray-600 text-xs sm:text-sm hidden md:table-cell">Jan 20, 2024</TableCell>
                    <TableCell className="font-medium text-gray-900 text-xs sm:text-sm">$850</TableCell>
                    <TableCell>
                      <div className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-50 text-blue-700">
                        Scheduled
                      </div>
                    </TableCell>
                  </TableRow>
                  <TableRow className="hover:bg-gray-50 transition-colors">
                    <TableCell className="font-medium text-gray-900 text-xs sm:text-sm">
                      <div>
                        <div>Medical Center</div>
                        <div className="text-xs text-gray-500 sm:hidden">Health District</div>
                        <div className="text-xs text-gray-500 md:hidden">Jan 22, 2024</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-600 text-xs sm:text-sm hidden sm:table-cell">Health District</TableCell>
                    <TableCell className="text-gray-600 text-xs sm:text-sm hidden md:table-cell">Jan 22, 2024</TableCell>
                    <TableCell className="font-medium text-gray-900 text-xs sm:text-sm">$1,200</TableCell>
                    <TableCell>
                      <div className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-50 text-green-700">
                        Completed
                      </div>
                    </TableCell>
                  </TableRow>
                  <TableRow className="hover:bg-gray-50 transition-colors">
                    <TableCell className="font-medium text-gray-900 text-xs sm:text-sm">
                      <div>
                        <div>Retail Store B</div>
                        <div className="text-xs text-gray-500 sm:hidden">Shopping Center</div>
                        <div className="text-xs text-gray-500 md:hidden">Jan 25, 2024</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-600 text-xs sm:text-sm hidden sm:table-cell">Shopping Center</TableCell>
                    <TableCell className="text-gray-600 text-xs sm:text-sm hidden md:table-cell">Jan 25, 2024</TableCell>
                    <TableCell className="font-medium text-gray-900 text-xs sm:text-sm">$650</TableCell>
                    <TableCell>
                      <div className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-yellow-50 text-yellow-700">
                        Pending
                      </div>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>
        </div>

        {/* Performance Summary */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-4 sm:p-5 border-b border-gray-200">
            <h2 className="text-base sm:text-lg font-medium text-gray-900 flex items-center gap-2 mb-1">
              <BarChart3 className="h-4 w-4 text-green-600" />
              Performance Summary
            </h2>
            <p className="text-gray-600 text-xs sm:text-sm">
              Your recent achievements
            </p>
          </div>
          <div className="p-4 sm:p-5 space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
              <div className="min-w-0">
                <p className="font-medium text-gray-900 text-sm sm:text-base">Jobs Completed</p>
                <p className="text-xs sm:text-sm text-gray-600">This month</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-xl sm:text-2xl font-bold text-gray-900">12</p>
                <p className="text-xs text-green-600">+3 from last month</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
              <div className="min-w-0">
                <p className="font-medium text-gray-900 text-sm sm:text-base">Average Rating</p>
                <p className="text-xs sm:text-sm text-gray-600">From customers</p>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-500" />
                <span className="text-lg font-bold text-gray-900">4.9</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
              <div className="min-w-0">
                <p className="font-medium text-gray-900 text-sm sm:text-base">On-Time Rate</p>
                <p className="text-xs sm:text-sm text-gray-600">Punctuality score</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-lg font-bold text-gray-900">98%</p>
                <p className="text-xs text-green-600">Excellent</p>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-200">
              <Button 
                onClick={() => onSwitchView('profile')} 
                className="w-full gap-2 text-sm"
                variant="outline"
              >
                <User className="h-4 w-4" />
                View Full Profile
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
);

export const CustomerDashboard = ({ onSwitchView, onLogout }: { onSwitchView: (view: string) => void; onLogout: () => void }) => (
  <div className="min-h-screen bg-gray-50">
    <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-medium text-gray-900 mb-2">Customer Portal</h1>
          <div className="h-0.5 w-12 bg-blue-600 rounded-full mb-3"></div>
          <p className="text-gray-600">Manage your cleaning service requests and view bidding</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => onSwitchView('bidding')}
            className="px-5 py-2 bg-gray-800 text-white rounded-md font-medium hover:bg-gray-900 transition-colors duration-200"
          >
            View Live Bidding
          </button>
          <button 
            onClick={onLogout}
            className="px-5 py-2 bg-gray-100 text-gray-700 rounded-md font-medium hover:bg-gray-200 transition-colors duration-200"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Customer Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white rounded-lg border border-gray-200 p-5 hover:border-gray-300 transition-colors duration-200">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gray-100 rounded-md flex items-center justify-center">
              <Target className="h-4 w-4 text-gray-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Active Quotes</p>
              <p className="text-xl font-semibold text-gray-900">3</p>
              <p className="text-xs text-gray-500">awaiting bids</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-5 hover:border-gray-300 transition-colors duration-200">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-50 rounded-md flex items-center justify-center">
              <Clock className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Avg Response Time</p>
              <p className="text-xl font-semibold text-gray-900">2.5 hrs</p>
              <p className="text-xs text-gray-500">to first bid</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-5 hover:border-gray-300 transition-colors duration-200">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gray-100 rounded-md flex items-center justify-center">
              <DollarSign className="h-4 w-4 text-gray-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Saved</p>
              <p className="text-xl font-semibold text-gray-900">$1,250</p>
              <p className="text-xs text-gray-500">through bidding</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-5 hover:border-gray-300 transition-colors duration-200">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-yellow-50 rounded-md flex items-center justify-center">
              <BarChart3 className="h-4 w-4 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Service History</p>
              <p className="text-xl font-semibold text-gray-900">12</p>
              <p className="text-xs text-gray-500">completed jobs</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quote Requests */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-5 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900 flex items-center gap-2 mb-1">
            <Target className="h-4 w-4 text-yellow-600" />
            Your Quote Requests
          </h2>
          <p className="text-gray-600 text-sm">
            Track your cleaning service requests and bids
          </p>
        </div>
        <div className="p-5">
          <div className="text-center py-12 text-gray-500">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Building2 className="h-6 w-6 text-gray-400" />
            </div>
            <p className="text-base mb-3">Your quote requests will appear here</p>
            <button className="px-6 py-2 bg-gray-800 text-white rounded-md font-medium hover:bg-gray-900 transition-colors duration-200">
              Request New Quote
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
);