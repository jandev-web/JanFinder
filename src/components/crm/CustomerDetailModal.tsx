import React, { useState } from 'react';
import { Customer, CustomerQuote, CustomerInteraction } from '../../types/customer';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import {
  Phone,
  Mail,
  MapPin,
  Calendar,
  Star,
  DollarSign,
  User,
  Building,
  FileText,
  Trash2,
  Edit,
  MessageSquare,
  TrendingUp,
  Clock,
  Target
} from 'lucide-react';

interface CustomerDetailModalProps {
  customer: Customer | null;
  quotes: CustomerQuote[];
  interactions: CustomerInteraction[];
  open: boolean;
  onClose: () => void;
  onEdit: (customer: Customer) => void;
  onDelete: (customer: Customer) => void;
}

export const CustomerDetailModal: React.FC<CustomerDetailModalProps> = ({
  customer,
  quotes,
  interactions,
  open,
  onClose,
  onEdit,
  onDelete,
}) => {
  if (!customer) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'prospect':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'inactive':
        return 'bg-gray-50 text-gray-700 border-gray-200';
      case 'churned':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getQuoteStatusColor = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'bg-green-50 text-green-700';
      case 'sent':
        return 'bg-blue-50 text-blue-700';
      case 'draft':
        return 'bg-yellow-50 text-yellow-700';
      case 'rejected':
        return 'bg-red-50 text-red-700';
      case 'expired':
        return 'bg-gray-50 text-gray-700';
      default:
        return 'bg-gray-50 text-gray-700';
    }
  };

  const getInteractionOutcomeColor = (outcome: string) => {
    switch (outcome) {
      case 'positive':
        return 'bg-green-50 text-green-700';
      case 'neutral':
        return 'bg-gray-50 text-gray-700';
      case 'negative':
        return 'bg-red-50 text-red-700';
      case 'follow-up-needed':
        return 'bg-yellow-50 text-yellow-700';
      default:
        return 'bg-gray-50 text-gray-700';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                <span className="text-2xl font-medium text-gray-700">
                  {customer.firstName[0]}{customer.lastName[0]}
                </span>
              </div>
              <div>
                <DialogTitle className="text-2xl">
                  {customer.firstName} {customer.lastName}
                </DialogTitle>
                <DialogDescription className="text-lg">
                  {customer.company && (
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4" />
                      <span>{customer.company}</span>
                    </div>
                  )}
                </DialogDescription>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <div className={`px-3 py-1 rounded text-sm font-medium border ${getStatusColor(customer.status)}`}>
                {customer.status}
              </div>
              <div className="text-sm text-gray-600">
                Source: {customer.source}
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button onClick={() => onEdit(customer)} className="gap-2">
              <Edit className="h-4 w-4" />
              Edit Customer
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => onDelete(customer)}
              className="gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Delete Customer
            </Button>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <DollarSign className="h-5 w-5 text-gray-600" />
                  <span className="text-xl font-semibold text-gray-900">
                    ${customer.totalSpent.toLocaleString()}
                  </span>
                </div>
                <p className="text-sm text-gray-600">Total Spent</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <TrendingUp className="h-5 w-5 text-gray-600" />
                  <span className="text-xl font-semibold text-gray-900">
                    ${customer.lifetime_value.toLocaleString()}
                  </span>
                </div>
                <p className="text-sm text-gray-600">Lifetime Value</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Target className="h-5 w-5 text-gray-600" />
                  <span className="text-xl font-semibold text-gray-900 capitalize">
                    {customer.priority}
                  </span>
                </div>
                <p className="text-sm text-gray-600">Priority Level</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <FileText className="h-5 w-5 text-gray-600" />
                  <span className="text-xl font-semibold text-gray-900">
                    {quotes.length}
                  </span>
                </div>
                <p className="text-sm text-gray-600">Total Quotes</p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="quotes">Quotes ({quotes.length})</TabsTrigger>
              <TabsTrigger value="interactions">Interactions ({interactions.length})</TabsTrigger>
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-6">
              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Personal Details</h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="h-4 w-4 text-gray-500" />
                          <span>{customer.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="h-4 w-4 text-gray-500" />
                          <span>{customer.phone}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <span>Created {new Date(customer.createdDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="h-4 w-4 text-gray-500" />
                          <span>Last contact {new Date(customer.lastContact).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Address</h4>
                      <div className="flex items-start gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                        <div>
                          <p>{customer.address.street}</p>
                          <p>{customer.address.city}, {customer.address.state} {customer.address.zipCode}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Tags */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {customer.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Notes */}
                  {customer.notes && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Notes</h4>
                      <p className="text-gray-700 text-sm">{customer.notes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="quotes">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Customer Quotes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {quotes.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Service Type</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Created</TableHead>
                          <TableHead>Valid Until</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {quotes.map((quote) => (
                          <TableRow key={quote.id}>
                            <TableCell className="font-medium">{quote.serviceType}</TableCell>
                            <TableCell>${quote.amount.toLocaleString()}</TableCell>
                            <TableCell>
                              <div className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getQuoteStatusColor(quote.status)}`}>
                                {quote.status}
                              </div>
                            </TableCell>
                            <TableCell>{new Date(quote.createdDate).toLocaleDateString()}</TableCell>
                            <TableCell>{new Date(quote.validUntil).toLocaleDateString()}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <p className="text-gray-500 text-center py-8">No quotes available</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="interactions">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Customer Interactions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {interactions.length > 0 ? (
                    <div className="space-y-4">
                      {interactions.map((interaction) => (
                        <div key={interaction.id} className="border rounded-lg p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h4 className="font-medium text-gray-900">{interaction.subject}</h4>
                              <p className="text-sm text-gray-600 capitalize">{interaction.type}</p>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                              <div className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getInteractionOutcomeColor(interaction.outcome)}`}>
                                {interaction.outcome.replace('-', ' ')}
                              </div>
                              <span className="text-xs text-gray-500">
                                {new Date(interaction.date).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          <p className="text-sm text-gray-700">{interaction.description}</p>
                          {interaction.duration && (
                            <p className="text-xs text-gray-500 mt-2">Duration: {interaction.duration} minutes</p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-8">No interactions recorded</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="preferences">
              <Card>
                <CardHeader>
                  <CardTitle>Customer Preferences</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Contact Method</h4>
                      <p className="text-sm text-gray-700 capitalize">{customer.preferences.contactMethod}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Contact Frequency</h4>
                      <p className="text-sm text-gray-700 capitalize">{customer.preferences.frequency}</p>
                    </div>
                  </div>
                  {customer.nextFollowUp && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Next Follow-up</h4>
                      <p className="text-sm text-gray-700">{new Date(customer.nextFollowUp).toLocaleDateString()}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};