// src/components/pages/Owner/index.tsx (your prior "OwnerPage")
// This is a CLIENT component that receives ownerData from the server.
'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Building2, Users, DollarSign, TrendingUp, Calendar, Star, Mail, Phone, MapPin } from 'lucide-react';
import { OwnerBiddingBoard } from '@/components/bidding/OwnerBiddingBoard';
import { CustomerBidsView } from '@/components/bidding/CustomerBidsView';
import { AdminBiddingOps } from '@/components/bidding/AdminBiddingOps';

// Mock data for demonstration
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

export default function Owner() {




  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">Owner Dashboard</h1>
          </div>

          <Tabs defaultValue="bidding" className="space-y-4">
            <TabsList>
              <TabsTrigger value="bidding">Bidding System</TabsTrigger>
              <TabsTrigger value="quotes">Quote Management</TabsTrigger>
              <TabsTrigger value="members">Member Management</TabsTrigger>
              <TabsTrigger value="customers">Customer CRM</TabsTrigger>
            </TabsList>

            <TabsContent value="bidding">
              <OwnerBiddingBoard />
            </TabsContent>

            <TabsContent value="quotes" className="space-y-4">
              {/* Metrics Cards */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-900">Available Quotes</CardTitle>
                    <DollarSign className="h-4 w-4 text-gray-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-gray-900">12</div>
                    <p className="text-xs text-gray-500">+3 from last week</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-900">Accepted Quotes</CardTitle>
                    <TrendingUp className="h-4 w-4 text-gray-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-gray-900">8</div>
                    <p className="text-xs text-gray-500">+2 from last week</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-900">Monthly Revenue</CardTitle>
                    <DollarSign className="h-4 w-4 text-gray-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-gray-900">$24,500</div>
                    <p className="text-xs text-gray-500">+12% from last month</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-900">Active Members</CardTitle>
                    <Users className="h-4 w-4 text-gray-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-gray-900">{mockMembers.length}</div>
                    <p className="text-xs text-gray-500">All members active</p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-gray-900">Available Quotes</CardTitle>
                  <CardDescription className="text-gray-600">Quotes available for bidding</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Customer</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Size</TableHead>
                        <TableHead>Frequency</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockQuotes.map((quote) => (
                        <TableRow key={quote.id}>
                          <TableCell className="font-medium">{quote.customerName}</TableCell>
                          <TableCell>{quote.location}</TableCell>
                          <TableCell>{quote.sqft} sq ft</TableCell>
                          <TableCell>{quote.frequency}</TableCell>
                          <TableCell>${quote.price}</TableCell>
                          <TableCell>
                            <Badge variant={quote.status === 'available' ? 'default' : 'secondary'}>
                              {quote.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button size="sm" variant="outline">
                              {quote.status === 'available' ? 'Bid Now' : 'View Details'}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="members" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Team Members</CardTitle>
                  <CardDescription>Manage your cleaning team members</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Quotes Assigned</TableHead>
                        <TableHead>Revenue Generated</TableHead>
                        <TableHead>Rating</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockMembers.map((member) => (
                        <TableRow key={member.id}>
                          <TableCell className="font-medium">{member.name}</TableCell>
                          <TableCell>
                            <div className="space-y-1 text-sm">
                              <div className="flex items-center gap-1">
                                <Mail className="h-3 w-3" />
                                {member.email}
                              </div>
                              <div className="flex items-center gap-1">
                                <Phone className="h-3 w-3" />
                                {member.phone}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{member.quotesAssigned}</TableCell>
                          <TableCell>${member.revenue}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              {member.rating}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Button size="sm" variant="outline">Manage</Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="customers" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Customer CRM</CardTitle>
                  <CardDescription>Manage customer relationships and quotes</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    <Building2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Customer CRM features coming soon</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
