import { useState, useEffect } from 'react';
import { Customer, CustomerQuote, CustomerInteraction, CRMMetrics } from '../types/customer';

// Mock data for development
const mockCustomers: Customer[] = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Smith',
    email: 'john.smith@email.com',
    phone: '(555) 123-4567',
    company: 'Smith Enterprises',
    status: 'active',
    source: 'website',
    priority: 'high',
    assignedTo: '1',
    createdDate: '2024-01-15',
    lastContact: '2024-09-20',
    nextFollowUp: '2024-09-30',
    lifetime_value: 15000,
    totalSpent: 12500,
    address: {
      street: '123 Business Ave',
      city: 'New York',
      state: 'NY',
      zipCode: '10001'
    },
    preferences: {
      contactMethod: 'email',
      frequency: 'monthly'
    },
    tags: ['VIP', 'Commercial'],
    notes: 'Excellent customer, always pays on time. Interested in expanding services.'
  },
  {
    id: '2',
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.johnson@email.com',
    phone: '(555) 234-5678',
    status: 'prospect',
    source: 'referral',
    priority: 'medium',
    assignedTo: '2',
    createdDate: '2024-08-10',
    lastContact: '2024-09-15',
    nextFollowUp: '2024-09-25',
    lifetime_value: 5000,
    totalSpent: 0,
    address: {
      street: '456 Residential St',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90210'
    },
    preferences: {
      contactMethod: 'phone',
      frequency: 'weekly'
    },
    tags: ['Residential', 'New Lead'],
    notes: 'Interested in weekly cleaning service. Waiting for quote approval.'
  },
  {
    id: '3',
    firstName: 'Michael',
    lastName: 'Brown',
    email: 'michael.brown@email.com',
    phone: '(555) 345-6789',
    company: 'Brown Medical Group',
    status: 'active',
    source: 'advertisement',
    priority: 'high',
    assignedTo: '1',
    createdDate: '2024-03-22',
    lastContact: '2024-09-18',
    lifetime_value: 25000,
    totalSpent: 18750,
    address: {
      street: '789 Medical Plaza',
      city: 'Chicago',
      state: 'IL',
      zipCode: '60601'
    },
    preferences: {
      contactMethod: 'email',
      frequency: 'monthly'
    },
    tags: ['Medical', 'VIP', 'Long-term'],
    notes: 'Medical facility requiring specialized cleaning protocols. Very satisfied with service quality.'
  },
  {
    id: '4',
    firstName: 'Emily',
    lastName: 'Davis',
    email: 'emily.davis@email.com',
    phone: '(555) 456-7890',
    status: 'inactive',
    source: 'social-media',
    priority: 'low',
    assignedTo: '3',
    createdDate: '2024-02-05',
    lastContact: '2024-07-10',
    lifetime_value: 2500,
    totalSpent: 2500,
    address: {
      street: '321 Home Street',
      city: 'Houston',
      state: 'TX',
      zipCode: '77001'
    },
    preferences: {
      contactMethod: 'text',
      frequency: 'quarterly'
    },
    tags: ['Residential', 'Former Customer'],
    notes: 'Former customer who moved out of service area. May return in the future.'
  },
  {
    id: '5',
    firstName: 'David',
    lastName: 'Wilson',
    email: 'david.wilson@email.com',
    phone: '(555) 567-8901',
    company: 'Wilson Tech Solutions',
    status: 'prospect',
    source: 'cold-call',
    priority: 'medium',
    assignedTo: '2',
    createdDate: '2024-09-01',
    lastContact: '2024-09-22',
    nextFollowUp: '2024-09-28',
    lifetime_value: 8000,
    totalSpent: 0,
    address: {
      street: '654 Tech Park',
      city: 'Austin',
      state: 'TX',
      zipCode: '73301'
    },
    preferences: {
      contactMethod: 'email',
      frequency: 'weekly'
    },
    tags: ['Technology', 'Startup'],
    notes: 'Tech startup looking for regular office cleaning. Budget conscious but interested in long-term contract.'
  }
];

const mockQuotes: CustomerQuote[] = [
  {
    id: '1',
    customerId: '1',
    serviceType: 'Commercial Deep Clean',
    amount: 2500,
    status: 'accepted',
    createdDate: '2024-09-15',
    validUntil: '2024-10-15',
    assignedMember: '1',
    description: 'Complete deep cleaning of office building including carpets and windows'
  },
  {
    id: '2',
    customerId: '2',
    serviceType: 'Residential Weekly',
    amount: 800,
    status: 'sent',
    createdDate: '2024-09-20',
    validUntil: '2024-10-20',
    assignedMember: '2',
    description: 'Weekly residential cleaning service for 3-bedroom house'
  },
  {
    id: '3',
    customerId: '5',
    serviceType: 'Office Maintenance',
    amount: 1200,
    status: 'draft',
    createdDate: '2024-09-22',
    validUntil: '2024-10-22',
    assignedMember: '2',
    description: 'Monthly office cleaning and maintenance services'
  }
];

const mockInteractions: CustomerInteraction[] = [
  {
    id: '1',
    customerId: '1',
    type: 'meeting',
    subject: 'Service Review Meeting',
    description: 'Discussed expanding services to include additional buildings',
    date: '2024-09-20',
    duration: 60,
    assignedMember: '1',
    outcome: 'positive'
  },
  {
    id: '2',
    customerId: '2',
    type: 'call',
    subject: 'Follow-up on Quote',
    description: 'Called to discuss pricing and schedule options',
    date: '2024-09-15',
    duration: 25,
    assignedMember: '2',
    outcome: 'follow-up-needed'
  }
];

export const useCustomersStorage = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [quotes, setQuotes] = useState<CustomerQuote[]>([]);
  const [interactions, setInteractions] = useState<CustomerInteraction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading from storage
    setTimeout(() => {
      const storedCustomers = localStorage.getItem('franchise-customers');
      const storedQuotes = localStorage.getItem('franchise-customer-quotes');
      const storedInteractions = localStorage.getItem('franchise-customer-interactions');

      if (storedCustomers) {
        setCustomers(JSON.parse(storedCustomers));
      } else {
        setCustomers(mockCustomers);
        localStorage.setItem('franchise-customers', JSON.stringify(mockCustomers));
      }

      if (storedQuotes) {
        setQuotes(JSON.parse(storedQuotes));
      } else {
        setQuotes(mockQuotes);
        localStorage.setItem('franchise-customer-quotes', JSON.stringify(mockQuotes));
      }

      if (storedInteractions) {
        setInteractions(JSON.parse(storedInteractions));
      } else {
        setInteractions(mockInteractions);
        localStorage.setItem('franchise-customer-interactions', JSON.stringify(mockInteractions));
      }

      setLoading(false);
    }, 500);
  }, []);

  const addCustomer = (customerData: Omit<Customer, 'id'>) => {
    const newCustomer: Customer = {
      ...customerData,
      id: Date.now().toString(),
    };
    
    const updatedCustomers = [...customers, newCustomer];
    setCustomers(updatedCustomers);
    localStorage.setItem('franchise-customers', JSON.stringify(updatedCustomers));
    return newCustomer;
  };

  const updateCustomer = (id: string, updates: Partial<Customer>) => {
    const updatedCustomers = customers.map(customer =>
      customer.id === id ? { ...customer, ...updates } : customer
    );
    setCustomers(updatedCustomers);
    localStorage.setItem('franchise-customers', JSON.stringify(updatedCustomers));
    return updatedCustomers.find(customer => customer.id === id) || null;
  };

  const deleteCustomer = (id: string) => {
    const updatedCustomers = customers.filter(customer => customer.id !== id);
    setCustomers(updatedCustomers);
    localStorage.setItem('franchise-customers', JSON.stringify(updatedCustomers));
    
    // Also remove related quotes and interactions
    const updatedQuotes = quotes.filter(quote => quote.customerId !== id);
    const updatedInteractions = interactions.filter(interaction => interaction.customerId !== id);
    setQuotes(updatedQuotes);
    setInteractions(updatedInteractions);
    localStorage.setItem('franchise-customer-quotes', JSON.stringify(updatedQuotes));
    localStorage.setItem('franchise-customer-interactions', JSON.stringify(updatedInteractions));
    
    return true;
  };

  const getCustomerQuotes = (customerId: string) => {
    return quotes.filter(quote => quote.customerId === customerId);
  };

  const getCustomerInteractions = (customerId: string) => {
    return interactions.filter(interaction => interaction.customerId === customerId);
  };

  const addQuote = (quoteData: Omit<CustomerQuote, 'id'>) => {
    const newQuote: CustomerQuote = {
      ...quoteData,
      id: Date.now().toString(),
    };
    
    const updatedQuotes = [...quotes, newQuote];
    setQuotes(updatedQuotes);
    localStorage.setItem('franchise-customer-quotes', JSON.stringify(updatedQuotes));
    return newQuote;
  };

  const addInteraction = (interactionData: Omit<CustomerInteraction, 'id'>) => {
    const newInteraction: CustomerInteraction = {
      ...interactionData,
      id: Date.now().toString(),
    };
    
    const updatedInteractions = [...interactions, newInteraction];
    setInteractions(updatedInteractions);
    localStorage.setItem('franchise-customer-interactions', JSON.stringify(updatedInteractions));
    return newInteraction;
  };

  const getMetrics = (): CRMMetrics => {
    const totalCustomers = customers.length;
    const activeCustomers = customers.filter(c => c.status === 'active').length;
    const prospects = customers.filter(c => c.status === 'prospect').length;
    const totalRevenue = customers.reduce((sum, customer) => sum + customer.totalSpent, 0);
    const averageCustomerValue = totalCustomers > 0 ? totalRevenue / totalCustomers : 0;
    const conversionRate = totalCustomers > 0 ? (activeCustomers / totalCustomers) * 100 : 0;
    const churnedCustomers = customers.filter(c => c.status === 'churned' || c.status === 'inactive').length;
    const churnRate = totalCustomers > 0 ? (churnedCustomers / totalCustomers) * 100 : 0;
    const monthlyGrowth = 15.5; // Mock data

    return {
      totalCustomers,
      activeCustomers,
      prospects,
      totalRevenue,
      averageCustomerValue,
      conversionRate,
      churnRate,
      monthlyGrowth
    };
  };

  return {
    customers,
    quotes,
    interactions,
    loading,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    getCustomerQuotes,
    getCustomerInteractions,
    addQuote,
    addInteraction,
    getMetrics
  };
};