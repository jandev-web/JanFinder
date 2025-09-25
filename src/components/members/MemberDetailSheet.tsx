import React from 'react';
import { Member, MemberQuote } from '../../types/member';
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
import {
  Phone,
  Mail,
  MapPin,
  Calendar,
  Star,
  DollarSign,
  User,
  Award,
  FileText,
  Trash2,
  Edit,
  Users
} from 'lucide-react';

interface MemberDetailSheetProps {
  member: Member | null;
  quotes: MemberQuote[];
  open: boolean;
  onClose: () => void;
  onEdit: (member: Member) => void;
  onDelete: (member: Member) => void;
}

export const MemberDetailSheet: React.FC<MemberDetailSheetProps> = ({
  member,
  quotes,
  open,
  onClose,
  onEdit,
  onDelete,
}) => {
  if (!member) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'inactive':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'pending':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getQuoteStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-50 text-green-700';
      case 'in-progress':
        return 'bg-blue-50 text-blue-700';
      case 'pending':
        return 'bg-yellow-50 text-yellow-700';
      case 'cancelled':
        return 'bg-red-50 text-red-700';
      default:
        return 'bg-gray-50 text-gray-700';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                <span className="text-2xl font-medium text-gray-700">
                  {member.firstName[0]}{member.lastName[0]}
                </span>
              </div>
              <div>
                <DialogTitle className="text-2xl">
                  {member.firstName} {member.lastName}
                </DialogTitle>
                <DialogDescription className="text-lg">
                  {member.role} • {member.territory}
                </DialogDescription>
              </div>
            </div>
            <div className={`px-3 py-1 rounded text-sm font-medium border ${getStatusColor(member.status)}`}>
              {member.status}
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button onClick={() => onEdit(member)} className="gap-2">
              <Edit className="h-4 w-4" />
              Edit Member
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => onDelete(member)}
              className="gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Delete Member
            </Button>
          </div>

          {/* Performance Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <DollarSign className="h-5 w-5 text-gray-600" />
                  <span className="text-xl font-semibold text-gray-900">
                    ${member.totalRevenue.toLocaleString()}
                  </span>
                </div>
                <p className="text-sm text-gray-600">Total Revenue</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <DollarSign className="h-5 w-5 text-gray-600" />
                  <span className="text-xl font-semibold text-gray-900">
                    ${member.monthlyRevenue.toLocaleString()}
                  </span>
                </div>
                <p className="text-sm text-gray-600">Monthly Revenue</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  <span className="text-xl font-semibold text-gray-900">
                    {member.customerRating.toFixed(1)}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{member.reviewCount} Reviews</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <FileText className="h-5 w-5 text-gray-600" />
                  <span className="text-xl font-semibold text-gray-900">
                    {member.quotesCompleted}/{member.quotesAssigned}
                  </span>
                </div>
                <p className="text-sm text-gray-600">Quotes Completed</p>
              </CardContent>
            </Card>
          </div>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Personal Details</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <span>{member.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <span>{member.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span>Joined {new Date(member.joinDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Address</h4>
                  <div className="flex items-start gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                    <div>
                      <p>{member.address.street}</p>
                      <p>{member.address.city}, {member.address.state} {member.address.zipCode}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-3">Emergency Contact</h4>
                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4 text-gray-500" />
                  <span>
                    {member.emergencyContact.name} ({member.emergencyContact.relationship}) - {member.emergencyContact.phone}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Certifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Certifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {member.certifications.map((cert, index) => (
                  <Badge key={index} variant="secondary">
                    {cert}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Quotes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Recent Quotes ({quotes.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {quotes.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Customer</TableHead>
                      <TableHead>Service</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {quotes.map((quote) => (
                      <TableRow key={quote.id}>
                        <TableCell className="font-medium">{quote.customerName}</TableCell>
                        <TableCell>{quote.serviceType}</TableCell>
                        <TableCell>${quote.amount.toLocaleString()}</TableCell>
                        <TableCell>
                          <div className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getQuoteStatusColor(quote.status)}`}>
                            {quote.status}
                          </div>
                        </TableCell>
                        <TableCell>{new Date(quote.assignedDate).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-gray-500 text-center py-8">No quotes assigned yet</p>
              )}
            </CardContent>
          </Card>

          {/* Notes */}
          {member.notes && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Notes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">{member.notes}</p>
              </CardContent>
            </Card>
          )}
         </div>
      </DialogContent>
    </Dialog>
  );
};