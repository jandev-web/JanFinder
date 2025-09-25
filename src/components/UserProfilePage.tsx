import React, { useState } from 'react';
import { useUserProfile } from '../hooks/use-franchise-storage';
import { FranchiseHeader } from '../components/navigation/FranchiseHeader';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Clock,
  Award,
  Users,
  Save,
  Edit,
  Camera,
  Plus,
  X
} from 'lucide-react';
import { useToastSimple } from '../hooks/use-toast-simple';

interface UserProfilePageProps {
  userType: 'owner' | 'member';
  onSwitchView: (view: string) => void;
  onLogout: () => void;
}

export const UserProfilePage: React.FC<UserProfilePageProps> = ({
  userType,
  onSwitchView,
  onLogout,
}) => {
  const { profile, loading, updateProfile } = useUserProfile(userType);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState(profile);
  const [newSkill, setNewSkill] = useState('');
  const [newCertification, setNewCertification] = useState('');
  const showToast = useToastSimple();

  React.useEffect(() => {
    if (profile) {
      setFormData(profile);
    }
  }, [profile]);

  const handleSave = () => {
    if (formData) {
      updateProfile(formData);
      setEditMode(false);
      showToast('Profile updated successfully!', 'success');
    }
  };

  const handleCancel = () => {
    setFormData(profile);
    setEditMode(false);
  };

  const addSkill = () => {
    if (newSkill.trim() && formData && !formData.skills.includes(newSkill.trim())) {
      setFormData({
        ...formData,
        skills: [...formData.skills, newSkill.trim()]
      });
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    if (formData) {
      setFormData({
        ...formData,
        skills: formData.skills.filter(skill => skill !== skillToRemove)
      });
    }
  };

  const addCertification = () => {
    if (newCertification.trim() && formData && !formData.certifications.includes(newCertification.trim())) {
      setFormData({
        ...formData,
        certifications: [...formData.certifications, newCertification.trim()]
      });
      setNewCertification('');
    }
  };

  const removeCertification = (certToRemove: string) => {
    if (formData) {
      setFormData({
        ...formData,
        certifications: formData.certifications.filter(cert => cert !== certToRemove)
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-2 border-gray-300 border-t-blue-600 rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile || !formData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Profile not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Page Actions */}
      <div className="flex items-center justify-end">
        <div className="flex gap-3">
          {editMode ? (
            <>
              <Button onClick={handleCancel} variant="outline">
                Cancel
              </Button>
              <Button onClick={handleSave} className="gap-2">
                <Save className="h-4 w-4" />
                Save Changes
              </Button>
            </>
          ) : (
            <Button onClick={() => setEditMode(true)} className="gap-2">
              <Edit className="h-4 w-4" />
              Edit Profile
            </Button>
          )}
        </div>
      </div>

        {/* Profile Header Card */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
                  {formData.avatar ? (
                    <img src={formData.avatar} alt="Profile" className="w-full h-full object-cover rounded-full" />
                  ) : (
                    <span className="text-3xl font-medium text-gray-700">
                      {formData.firstName[0]}{formData.lastName[0]}
                    </span>
                  )}
                </div>
                {editMode && (
                  <Button
                    size="sm"
                    className="absolute -bottom-1 -right-1 rounded-full w-8 h-8 p-0"
                    variant="outline"
                  >
                    <Camera className="h-3 w-3" />
                  </Button>
                )}
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-semibold text-gray-900">
                  {formData.firstName} {formData.lastName}
                </h2>
                <p className="text-lg text-gray-600">{formData.role}</p>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>Joined {new Date(formData.joinDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>Last login {new Date(formData.lastLogin).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  disabled={!editMode}
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  disabled={!editMode}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  disabled={!editMode}
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  disabled={!editMode}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={formData.bio || ''}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                disabled={!editMode}
                rows={3}
                placeholder="Tell us about yourself..."
              />
            </div>
          </CardContent>
        </Card>

        {/* Address Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Address
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="street">Street Address</Label>
              <Input
                id="street"
                value={formData.address.street}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  address: { ...formData.address, street: e.target.value }
                })}
                disabled={!editMode}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={formData.address.city}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    address: { ...formData.address, city: e.target.value }
                  })}
                  disabled={!editMode}
                />
              </div>
              <div>
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  value={formData.address.state}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    address: { ...formData.address, state: e.target.value }
                  })}
                  disabled={!editMode}
                />
              </div>
              <div>
                <Label htmlFor="zipCode">ZIP Code</Label>
                <Input
                  id="zipCode"
                  value={formData.address.zipCode}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    address: { ...formData.address, zipCode: e.target.value }
                  })}
                  disabled={!editMode}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Skills */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Skills
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {formData.skills.map((skill, index) => (
                <Badge key={index} variant="secondary" className="gap-1">
                  {skill}
                  {editMode && (
                    <button
                      onClick={() => removeSkill(skill)}
                      className="ml-1 hover:text-red-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </Badge>
              ))}
            </div>

            {editMode && (
              <div className="flex gap-2">
                <Input
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="Add a skill..."
                  onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                />
                <Button onClick={addSkill} variant="outline" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add
                </Button>
              </div>
            )}
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
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {formData.certifications.map((cert, index) => (
                <Badge key={index} variant="outline" className="gap-1">
                  {cert}
                  {editMode && (
                    <button
                      onClick={() => removeCertification(cert)}
                      className="ml-1 hover:text-red-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </Badge>
              ))}
            </div>

            {editMode && (
              <div className="flex gap-2">
                <Input
                  value={newCertification}
                  onChange={(e) => setNewCertification(e.target.value)}
                  placeholder="Add a certification..."
                  onKeyPress={(e) => e.key === 'Enter' && addCertification()}
                />
                <Button onClick={addCertification} variant="outline" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Emergency Contact */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Emergency Contact
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="emergencyName">Name</Label>
                <Input
                  id="emergencyName"
                  value={formData.emergencyContact.name}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    emergencyContact: { ...formData.emergencyContact, name: e.target.value }
                  })}
                  disabled={!editMode}
                />
              </div>
              <div>
                <Label htmlFor="emergencyRelationship">Relationship</Label>
                <Input
                  id="emergencyRelationship"
                  value={formData.emergencyContact.relationship}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    emergencyContact: { ...formData.emergencyContact, relationship: e.target.value }
                  })}
                  disabled={!editMode}
                />
              </div>
              <div>
                <Label htmlFor="emergencyPhone">Phone</Label>
                <Input
                  id="emergencyPhone"
                  value={formData.emergencyContact.phone}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    emergencyContact: { ...formData.emergencyContact, phone: e.target.value }
                  })}
                  disabled={!editMode}
                />
              </div>
            </div>
          </CardContent>
        </Card>
    </div>
  );
};