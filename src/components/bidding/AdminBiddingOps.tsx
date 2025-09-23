import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { useBiddingStore } from '../../state/bidding.store';
import { BiddingPolicy } from './types';
import { useToast } from '../../hooks/use-toast';
import { Settings, Users, DollarSign, TrendingUp, Award, Plus } from 'lucide-react';

export const AdminBiddingOps: React.FC = () => {
  const { toast } = useToast();
  const { policy, providers, updatePolicy, grantCredits } = useBiddingStore();
  
  const [policyForm, setPolicyForm] = useState<BiddingPolicy>(policy);
  const [selectedProvider, setSelectedProvider] = useState<string>('');
  const [creditsToGrant, setCreditsToGrant] = useState<string>('');

  const handlePolicyUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await updatePolicy(policyForm);
      toast({
        title: "Policy Updated",
        description: "Bidding policy has been successfully updated.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update policy. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleGrantCredits = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedProvider || !creditsToGrant) {
      toast({
        title: "Error",
        description: "Please select a provider and enter credits amount.",
        variant: "destructive"
      });
      return;
    }

    const credits = parseInt(creditsToGrant);
    if (isNaN(credits) || credits <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid credits amount.",
        variant: "destructive"
      });
      return;
    }

    try {
      await grantCredits(selectedProvider, credits);
      setSelectedProvider('');
      setCreditsToGrant('');
      
      toast({
        title: "Credits Granted",
        description: `Successfully granted ${credits} credits.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to grant credits. Please try again.",
        variant: "destructive"
      });
    }
  };

  const getHealthStatus = (provider: typeof providers[0]) => {
    if (provider.winRate >= 0.8 && provider.reputationScore >= 90) return 'excellent';
    if (provider.winRate >= 0.6 && provider.reputationScore >= 80) return 'good';
    if (provider.winRate >= 0.4 && provider.reputationScore >= 70) return 'fair';
    return 'poor';
  };

  const getHealthBadge = (status: string) => {
    switch (status) {
      case 'excellent': return <Badge variant="default">Excellent</Badge>;
      case 'good': return <Badge variant="secondary">Good</Badge>;
      case 'fair': return <Badge variant="outline">Fair</Badge>;
      case 'poor': return <Badge variant="destructive">Poor</Badge>;
      default: return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Bidding Operations</h1>
        <p className="text-gray-500">
          Manage bidding policies and provider health
        </p>
      </div>

      <Tabs defaultValue="policy" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="policy">Bidding Policy</TabsTrigger>
          <TabsTrigger value="providers">Provider Health</TabsTrigger>
          <TabsTrigger value="credits">Credit Management</TabsTrigger>
        </TabsList>

        {/* Bidding Policy Tab */}
        <TabsContent value="policy">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Bidding Policy Configuration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePolicyUpdate} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="minPct">Minimum Percentage</Label>
                    <Input
                      id="minPct"
                      type="number"
                      step="0.01"
                      min="0"
                      max="1"
                      value={policyForm.minPct}
                      onChange={(e) => setPolicyForm({
                        ...policyForm,
                        minPct: parseFloat(e.target.value) || 0
                      })}
                    />
                    <p className="text-xs text-gray-500">
                      Currently: {Math.round(policyForm.minPct * 100)}% of baseline
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="maxPct">Maximum Percentage</Label>
                    <Input
                      id="maxPct"
                      type="number"
                      step="0.01"
                      min="0"
                      max="2"
                      value={policyForm.maxPct}
                      onChange={(e) => setPolicyForm({
                        ...policyForm,
                        maxPct: parseFloat(e.target.value) || 0
                      })}
                    />
                    <p className="text-xs text-gray-500">
                      Currently: {Math.round(policyForm.maxPct * 100)}% of baseline
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="floorPct">Floor Hard Stop Percentage</Label>
                    <Input
                      id="floorPct"
                      type="number"
                      step="0.01"
                      min="0"
                      max="1"
                      value={policyForm.floorHardStopPct}
                      onChange={(e) => setPolicyForm({
                        ...policyForm,
                        floorHardStopPct: parseFloat(e.target.value) || 0
                      })}
                    />
                    <p className="text-xs text-gray-500">
                      Currently: {Math.round(policyForm.floorHardStopPct * 100)}% of baseline
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="windowMins">Default Window (Minutes)</Label>
                    <Input
                      id="windowMins"
                      type="number"
                      min="1"
                      value={policyForm.defaultWindowMins}
                      onChange={(e) => setPolicyForm({
                        ...policyForm,
                        defaultWindowMins: parseInt(e.target.value) || 0
                      })}
                    />
                    <p className="text-xs text-gray-500">
                      Currently: {Math.round(policyForm.defaultWindowMins / 60)} hours
                    </p>
                  </div>
                </div>

                <Button type="submit" className="w-full">
                  Update Bidding Policy
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Provider Health Tab */}
        <TabsContent value="providers">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Provider Health Dashboard
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Provider</TableHead>
                    <TableHead>Reputation</TableHead>
                    <TableHead>Win Rate</TableHead>
                    <TableHead>Credits</TableHead>
                    <TableHead>Health Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {providers.map((provider) => (
                    <TableRow key={provider.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{provider.name}</div>
                          <div className="text-sm text-gray-500">{provider.region}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{provider.reputationScore}</span>
                          <span className="text-xs text-gray-500">
                            ({provider.rating}★, {provider.reviewCount} reviews)
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">
                          {Math.round(provider.winRate * 100)}%
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant={provider.credits <= 5 ? "destructive" : "outline"}>
                          {provider.credits}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {getHealthBadge(getHealthStatus(provider))}
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setSelectedProvider(provider.id)}
                        >
                          Manage
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Credit Management Tab */}
        <TabsContent value="credits">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Grant Credits */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Grant Credits
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleGrantCredits} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="provider-select">Select Provider</Label>
                    <select
                      id="provider-select"
                      value={selectedProvider}
                      onChange={(e) => setSelectedProvider(e.target.value)}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      <option value="">Choose a provider...</option>
                      {providers.map((provider) => (
                        <option key={provider.id} value={provider.id}>
                          {provider.name} (Current: {provider.credits} credits)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="credits-amount">Credits to Grant</Label>
                    <Input
                      id="credits-amount"
                      type="number"
                      min="1"
                      value={creditsToGrant}
                      onChange={(e) => setCreditsToGrant(e.target.value)}
                      placeholder="Enter amount"
                    />
                  </div>

                  <Button type="submit" className="w-full">
                    Grant Credits
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Credit Statistics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Credit Statistics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="p-4 bg-gray-100 rounded-lg">
                    <div className="text-2xl font-bold">
                      {providers.reduce((sum, p) => sum + p.credits, 0)}
                    </div>
                    <div className="text-sm text-gray-500">Total Credits</div>
                  </div>
                  
                  <div className="p-4 bg-gray-100 rounded-lg">
                    <div className="text-2xl font-bold">
                      {Math.round(providers.reduce((sum, p) => sum + p.credits, 0) / providers.length)}
                    </div>
                    <div className="text-sm text-gray-500">Avg per Provider</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">Low Credit Providers</h4>
                  {providers
                    .filter(p => p.credits <= 5)
                    .map(provider => (
                      <div key={provider.id} className="flex items-center justify-between text-sm">
                        <span>{provider.name}</span>
                        <Badge variant="destructive">{provider.credits} credits</Badge>
                      </div>
                    ))
                  }
                  {providers.filter(p => p.credits <= 5).length === 0 && (
                    <p className="text-sm text-gray-500">All providers have sufficient credits</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};