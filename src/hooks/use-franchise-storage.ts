import { useState, useEffect } from 'react';
import { FranchiseInfo, TemplateFile, UserProfile, UserSettings } from '../types/franchise';

// Mock franchise data
const mockFranchiseInfo: FranchiseInfo = {
  id: '1',
  franchiseName: 'CleanPro Solutions',
  franchiseCode: 'CPS-001',
  ownerName: 'John Doe',
  ownerEmail: 'john.doe@cleanpro.com',
  phone: '(555) 123-4567',
  address: {
    street: '123 Business Center Dr',
    city: 'New York',
    state: 'NY',
    zipCode: '10001'
  },
  establishedDate: '2020-03-15',
  licenseNumber: 'CL-2020-NYK-001',
  businessHours: {
    monday: { open: '08:00', close: '18:00', closed: false },
    tuesday: { open: '08:00', close: '18:00', closed: false },
    wednesday: { open: '08:00', close: '18:00', closed: false },
    thursday: { open: '08:00', close: '18:00', closed: false },
    friday: { open: '08:00', close: '18:00', closed: false },
    saturday: { open: '09:00', close: '16:00', closed: false },
    sunday: { open: '10:00', close: '14:00', closed: true }
  },
  templates: {
    quoteTemplate: {
      id: '1',
      name: 'Standard Quote Template',
      type: 'quote',
      fileName: 'quote_template_v2.docx',
      fileSize: 245678,
      uploadedDate: '2024-08-15',
      uploadedBy: 'John Doe',
      mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      isActive: true
    },
    contractTemplate: {
      id: '2',
      name: 'Service Agreement Template',
      type: 'contract',
      fileName: 'service_contract_v3.pdf',
      fileSize: 567890,
      uploadedDate: '2024-07-20',
      uploadedBy: 'John Doe',
      mimeType: 'application/pdf',
      isActive: true
    }
  },
  logo: '/placeholder.svg',
  description: 'Professional cleaning services for residential and commercial properties. We provide comprehensive cleaning solutions with a focus on quality, reliability, and customer satisfaction.',
  website: 'https://cleanpro-solutions.com',
  socialMedia: {
    facebook: 'https://facebook.com/cleanprosolutions',
    instagram: 'https://instagram.com/cleanprosolutions',
    linkedin: 'https://linkedin.com/company/cleanprosolutions'
  }
};

// Mock user profiles
const mockUserProfiles: { [key: string]: UserProfile } = {
  owner: {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@cleanpro.com',
    phone: '(555) 123-4567',
    role: 'Franchise Owner',
    address: {
      street: '456 Executive Ave',
      city: 'New York',
      state: 'NY',
      zipCode: '10002'
    },
    joinDate: '2020-03-15',
    lastLogin: '2024-09-24',
    bio: 'Experienced business owner with over 15 years in the cleaning industry. Passionate about delivering exceptional service and building strong customer relationships.',
    skills: ['Business Management', 'Customer Relations', 'Operations', 'Team Leadership'],
    certifications: ['IICRC Certified', 'Business License', 'Safety Training'],
    emergencyContact: {
      name: 'Jane Doe',
      relationship: 'Spouse',
      phone: '(555) 123-4568'
    }
  },
  member: {
    id: '2',
    firstName: 'Sarah',
    lastName: 'Wilson',
    email: 'sarah.wilson@cleanpro.com',
    phone: '(555) 234-5678',
    role: 'Senior Cleaning Technician',
    address: {
      street: '789 Residential St',
      city: 'Brooklyn',
      state: 'NY',
      zipCode: '11201'
    },
    joinDate: '2023-06-10',
    lastLogin: '2024-09-24',
    bio: 'Dedicated cleaning professional with expertise in residential and commercial cleaning. Committed to maintaining high standards and customer satisfaction.',
    skills: ['Deep Cleaning', 'Window Cleaning', 'Carpet Care', 'Chemical Safety'],
    certifications: ['OSHA Safety Training', 'Green Cleaning Certified', 'First Aid/CPR'],
    emergencyContact: {
      name: 'Michael Wilson',
      relationship: 'Brother',
      phone: '(555) 234-5679'
    }
  }
};

// Mock user settings
const mockUserSettings: { [key: string]: UserSettings } = {
  owner: {
    id: '1',
    userId: '1',
    notifications: {
      email: true,
      sms: true,
      push: true,
      newQuotes: true,
      bidUpdates: true,
      systemAlerts: true,
      marketingEmails: false
    },
    preferences: {
      language: 'English',
      timezone: 'America/New_York',
      dateFormat: 'MM/DD/YYYY',
      currency: 'USD',
      theme: 'light'
    },
    privacy: {
      profileVisibility: 'franchise-only',
      showContactInfo: true,
      showPerformanceStats: true
    },
    security: {
      twoFactorEnabled: true,
      passwordLastChanged: '2024-07-15',
      lastSecurityAudit: '2024-09-01'
    }
  },
  member: {
    id: '2',
    userId: '2',
    notifications: {
      email: true,
      sms: false,
      push: true,
      newQuotes: true,
      bidUpdates: true,
      systemAlerts: true,
      marketingEmails: false
    },
    preferences: {
      language: 'English',
      timezone: 'America/New_York',
      dateFormat: 'MM/DD/YYYY',
      currency: 'USD',
      theme: 'auto'
    },
    privacy: {
      profileVisibility: 'franchise-only',
      showContactInfo: false,
      showPerformanceStats: true
    },
    security: {
      twoFactorEnabled: false,
      passwordLastChanged: '2024-08-20',
      lastSecurityAudit: '2024-09-01'
    }
  }
};

export const useFranchiseStorage = () => {
  const [franchiseInfo, setFranchiseInfo] = useState<FranchiseInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading from storage
    setTimeout(() => {
      const stored = localStorage.getItem('franchise-info');
      if (stored) {
        setFranchiseInfo(JSON.parse(stored));
      } else {
        setFranchiseInfo(mockFranchiseInfo);
        localStorage.setItem('franchise-info', JSON.stringify(mockFranchiseInfo));
      }
      setLoading(false);
    }, 300);
  }, []);

  const updateFranchiseInfo = (updates: Partial<FranchiseInfo>) => {
    if (!franchiseInfo) return null;
    
    const updated = { ...franchiseInfo, ...updates };
    setFranchiseInfo(updated);
    localStorage.setItem('franchise-info', JSON.stringify(updated));
    return updated;
  };

  const uploadTemplate = (type: 'quote' | 'contract', file: File): Promise<TemplateFile> => {
    return new Promise((resolve) => {
      // Simulate file upload process
      setTimeout(() => {
        const template: TemplateFile = {
          id: Date.now().toString(),
          name: `${type === 'quote' ? 'Quote' : 'Contract'} Template`,
          type,
          fileName: file.name,
          fileSize: file.size,
          uploadedDate: new Date().toISOString().split('T')[0],
          uploadedBy: franchiseInfo?.ownerName || 'Unknown',
          mimeType: file.type,
          isActive: true
        };

        if (franchiseInfo) {
          const updated = {
            ...franchiseInfo,
            templates: {
              ...franchiseInfo.templates,
              [type === 'quote' ? 'quoteTemplate' : 'contractTemplate']: template
            }
          };
          setFranchiseInfo(updated);
          localStorage.setItem('franchise-info', JSON.stringify(updated));
        }

        resolve(template);
      }, 2000); // Simulate 2 second upload
    });
  };

  return {
    franchiseInfo,
    loading,
    updateFranchiseInfo,
    uploadTemplate
  };
};

export const useUserProfile = (userType: 'owner' | 'member') => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      const stored = localStorage.getItem(`user-profile-${userType}`);
      if (stored) {
        setProfile(JSON.parse(stored));
      } else {
        const mockProfile = mockUserProfiles[userType];
        setProfile(mockProfile);
        localStorage.setItem(`user-profile-${userType}`, JSON.stringify(mockProfile));
      }
      setLoading(false);
    }, 200);
  }, [userType]);

  const updateProfile = (updates: Partial<UserProfile>) => {
    if (!profile) return null;
    
    const updated = { ...profile, ...updates };
    setProfile(updated);
    localStorage.setItem(`user-profile-${userType}`, JSON.stringify(updated));
    return updated;
  };

  return {
    profile,
    loading,
    updateProfile
  };
};

export const useUserSettings = (userType: 'owner' | 'member') => {
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      const stored = localStorage.getItem(`user-settings-${userType}`);
      if (stored) {
        setSettings(JSON.parse(stored));
      } else {
        const mockSettings = mockUserSettings[userType];
        setSettings(mockSettings);
        localStorage.setItem(`user-settings-${userType}`, JSON.stringify(mockSettings));
      }
      setLoading(false);
    }, 200);
  }, [userType]);

  const updateSettings = (updates: Partial<UserSettings>) => {
    if (!settings) return null;
    
    const updated = { ...settings, ...updates };
    setSettings(updated);
    localStorage.setItem(`user-settings-${userType}`, JSON.stringify(updated));
    return updated;
  };

  return {
    settings,
    loading,
    updateSettings
  };
};