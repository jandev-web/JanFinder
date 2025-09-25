import React, { useState } from 'react';
import { useFranchiseStorage } from '../hooks/use-franchise-storage';
import { FranchiseHeader } from '../components/navigation/FranchiseHeader';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';
import {
  Building,
  MapPin,
  Phone,
  Mail,
  Globe,
  Clock,
  FileText,
  Upload,
  Download,
  Trash2,
  Save,
  Facebook,
  Instagram,
  Linkedin,
  Camera,
  Eye,
  Edit
} from 'lucide-react';
import { useToastSimple } from '../hooks/use-toast-simple';

interface FranchiseInfoProps {
  userType: 'owner' | 'member';
  onSwitchView: (view: string) => void;
  onLogout: () => void;
}

export const FranchiseInfo: React.FC<FranchiseInfoProps> = ({
  userType,
  onSwitchView,
  onLogout,
}) => {
  const { franchiseInfo, loading, updateFranchiseInfo, uploadTemplate } = useFranchiseStorage();
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState(franchiseInfo);
  const [uploading, setUploading] = useState({ quote: false, contract: false });
  const showToast = useToastSimple();

  const canEdit = userType === 'owner';

  React.useEffect(() => {
    if (franchiseInfo) {
      setFormData(franchiseInfo);
    }
  }, [franchiseInfo]);

  const handleSave = () => {
    if (formData) {
      updateFranchiseInfo(formData);
      setEditMode(false);
      showToast('Franchise information updated successfully!', 'success');
    }
  };

  const handleCancel = () => {
    setFormData(franchiseInfo);
    setEditMode(false);
  };

  const handleFileUpload = async (type: 'quote' | 'contract', file: File) => {
    if (!canEdit) return;

    setUploading({ ...uploading, [type]: true });
    try {
      await uploadTemplate(type, file);
      showToast(`${type === 'quote' ? 'Quote' : 'Contract'} template uploaded successfully!`, 'success');
    } catch (error) {
      showToast('Failed to upload template. Please try again.', 'error');
    } finally {
      setUploading({ ...uploading, [type]: false });
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatBusinessHours = (day: string) => {
    if (!formData?.businessHours) return '';
    const hours = formData.businessHours[day as keyof typeof formData.businessHours];
    if (hours.closed) return 'Closed';
    return `${hours.open} - ${hours.close}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-2 border-gray-300 border-t-blue-600 rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading franchise information...</p>
        </div>
      </div>
    );
  }

  if (!franchiseInfo || !formData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">No franchise information available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Page Actions */}
      <div className="flex items-center justify-end">
        {canEdit && (
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
                Edit Information
              </Button>
            )}
          </div>
        )}
        {!canEdit && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Eye className="h-4 w-4" />
            View Only
          </div>
        )}
      </div>

        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="general">General Info</TabsTrigger>
            <TabsTrigger value="contact">Contact & Hours</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="branding">Branding & Social</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="franchiseName">Franchise Name</Label>
                    <Input
                      id="franchiseName"
                      value={formData.franchiseName}
                      onChange={(e) => setFormData({ ...formData, franchiseName: e.target.value })}
                      disabled={!editMode}
                    />
                  </div>
                  <div>
                    <Label htmlFor="franchiseCode">Franchise Code</Label>
                    <Input
                      id="franchiseCode"
                      value={formData.franchiseCode}
                      disabled={true} // Always disabled
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="ownerName">Owner Name</Label>
                    <Input
                      id="ownerName"
                      value={formData.ownerName}
                      onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                      disabled={!editMode}
                    />
                  </div>
                  <div>
                    <Label htmlFor="licenseNumber">License Number</Label>
                    <Input
                      id="licenseNumber"
                      value={formData.licenseNumber}
                      onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                      disabled={!editMode}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    disabled={!editMode}
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Established Date</Label>
                    <p className="text-sm text-gray-700 mt-1">{new Date(formData.establishedDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      value={formData.website || ''}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                      disabled={!editMode}
                      placeholder="https://your-website.com"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contact" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="ownerEmail">Email</Label>
                    <Input
                      id="ownerEmail"
                      type="email"
                      value={formData.ownerEmail}
                      onChange={(e) => setFormData({ ...formData, ownerEmail: e.target.value })}
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

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Business Hours
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(formData.businessHours).map(([day, hours]) => (
                    <div key={day} className="flex items-center justify-between py-2 border-b border-gray-100">
                      <span className="font-medium text-gray-900 capitalize">{day}</span>
                      <span className="text-gray-600">{formatBusinessHours(day)}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="templates" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Quote Template
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {formData.templates.quoteTemplate ? (
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="h-8 w-8 text-blue-600" />
                      <div>
                        <h4 className="font-medium text-gray-900">{formData.templates.quoteTemplate.name}</h4>
                        <p className="text-sm text-gray-600">{formData.templates.quoteTemplate.fileName}</p>
                        <div className="flex items-center gap-4 mt-1">
                          <span className="text-xs text-gray-500">
                            {formatFileSize(formData.templates.quoteTemplate.fileSize)}
                          </span>
                          <span className="text-xs text-gray-500">
                            Uploaded {new Date(formData.templates.quoteTemplate.uploadedDate).toLocaleDateString()}
                          </span>
                          <Badge variant="secondary" className="text-xs">Active</Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="gap-2">
                        <Download className="h-4 w-4" />
                        Download
                      </Button>
                      {canEdit && (
                        <Button variant="outline" size="sm" className="gap-2 text-red-600 hover:text-red-700">
                          <Trash2 className="h-4 w-4" />
                          Remove
                        </Button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Quote Template</h3>
                    <p className="text-gray-600 mb-4">Upload a quote template to standardize your quotes</p>
                  </div>
                )}

                {canEdit && (
                  <div className="pt-4">
                    <Label htmlFor="quote-upload" className="cursor-pointer">
                      <div className="flex items-center justify-center gap-2 p-4 border border-gray-300 border-dashed rounded-lg hover:border-gray-400 transition-colors">
                        <Upload className="h-4 w-4" />
                        <span>{uploading.quote ? 'Uploading...' : 'Upload New Quote Template'}</span>
                      </div>
                    </Label>
                    <Input
                      id="quote-upload"
                      type="file"
                      accept=".docx,.doc,.pdf"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload('quote', file);
                      }}
                      disabled={uploading.quote}
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Contract Template
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {formData.templates.contractTemplate ? (
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="h-8 w-8 text-green-600" />
                      <div>
                        <h4 className="font-medium text-gray-900">{formData.templates.contractTemplate.name}</h4>
                        <p className="text-sm text-gray-600">{formData.templates.contractTemplate.fileName}</p>
                        <div className="flex items-center gap-4 mt-1">
                          <span className="text-xs text-gray-500">
                            {formatFileSize(formData.templates.contractTemplate.fileSize)}
                          </span>
                          <span className="text-xs text-gray-500">
                            Uploaded {new Date(formData.templates.contractTemplate.uploadedDate).toLocaleDateString()}
                          </span>
                          <Badge variant="secondary" className="text-xs">Active</Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="gap-2">
                        <Download className="h-4 w-4" />
                        Download
                      </Button>
                      {canEdit && (
                        <Button variant="outline" size="sm" className="gap-2 text-red-600 hover:text-red-700">
                          <Trash2 className="h-4 w-4" />
                          Remove
                        </Button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Contract Template</h3>
                    <p className="text-gray-600 mb-4">Upload a contract template to standardize your agreements</p>
                  </div>
                )}

                {canEdit && (
                  <div className="pt-4">
                    <Label htmlFor="contract-upload" className="cursor-pointer">
                      <div className="flex items-center justify-center gap-2 p-4 border border-gray-300 border-dashed rounded-lg hover:border-gray-400 transition-colors">
                        <Upload className="h-4 w-4" />
                        <span>{uploading.contract ? 'Uploading...' : 'Upload New Contract Template'}</span>
                      </div>
                    </Label>
                    <Input
                      id="contract-upload"
                      type="file"
                      accept=".docx,.doc,.pdf"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload('contract', file);
                      }}
                      disabled={uploading.contract}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="branding" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="h-5 w-5" />
                  Logo & Branding
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-6">
                  <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center border">
                    {formData.logo ? (
                      <img src={formData.logo} alt="Franchise Logo" className="w-full h-full object-contain rounded-lg" />
                    ) : (
                      <Camera className="h-8 w-8 text-gray-400" />
                    )}
                  </div>
                  {canEdit && (
                    <div>
                      <Button variant="outline" className="gap-2">
                        <Camera className="h-4 w-4" />
                        Upload Logo
                      </Button>
                      <p className="text-xs text-gray-500 mt-2">Recommended size: 200x200px</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Social Media
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="facebook" className="flex items-center gap-2">
                      <Facebook className="h-4 w-4 text-blue-600" />
                      Facebook
                    </Label>
                    <Input
                      id="facebook"
                      value={formData.socialMedia.facebook || ''}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        socialMedia: { ...formData.socialMedia, facebook: e.target.value }
                      })}
                      disabled={!editMode}
                      placeholder="https://facebook.com/your-page"
                    />
                  </div>

                  <div>
                    <Label htmlFor="instagram" className="flex items-center gap-2">
                      <Instagram className="h-4 w-4 text-pink-600" />
                      Instagram
                    </Label>
                    <Input
                      id="instagram"
                      value={formData.socialMedia.instagram || ''}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        socialMedia: { ...formData.socialMedia, instagram: e.target.value }
                      })}
                      disabled={!editMode}
                      placeholder="https://instagram.com/your-account"
                    />
                  </div>

                  <div>
                    <Label htmlFor="linkedin" className="flex items-center gap-2">
                      <Linkedin className="h-4 w-4 text-blue-700" />
                      LinkedIn
                    </Label>
                    <Input
                      id="linkedin"
                      value={formData.socialMedia.linkedin || ''}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        socialMedia: { ...formData.socialMedia, linkedin: e.target.value }
                      })}
                      disabled={!editMode}
                      placeholder="https://linkedin.com/company/your-company"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
  );
};