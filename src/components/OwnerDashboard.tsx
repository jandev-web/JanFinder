// src/components/pages/Owner/index.tsx (your prior "OwnerPage")
// This is a CLIENT component that receives ownerData from the server.
'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Building2, Users, DollarSign, TrendingUp, Calendar, Star, Mail, Phone, Target, Award, Clock, BarChart3, User } from 'lucide-react';
import { FranchiseHeader } from './navigation/FranchiseHeader';



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
    default: 'bg-gradient-to-br from-card to-muted/50 border-border',
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

const OwnerDashboard = () => (
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

export default OwnerDashboard;