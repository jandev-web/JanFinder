import React, { useState } from 'react';
import { useUserSettings } from '../hooks/use-franchise-storage';
import { FranchiseHeader } from '../components/navigation/FranchiseHeader';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Switch } from '../components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import {
  Settings,
  Bell,
  Lock,
  Eye,
  Globe,
  Shield,
  Smartphone,
  Mail,
  Save,
  Key,
  AlertTriangle
} from 'lucide-react';
import { useToastSimple } from '../hooks/use-toast-simple';

interface UserSettingsPageProps {
  userType: 'owner' | 'member';
  onSwitchView: (view: string) => void;
  onLogout: () => void;
}

export const UserSettingsPage: React.FC<UserSettingsPageProps> = ({
  userType,
  onSwitchView,
  onLogout,
}) => {
  const { settings, loading, updateSettings } = useUserSettings(userType);
  const [formData, setFormData] = useState(settings);
  const showToast = useToastSimple();

  React.useEffect(() => {
    if (settings) {
      setFormData(settings);
    }
  }, [settings]);

  const handleSave = () => {
    if (formData) {
      updateSettings(formData);
      showToast('Settings updated successfully!', 'success');
    }
  };

  const handleNotificationChange = (key: string, value: boolean) => {
    if (formData) {
      setFormData({
        ...formData,
        notifications: {
          ...formData.notifications,
          [key]: value
        }
      });
    }
  };

  const handlePreferenceChange = (key: string, value: string) => {
    if (formData) {
      setFormData({
        ...formData,
        preferences: {
          ...formData.preferences,
          [key]: value
        }
      });
    }
  };

  const handlePrivacyChange = (key: string, value: boolean | string) => {
    if (formData) {
      setFormData({
        ...formData,
        privacy: {
          ...formData.privacy,
          [key]: value
        }
      });
    }
  };

  const handleSecurityChange = (key: string, value: boolean) => {
    if (formData) {
      setFormData({
        ...formData,
        security: {
          ...formData.security,
          [key]: value
        }
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-2 border-gray-300 border-t-blue-600 rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading settings...</p>
        </div>
      </div>
    );
  }

  if (!settings || !formData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Settings not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <FranchiseHeader 
        userType={userType} 
        onNavigate={onSwitchView} 
        onLogout={onLogout} 
      />
      
      <div className="max-w-4xl mx-auto px-6 py-6 space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-medium text-gray-900 mb-2">Settings</h1>
            <div className="h-0.5 w-12 bg-blue-600 rounded-full mb-3"></div>
            <p className="text-gray-600">Manage your account preferences and privacy settings</p>
          </div>
          <Button onClick={handleSave} className="gap-2">
            <Save className="h-4 w-4" />
            Save Changes
          </Button>
        </div>

        <Tabs defaultValue="notifications" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
            <TabsTrigger value="privacy">Privacy</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notification Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-900">Communication Methods</h3>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-gray-500" />
                      <div>
                        <p className="font-medium">Email Notifications</p>
                        <p className="text-sm text-gray-600">Receive notifications via email</p>
                      </div>
                    </div>
                    <Switch
                      checked={formData.notifications.email}
                      onCheckedChange={(checked) => handleNotificationChange('email', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Smartphone className="h-5 w-5 text-gray-500" />
                      <div>
                        <p className="font-medium">SMS Notifications</p>
                        <p className="text-sm text-gray-600">Receive notifications via text message</p>
                      </div>
                    </div>
                    <Switch
                      checked={formData.notifications.sms}
                      onCheckedChange={(checked) => handleNotificationChange('sms', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Bell className="h-5 w-5 text-gray-500" />
                      <div>
                        <p className="font-medium">Push Notifications</p>
                        <p className="text-sm text-gray-600">Receive push notifications in your browser</p>
                      </div>
                    </div>
                    <Switch
                      checked={formData.notifications.push}
                      onCheckedChange={(checked) => handleNotificationChange('push', checked)}
                    />
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="font-medium text-gray-900 mb-4">Notification Types</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">New Quotes</p>
                        <p className="text-sm text-gray-600">When new quotes are assigned to you</p>
                      </div>
                      <Switch
                        checked={formData.notifications.newQuotes}
                        onCheckedChange={(checked) => handleNotificationChange('newQuotes', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Bid Updates</p>
                        <p className="text-sm text-gray-600">When there are updates to bidding activity</p>
                      </div>
                      <Switch
                        checked={formData.notifications.bidUpdates}
                        onCheckedChange={(checked) => handleNotificationChange('bidUpdates', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">System Alerts</p>
                        <p className="text-sm text-gray-600">Important system announcements and updates</p>
                      </div>
                      <Switch
                        checked={formData.notifications.systemAlerts}
                        onCheckedChange={(checked) => handleNotificationChange('systemAlerts', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Marketing Emails</p>
                        <p className="text-sm text-gray-600">Promotional content and product updates</p>
                      </div>
                      <Switch
                        checked={formData.notifications.marketingEmails}
                        onCheckedChange={(checked) => handleNotificationChange('marketingEmails', checked)}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preferences" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  General Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Language</Label>
                    <Select value={formData.preferences.language} onValueChange={(value) => handlePreferenceChange('language', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="English">English</SelectItem>
                        <SelectItem value="Spanish">Spanish</SelectItem>
                        <SelectItem value="French">French</SelectItem>
                        <SelectItem value="German">German</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Timezone</Label>
                    <Select value={formData.preferences.timezone} onValueChange={(value) => handlePreferenceChange('timezone', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="America/New_York">Eastern Time</SelectItem>
                        <SelectItem value="America/Chicago">Central Time</SelectItem>
                        <SelectItem value="America/Denver">Mountain Time</SelectItem>
                        <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Date Format</Label>
                    <Select value={formData.preferences.dateFormat} onValueChange={(value) => handlePreferenceChange('dateFormat', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                        <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                        <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Currency</Label>
                    <Select value={formData.preferences.currency} onValueChange={(value) => handlePreferenceChange('currency', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD ($)</SelectItem>
                        <SelectItem value="EUR">EUR (€)</SelectItem>
                        <SelectItem value="GBP">GBP (£)</SelectItem>
                        <SelectItem value="CAD">CAD (C$)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label>Theme</Label>
                  <Select value={formData.preferences.theme} onValueChange={(value) => handlePreferenceChange('theme', value)}>
                    <SelectTrigger className="md:w-1/2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="auto">Auto (System)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="privacy" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Privacy Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label>Profile Visibility</Label>
                  <Select 
                    value={formData.privacy.profileVisibility} 
                    onValueChange={(value) => handlePrivacyChange('profileVisibility', value)}
                  >
                    <SelectTrigger className="md:w-1/2 mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public - Visible to everyone</SelectItem>
                      <SelectItem value="franchise-only">Franchise Only - Visible to franchise members</SelectItem>
                      <SelectItem value="private">Private - Only visible to you</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Show Contact Information</p>
                      <p className="text-sm text-gray-600">Allow others to see your email and phone number</p>
                    </div>
                    <Switch
                      checked={formData.privacy.showContactInfo}
                      onCheckedChange={(checked) => handlePrivacyChange('showContactInfo', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Show Performance Statistics</p>
                      <p className="text-sm text-gray-600">Display your work performance and ratings</p>
                    </div>
                    <Switch
                      checked={formData.privacy.showPerformanceStats}
                      onCheckedChange={(checked) => handlePrivacyChange('showPerformanceStats', checked)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Security Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Two-Factor Authentication</p>
                    <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                  </div>
                  <Switch
                    checked={formData.security.twoFactorEnabled}
                    onCheckedChange={(checked) => handleSecurityChange('twoFactorEnabled', checked)}
                  />
                </div>

                <div className="border-t pt-6">
                  <h3 className="font-medium text-gray-900 mb-4">Password & Security</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Password Last Changed</p>
                        <p className="text-sm text-gray-600">
                          {new Date(formData.security.passwordLastChanged).toLocaleDateString()}
                        </p>
                      </div>
                      <Button variant="outline" className="gap-2">
                        <Key className="h-4 w-4" />
                        Change Password
                      </Button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Last Security Audit</p>
                        <p className="text-sm text-gray-600">
                          {new Date(formData.security.lastSecurityAudit).toLocaleDateString()}
                        </p>
                      </div>
                      <Button variant="outline" className="gap-2">
                        <Shield className="h-4 w-4" />
                        Run Security Check
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-yellow-800">Security Recommendations</h4>
                        <ul className="text-sm text-yellow-700 mt-2 space-y-1">
                          <li>• Enable two-factor authentication for better security</li>
                          <li>• Change your password regularly (every 3-6 months)</li>
                          <li>• Use a strong, unique password</li>
                          <li>• Log out from shared devices</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};