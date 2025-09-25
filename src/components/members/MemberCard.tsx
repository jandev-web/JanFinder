import React from 'react';
import { Member } from '../../types/member';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Star, 
  DollarSign,
  Calendar,
  Trash2,
  Eye
} from 'lucide-react';

interface MemberCardProps {
  member: Member;
  onViewDetails: (member: Member) => void;
  onDelete: (member: Member) => void;
}

export const MemberCard: React.FC<MemberCardProps> = ({
  member,
  onViewDetails,
  onDelete,
}) => {
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

  return (
    <Card className="hover:shadow-md transition-shadow duration-200 border border-gray-200">
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
              <span className="text-lg font-medium text-gray-700">
                {member.firstName[0]}{member.lastName[0]}
              </span>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">
                {member.firstName} {member.lastName}
              </h3>
              <p className="text-sm text-gray-600">{member.role}</p>
            </div>
          </div>
          <div className={`px-2 py-1 rounded text-xs font-medium border ${getStatusColor(member.status)}`}>
            {member.status}
          </div>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Mail className="h-4 w-4" />
            <span>{member.email}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Phone className="h-4 w-4" />
            <span>{member.phone}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="h-4 w-4" />
            <span>{member.territory}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="h-4 w-4" />
            <span>Joined {new Date(member.joinDate).toLocaleDateString()}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-center gap-1 mb-1">
              <DollarSign className="h-4 w-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-900">
                ${member.monthlyRevenue.toLocaleString()}
              </span>
            </div>
            <p className="text-xs text-gray-600">Monthly Revenue</p>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Star className="h-4 w-4 text-yellow-500" />
              <span className="text-sm font-medium text-gray-900">
                {member.customerRating.toFixed(1)}
              </span>
            </div>
            <p className="text-xs text-gray-600">Rating ({member.reviewCount})</p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewDetails(member)}
            className="flex-1 gap-2"
          >
            <Eye className="h-4 w-4" />
            View Details
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(member)}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};