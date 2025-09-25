import React from 'react';
import { Customer } from '../../types/customer';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import {
  Phone,
  Mail,
  MapPin,
  Calendar,
  DollarSign,
  Building,
  User,
  Eye,
  Trash2,
  TrendingUp
} from 'lucide-react';

interface CustomerCardProps {
  customer: Customer;
  onViewDetails: (customer: Customer) => void;
  onDelete: (customer: Customer) => void;
}

export const CustomerCard: React.FC<CustomerCardProps> = ({
  customer,
  onViewDetails,
  onDelete,
}) => {
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-50 text-red-700';
      case 'medium':
        return 'bg-yellow-50 text-yellow-700';
      case 'low':
        return 'bg-green-50 text-green-700';
      default:
        return 'bg-gray-50 text-gray-700';
    }
  };

  return (
    <Card className="hover:shadow-md transition-all duration-200 border border-gray-200 group">
      <CardContent className="p-5">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                <span className="text-lg font-medium text-gray-700">
                  {customer.firstName[0]}{customer.lastName[0]}
                </span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  {customer.firstName} {customer.lastName}
                </h3>
                {customer.company && (
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <Building className="h-3 w-3" />
                    <span>{customer.company}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <div className={`px-2 py-1 rounded text-xs font-medium border ${getStatusColor(customer.status)}`}>
                {customer.status}
              </div>
              <div className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(customer.priority)}`}>
                {customer.priority} priority
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Mail className="h-4 w-4" />
              <span className="truncate">{customer.email}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Phone className="h-4 w-4" />
              <span>{customer.phone}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="h-4 w-4" />
              <span className="truncate">{customer.address.city}, {customer.address.state}</span>
            </div>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-100">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <DollarSign className="h-4 w-4 text-gray-500" />
                <span className="text-lg font-semibold text-gray-900">
                  ${customer.totalSpent.toLocaleString()}
                </span>
              </div>
              <p className="text-xs text-gray-600">Total Spent</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <TrendingUp className="h-4 w-4 text-gray-500" />
                <span className="text-lg font-semibold text-gray-900">
                  ${customer.lifetime_value.toLocaleString()}
                </span>
              </div>
              <p className="text-xs text-gray-600">Lifetime Value</p>
            </div>
          </div>

          {/* Tags */}
          {customer.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {customer.tags.slice(0, 3).map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {customer.tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{customer.tags.length - 3} more
                </Badge>
              )}
            </div>
          )}

          {/* Last Contact */}
          <div className="flex items-center gap-2 text-xs text-gray-500 pt-2 border-t border-gray-100">
            <Calendar className="h-3 w-3" />
            <span>Last contact: {new Date(customer.lastContact).toLocaleDateString()}</span>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-3">
            <Button
              onClick={() => onViewDetails(customer)}
              className="flex-1 gap-2 h-8 text-sm"
              variant="outline"
            >
              <Eye className="h-4 w-4" />
              View Details
            </Button>
            <Button
              onClick={() => onDelete(customer)}
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};