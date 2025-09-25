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
  availableQuotes: any;
}

export const BiddingPlatform = ({ availableQuotes }: BiddingPlatformProps) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - minimal styling */}
      

      {/* Stats Cards - minimal styling */}
      
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
      

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        
          <div className="bg-white rounded-lg border border-gray-200">
            <OwnerBiddingBoard availableQuotes={availableQuotes} />
          </div>
        

      </div>

      {/* Footer */}
      <div className="text-center py-4 text-xs text-gray-400 border-t border-gray-200">
        <p>© 2024 Bid2Clean. Professional cleaning services you can trust.</p>
      </div>
    </div>
  );
};