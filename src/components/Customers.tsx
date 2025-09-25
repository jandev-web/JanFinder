import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCustomersStorage } from '@/hooks/use-customers-storage';
import { useMembersStorage } from '@/hooks/use-members-storage';
import { Eye, DollarSign, FileText, User, MapPin, Calendar, Tag } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CustomersProps {
  onSwitchView: (view: string) => void;
  onLogout: () => void;
}

export function Customers({ onSwitchView, onLogout }: CustomersProps) {
  const { quotes, customers, addQuote } = useCustomersStorage();
  const { members } = useMembersStorage();
  const { toast } = useToast();
  const [selectedQuote, setSelectedQuote] = useState<any>(null);
  const [selectedContract, setSelectedContract] = useState<any>(null);
  const [showSellDialog, setShowSellDialog] = useState(false);
  const [selectedMember, setSelectedMember] = useState<string>('');

  // Split quotes into pending quotes and contracts (sold quotes)
  const pendingQuotes = quotes.filter(quote => 
    quote.status === 'draft' || quote.status === 'sent'
  );
  
  const contracts = quotes.filter(quote => 
    quote.status === 'accepted'
  );

  const getCustomerName = (customerId: string) => {
    const customer = customers.find(c => c.id === customerId);
    return customer ? `${customer.firstName} ${customer.lastName}` : 'Unknown Customer';
  };

  const getCustomerInfo = (customerId: string) => {
    return customers.find(c => c.id === customerId);
  };

  const getMemberName = (memberId: string) => {
    const member = members.find(m => m.id === memberId);
    return member ? `${member.firstName} ${member.lastName}` : 'Unassigned';
  };

  const handleSellQuote = () => {
    if (!selectedQuote || !selectedMember) {
      toast({
        title: "Error",
        description: "Please select a member to assign the quote to.",
        variant: "destructive"
      });
      return;
    }

    // Update the quote to accepted status and assign to member
    const updatedQuote = {
      ...selectedQuote,
      status: 'accepted' as const,
      assignedMember: selectedMember,
    };

    // Simulate updating the quote
    addQuote({
      ...updatedQuote,
      id: undefined as any, // Will be overwritten
    });

    toast({
      title: "Quote Sold!",
      description: `Quote successfully assigned to ${getMemberName(selectedMember)}.`,
    });

    setShowSellDialog(false);
    setSelectedQuote(null);
    setSelectedMember('');
  };

  const QuoteCard = ({ quote, type }: { quote: any; type: 'quote' | 'contract' }) => {
    const customer = getCustomerInfo(quote.customerId);
    
    return (
      <Card className="hover:shadow-lg transition-all duration-200 border-border/50">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg font-semibold text-foreground truncate">
                {quote.serviceType}
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1 truncate">
                {getCustomerName(quote.customerId)}
              </p>
            </div>
            <div className="text-right ml-4">
              <div className="text-xl font-bold text-primary">
                ${quote.amount.toLocaleString()}
              </div>
              <Badge variant={
                quote.status === 'accepted' ? 'default' : 
                quote.status === 'sent' ? 'secondary' : 'outline'
              } className="mt-1">
                {quote.status}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-2 text-sm text-muted-foreground mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">Created: {new Date(quote.createdDate).toLocaleDateString()}</span>
            </div>
            {customer && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">{customer.address?.city}, {customer.address?.state}</span>
              </div>
            )}
            {quote.assignedMember && (
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">Assigned: {getMemberName(quote.assignedMember)}</span>
              </div>
            )}
          </div>
          
          <div className="flex flex-col gap-2">
            <Sheet>
              <SheetTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => type === 'quote' ? setSelectedQuote(quote) : setSelectedContract(quote)}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </Button>
              </SheetTrigger>
              <SheetContent className="w-[400px] sm:w-[540px]">
                <SheetHeader>
                  <SheetTitle className="text-xl">{quote.serviceType}</SheetTitle>
                </SheetHeader>
                <div className="space-y-6 mt-6">
                  <div>
                    <h4 className="font-semibold mb-3 text-base">Customer Information</h4>
                    <div className="space-y-2 text-sm bg-muted/50 p-4 rounded-lg">
                      <p><strong>Name:</strong> {getCustomerName(quote.customerId)}</p>
                      {customer && (
                        <>
                          <p><strong>Email:</strong> {customer.email}</p>
                          <p><strong>Phone:</strong> {customer.phone}</p>
                          <p><strong>Company:</strong> {customer.company || 'N/A'}</p>
                          <p><strong>Address:</strong> {customer.address?.street}, {customer.address?.city}, {customer.address?.state} {customer.address?.zipCode}</p>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-3 text-base">Quote Details</h4>
                    <div className="space-y-2 text-sm bg-muted/50 p-4 rounded-lg">
                      <p><strong>Service:</strong> {quote.serviceType}</p>
                      <p><strong>Amount:</strong> <span className="text-lg font-semibold text-primary">${quote.amount.toLocaleString()}</span></p>
                      <p><strong>Status:</strong> <Badge variant="outline">{quote.status}</Badge></p>
                      <p><strong>Created:</strong> {new Date(quote.createdDate).toLocaleDateString()}</p>
                      <p><strong>Valid Until:</strong> {new Date(quote.validUntil).toLocaleDateString()}</p>
                      {quote.assignedMember && (
                        <p><strong>Assigned Member:</strong> {getMemberName(quote.assignedMember)}</p>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-3 text-base">Description</h4>
                    <div className="text-sm text-muted-foreground bg-muted/50 p-4 rounded-lg">
                      {quote.description}
                    </div>
                  </div>

                  {type === 'quote' && (
                    <div className="pt-4 border-t">
                      <Button 
                        className="w-full"
                        onClick={() => {
                          setSelectedQuote(quote);
                          setShowSellDialog(true);
                        }}
                      >
                        <DollarSign className="h-4 w-4 mr-2" />
                        Sell Quote to Member
                      </Button>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
            
            {type === 'quote' && (
              <Button 
                size="sm" 
                className="w-full justify-start"
                onClick={() => {
                  setSelectedQuote(quote);
                  setShowSellDialog(true);
                }}
              >
                <DollarSign className="h-4 w-4 mr-2" />
                Sell Quote
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Customer Orders</h1>
            <p className="text-muted-foreground mt-1">
              Manage quotes and contracts for your customers
            </p>
          </div>
          <div className="flex gap-4 text-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{pendingQuotes.length}</div>
              <div className="text-muted-foreground">Pending Quotes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{contracts.length}</div>
              <div className="text-muted-foreground">Active Contracts</div>
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="quotes" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="quotes" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Quotes ({pendingQuotes.length})
          </TabsTrigger>
          <TabsTrigger value="contracts" className="flex items-center gap-2">
            <Tag className="h-4 w-4" />
            Contracts ({contracts.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="quotes" className="space-y-4">
          {pendingQuotes.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No pending quotes</h3>
                  <p className="text-muted-foreground">
                    All quotes have been processed or you haven't created any yet.
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {pendingQuotes.map((quote) => (
                <QuoteCard key={quote.id} quote={quote} type="quote" />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="contracts" className="space-y-4">
          {contracts.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <Tag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No active contracts</h3>
                  <p className="text-muted-foreground">
                    Sell some quotes to members to see active contracts here.
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {contracts.map((contract) => (
                <QuoteCard key={contract.id} quote={contract} type="contract" />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Sell Quote Dialog - Outside of all other components to avoid conflicts */}
      <Dialog open={showSellDialog} onOpenChange={setShowSellDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sell Quote to Member</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <h4 className="font-semibold mb-2">Quote Details</h4>
              <div className="bg-muted p-3 rounded-lg">
                <p><strong>Service:</strong> {selectedQuote?.serviceType}</p>
                <p><strong>Customer:</strong> {selectedQuote && getCustomerName(selectedQuote.customerId)}</p>
                <p><strong>Amount:</strong> ${selectedQuote?.amount.toLocaleString()}</p>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium">Select Member</label>
              <Select value={selectedMember} onValueChange={setSelectedMember}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Choose a member to assign this quote to" />
                </SelectTrigger>
                <SelectContent>
                  {members.map((member) => (
                    <SelectItem key={member.id} value={member.id}>
                      {member.firstName} {member.lastName} - {member.role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex gap-2 pt-4">
              <Button 
                onClick={handleSellQuote}
                disabled={!selectedMember}
                className="flex-1"
              >
                Confirm Sale
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowSellDialog(false);
                  setSelectedMember('');
                }}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}