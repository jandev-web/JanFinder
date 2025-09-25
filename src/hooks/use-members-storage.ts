import { useState, useEffect } from 'react';
import { Member, MemberQuote, MemberFormData } from '../types/member';

// Mock data
const mockMembers: Member[] = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Smith',
    email: 'john.smith@cleanpro.com',
    phone: '(555) 123-4567',
    joinDate: '2023-01-15',
    status: 'active',
    role: 'Senior Cleaner',
    territory: 'Downtown District',
    totalRevenue: 45000,
    monthlyRevenue: 3800,
    quotesAssigned: 23,
    quotesCompleted: 21,
    customerRating: 4.8,
    reviewCount: 156,
    address: {
      street: '123 Main St',
      city: 'Springfield',
      state: 'IL',
      zipCode: '62701'
    },
    emergencyContact: {
      name: 'Jane Smith',
      phone: '(555) 123-4568',
      relationship: 'Spouse'
    },
    certifications: ['OSHA Safety', 'Green Cleaning', 'Carpet Care'],
    notes: 'Excellent performance, great customer feedback'
  },
  {
    id: '2',
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.johnson@cleanpro.com',
    phone: '(555) 987-6543',
    joinDate: '2023-03-10',
    status: 'active',
    role: 'Team Lead',
    territory: 'Medical District',
    totalRevenue: 52000,
    monthlyRevenue: 4300,
    quotesAssigned: 28,
    quotesCompleted: 26,
    customerRating: 4.9,
    reviewCount: 203,
    address: {
      street: '456 Oak Ave',
      city: 'Springfield',
      state: 'IL',
      zipCode: '62702'
    },
    emergencyContact: {
      name: 'Mike Johnson',
      phone: '(555) 987-6544',
      relationship: 'Brother'
    },
    certifications: ['OSHA Safety', 'Bio-hazard Cleaning', 'Team Leadership'],
    notes: 'Top performer, excellent leadership skills'
  },
  {
    id: '3',
    firstName: 'Mike',
    lastName: 'Davis',
    email: 'mike.davis@cleanpro.com',
    phone: '(555) 456-7890',
    joinDate: '2023-06-20',
    status: 'active',
    role: 'Cleaner',
    territory: 'Retail District',
    totalRevenue: 28000,
    monthlyRevenue: 2800,
    quotesAssigned: 15,
    quotesCompleted: 14,
    customerRating: 4.6,
    reviewCount: 89,
    address: {
      street: '789 Pine St',
      city: 'Springfield',
      state: 'IL',
      zipCode: '62703'
    },
    emergencyContact: {
      name: 'Lisa Davis',
      phone: '(555) 456-7891',
      relationship: 'Wife'
    },
    certifications: ['OSHA Safety', 'Window Cleaning'],
    notes: 'Reliable and punctual'
  },
  {
    id: '4',
    firstName: 'Emily',
    lastName: 'Wilson',
    email: 'emily.wilson@cleanpro.com',
    phone: '(555) 234-5678',
    joinDate: '2024-01-08',
    status: 'pending',
    role: 'Junior Cleaner',
    territory: 'Business Park',
    totalRevenue: 8500,
    monthlyRevenue: 2100,
    quotesAssigned: 6,
    quotesCompleted: 5,
    customerRating: 4.4,
    reviewCount: 12,
    address: {
      street: '321 Elm St',
      city: 'Springfield',
      state: 'IL',
      zipCode: '62704'
    },
    emergencyContact: {
      name: 'Robert Wilson',
      phone: '(555) 234-5679',
      relationship: 'Father'
    },
    certifications: ['OSHA Safety'],
    notes: 'New hire, showing great potential'
  }
];

const mockQuotes: MemberQuote[] = [
  {
    id: 'q1',
    memberId: '1',
    customerName: 'TechCorp Office',
    customerEmail: 'admin@techcorp.com',
    serviceType: 'Office Cleaning',
    amount: 850,
    status: 'completed',
    assignedDate: '2024-01-15',
    completedDate: '2024-01-16',
    location: '123 Business Ave',
    description: 'Weekly office cleaning - 5000 sq ft'
  },
  {
    id: 'q2',
    memberId: '1',
    customerName: 'Downtown Dental',
    customerEmail: 'office@downtowndental.com',
    serviceType: 'Medical Cleaning',
    amount: 650,
    status: 'in-progress',
    assignedDate: '2024-01-20',
    location: '456 Health St',
    description: 'Dental office deep clean and sanitization'
  },
  {
    id: 'q3',
    memberId: '2',
    customerName: 'City Hospital',
    customerEmail: 'facilities@cityhospital.com',
    serviceType: 'Medical Cleaning',
    amount: 2200,
    status: 'completed',
    assignedDate: '2024-01-10',
    completedDate: '2024-01-12',
    location: '789 Medical Center Dr',
    description: 'Hospital wing deep cleaning and disinfection'
  }
];

const STORAGE_KEY = 'franchise-members';
const QUOTES_STORAGE_KEY = 'member-quotes';

export const useMembersStorage = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [quotes, setQuotes] = useState<MemberQuote[]>([]);
  const [loading, setLoading] = useState(true);

  // Load data from localStorage on mount
  useEffect(() => {
    try {
      const storedMembers = localStorage.getItem(STORAGE_KEY);
      const storedQuotes = localStorage.getItem(QUOTES_STORAGE_KEY);
      
      if (storedMembers) {
        setMembers(JSON.parse(storedMembers));
      } else {
        setMembers(mockMembers);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(mockMembers));
      }
      
      if (storedQuotes) {
        setQuotes(JSON.parse(storedQuotes));
      } else {
        setQuotes(mockQuotes);
        localStorage.setItem(QUOTES_STORAGE_KEY, JSON.stringify(mockQuotes));
      }
    } catch (error) {
      console.error('Error loading data from localStorage:', error);
      setMembers(mockMembers);
      setQuotes(mockQuotes);
    } finally {
      setLoading(false);
    }
  }, []);

  const saveMembers = (newMembers: Member[]) => {
    setMembers(newMembers);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newMembers));
  };

  const addMember = (memberData: MemberFormData): Member => {
    const newMember: Member = {
      id: Date.now().toString(),
      firstName: memberData.firstName,
      lastName: memberData.lastName,
      email: memberData.email,
      phone: memberData.phone,
      role: memberData.role,
      territory: memberData.territory,
      joinDate: new Date().toISOString().split('T')[0],
      status: 'pending',
      totalRevenue: 0,
      monthlyRevenue: 0,
      quotesAssigned: 0,
      quotesCompleted: 0,
      customerRating: 0,
      reviewCount: 0,
      address: {
        street: memberData.street,
        city: memberData.city,
        state: memberData.state,
        zipCode: memberData.zipCode,
      },
      emergencyContact: {
        name: memberData.emergencyContactName,
        phone: memberData.emergencyContactPhone,
        relationship: memberData.emergencyContactRelationship,
      },
      certifications: memberData.certifications.split(',').map(cert => cert.trim()).filter(Boolean),
      notes: memberData.notes,
    };

    const updatedMembers = [...members, newMember];
    saveMembers(updatedMembers);
    return newMember;
  };

  const updateMember = (id: string, memberData: MemberFormData): Member | null => {
    const memberIndex = members.findIndex(m => m.id === id);
    if (memberIndex === -1) return null;

    const existingMember = members[memberIndex];
    const updatedMember: Member = {
      ...existingMember,
      firstName: memberData.firstName,
      lastName: memberData.lastName,
      email: memberData.email,
      phone: memberData.phone,
      role: memberData.role,
      territory: memberData.territory,
      address: {
        street: memberData.street,
        city: memberData.city,
        state: memberData.state,
        zipCode: memberData.zipCode,
      },
      emergencyContact: {
        name: memberData.emergencyContactName,
        phone: memberData.emergencyContactPhone,
        relationship: memberData.emergencyContactRelationship,
      },
      certifications: memberData.certifications.split(',').map(cert => cert.trim()).filter(Boolean),
      notes: memberData.notes,
    };

    const updatedMembers = [...members];
    updatedMembers[memberIndex] = updatedMember;
    saveMembers(updatedMembers);
    return updatedMember;
  };

  const deleteMember = (id: string): boolean => {
    const updatedMembers = members.filter(member => member.id !== id);
    if (updatedMembers.length !== members.length) {
      saveMembers(updatedMembers);
      return true;
    }
    return false;
  };

  const getMemberQuotes = (memberId: string): MemberQuote[] => {
    return quotes.filter(quote => quote.memberId === memberId);
  };

  const getMetrics = () => {
    const totalMembers = members.length;
    const activeMembers = members.filter(m => m.status === 'active').length;
    const totalRevenue = members.reduce((sum, m) => sum + m.totalRevenue, 0);
    const avgRating = members.length > 0 
      ? members.reduce((sum, m) => sum + m.customerRating, 0) / members.length 
      : 0;

    return {
      totalMembers,
      activeMembers,
      totalRevenue,
      avgRating: Number(avgRating.toFixed(1))
    };
  };

  return {
    members,
    quotes,
    loading,
    addMember,
    updateMember,
    deleteMember,
    getMemberQuotes,
    getMetrics
  };
};