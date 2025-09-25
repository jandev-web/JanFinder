import React, { useState, useEffect } from 'react';
import { Member, MemberFormData } from '../../types/member';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { User, MapPin, Phone, Award, FileText } from 'lucide-react';

interface AddMemberFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: MemberFormData) => void;
  editingMember?: Member | null;
}

const initialFormData: MemberFormData = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  role: '',
  territory: '',
  street: '',
  city: '',
  state: '',
  zipCode: '',
  emergencyContactName: '',
  emergencyContactPhone: '',
  emergencyContactRelationship: '',
  certifications: '',
  notes: '',
};

export const AddMemberForm: React.FC<AddMemberFormProps> = ({
  open,
  onClose,
  onSubmit,
  editingMember,
}) => {
  const [formData, setFormData] = useState<MemberFormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (editingMember) {
      setFormData({
        firstName: editingMember.firstName,
        lastName: editingMember.lastName,
        email: editingMember.email,
        phone: editingMember.phone,
        role: editingMember.role,
        territory: editingMember.territory,
        street: editingMember.address.street,
        city: editingMember.address.city,
        state: editingMember.address.state,
        zipCode: editingMember.address.zipCode,
        emergencyContactName: editingMember.emergencyContact.name,
        emergencyContactPhone: editingMember.emergencyContact.phone,
        emergencyContactRelationship: editingMember.emergencyContact.relationship,
        certifications: editingMember.certifications.join(', '),
        notes: editingMember.notes,
      });
    } else {
      setFormData(initialFormData);
    }
    setErrors({});
  }, [editingMember, open]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    if (!formData.role.trim()) newErrors.role = 'Role is required';
    if (!formData.territory.trim()) newErrors.territory = 'Territory is required';
    if (!formData.street.trim()) newErrors.street = 'Street address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.zipCode.trim()) newErrors.zipCode = 'ZIP code is required';
    if (!formData.emergencyContactName.trim()) newErrors.emergencyContactName = 'Emergency contact name is required';
    if (!formData.emergencyContactPhone.trim()) newErrors.emergencyContactPhone = 'Emergency contact phone is required';
    if (!formData.emergencyContactRelationship.trim()) newErrors.emergencyContactRelationship = 'Emergency contact relationship is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
      onClose();
    }
  };

  const handleInputChange = (field: keyof MemberFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingMember ? 'Edit Member' : 'Add New Member'}
          </DialogTitle>
          <DialogDescription>
            {editingMember 
              ? 'Update the member information below.'
              : 'Fill in the information for the new team member.'
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <User className="h-5 w-5" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className={errors.firstName ? 'border-red-500' : ''}
                />
                {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
              </div>

              <div>
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className={errors.lastName ? 'border-red-500' : ''}
                />
                {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
              </div>

              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={errors.email ? 'border-red-500' : ''}
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>

              <div>
                <Label htmlFor="phone">Phone *</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className={errors.phone ? 'border-red-500' : ''}
                />
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
              </div>

              <div>
                <Label htmlFor="role">Role *</Label>
                <Input
                  id="role"
                  value={formData.role}
                  onChange={(e) => handleInputChange('role', e.target.value)}
                  placeholder="e.g., Senior Cleaner, Team Lead"
                  className={errors.role ? 'border-red-500' : ''}
                />
                {errors.role && <p className="text-red-500 text-sm mt-1">{errors.role}</p>}
              </div>

              <div>
                <Label htmlFor="territory">Territory *</Label>
                <Input
                  id="territory"
                  value={formData.territory}
                  onChange={(e) => handleInputChange('territory', e.target.value)}
                  placeholder="e.g., Downtown District, Medical District"
                  className={errors.territory ? 'border-red-500' : ''}
                />
                {errors.territory && <p className="text-red-500 text-sm mt-1">{errors.territory}</p>}
              </div>
            </CardContent>
          </Card>

          {/* Address Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <MapPin className="h-5 w-5" />
                Address Information
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="street">Street Address *</Label>
                <Input
                  id="street"
                  value={formData.street}
                  onChange={(e) => handleInputChange('street', e.target.value)}
                  className={errors.street ? 'border-red-500' : ''}
                />
                {errors.street && <p className="text-red-500 text-sm mt-1">{errors.street}</p>}
              </div>

              <div>
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  className={errors.city ? 'border-red-500' : ''}
                />
                {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
              </div>

              <div>
                <Label htmlFor="state">State *</Label>
                <Input
                  id="state"
                  value={formData.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                  className={errors.state ? 'border-red-500' : ''}
                />
                {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
              </div>

              <div>
                <Label htmlFor="zipCode">ZIP Code *</Label>
                <Input
                  id="zipCode"
                  value={formData.zipCode}
                  onChange={(e) => handleInputChange('zipCode', e.target.value)}
                  className={errors.zipCode ? 'border-red-500' : ''}
                />
                {errors.zipCode && <p className="text-red-500 text-sm mt-1">{errors.zipCode}</p>}
              </div>
            </CardContent>
          </Card>

          {/* Emergency Contact */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Phone className="h-5 w-5" />
                Emergency Contact
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="emergencyContactName">Name *</Label>
                <Input
                  id="emergencyContactName"
                  value={formData.emergencyContactName}
                  onChange={(e) => handleInputChange('emergencyContactName', e.target.value)}
                  className={errors.emergencyContactName ? 'border-red-500' : ''}
                />
                {errors.emergencyContactName && <p className="text-red-500 text-sm mt-1">{errors.emergencyContactName}</p>}
              </div>

              <div>
                <Label htmlFor="emergencyContactPhone">Phone *</Label>
                <Input
                  id="emergencyContactPhone"
                  value={formData.emergencyContactPhone}
                  onChange={(e) => handleInputChange('emergencyContactPhone', e.target.value)}
                  className={errors.emergencyContactPhone ? 'border-red-500' : ''}
                />
                {errors.emergencyContactPhone && <p className="text-red-500 text-sm mt-1">{errors.emergencyContactPhone}</p>}
              </div>

              <div>
                <Label htmlFor="emergencyContactRelationship">Relationship *</Label>
                <Input
                  id="emergencyContactRelationship"
                  value={formData.emergencyContactRelationship}
                  onChange={(e) => handleInputChange('emergencyContactRelationship', e.target.value)}
                  placeholder="e.g., Spouse, Parent, Sibling"
                  className={errors.emergencyContactRelationship ? 'border-red-500' : ''}
                />
                {errors.emergencyContactRelationship && <p className="text-red-500 text-sm mt-1">{errors.emergencyContactRelationship}</p>}
              </div>
            </CardContent>
          </Card>

          {/* Additional Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Award className="h-5 w-5" />
                Additional Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="certifications">Certifications</Label>
                <Input
                  id="certifications"
                  value={formData.certifications}
                  onChange={(e) => handleInputChange('certifications', e.target.value)}
                  placeholder="Separate multiple certifications with commas"
                />
              </div>

              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  placeholder="Any additional notes about this member"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {editingMember ? 'Update Member' : 'Add Member'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};