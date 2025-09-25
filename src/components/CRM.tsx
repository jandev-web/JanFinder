import React, { useState } from 'react';
//import { Customer } from '../types/customer';
import { useCustomersStorage } from '../hooks/use-customers-storage';
import { FranchiseHeader } from '../components/navigation/FranchiseHeader';
import { CustomerCard } from '../components/crm/CustomerCard';
import { CustomerDetailModal } from '../components/crm/CustomerDetailModal';
import { AddCustomerForm } from '../components/crm/AddCustomerForm';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { 
  Users, 
  UserPlus, 
  DollarSign, 
  Target, 
  TrendingUp,
  Search,
  Filter,
  UserCheck,
  Eye
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../components/ui/alert-dialog';
import { useToastSimple } from '../hooks/use-toast-simple';
import { AnyAaaaRecord } from 'node:dns';

interface CRMProps {
  onSwitchView: (view: string) => void;
  onLogout: () => void;
}

export const CRM: React.FC<CRMProps> = ({
  onSwitchView,
  onLogout,
}) => {
  const { 
    customers, 
    loading, 
    addCustomer, 
    updateCustomer,
    deleteCustomer, 
    getCustomerQuotes, 
    getCustomerInteractions,
    getMetrics 
  } = useCustomersStorage();
  
  const [selectedCustomer, setSelectedCustomer] = useState<any | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<any | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [customerToDelete, setCustomerToDelete] = useState<any | null>(null);
  
  const showToast = useToastSimple();

  const metrics = getMetrics();

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = 
      customer.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.tags.some((tag: string) => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || customer.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || customer.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const handleViewDetails = (customer: any) => {
    setSelectedCustomer(customer);
    setShowDetailModal(true);
  };

  const handleEditCustomer = (customer: any) => {
    setEditingCustomer(customer);
    setShowAddForm(true);
    setShowDetailModal(false);
  };

  const handleAddCustomer = () => {
    setEditingCustomer(null);
    setShowAddForm(true);
  };

  const handleFormSubmit = (formData: any) => {
    try {
      if (editingCustomer) {
        const updatedCustomer = updateCustomer(editingCustomer.id, formData);
        if (updatedCustomer) {
          showToast('Customer updated successfully!', 'success');
          if (selectedCustomer?.id === editingCustomer.id) {
            setSelectedCustomer(updatedCustomer);
            setShowDetailModal(true);
          }
        }
      } else {
        const newCustomer = addCustomer(formData);
        showToast('Customer added successfully!', 'success');
      }
      setEditingCustomer(null);
    } catch (error) {
      showToast('An error occurred. Please try again.', 'error');
    }
  };

  const handleDeleteClick = (customer: any) => {
    setCustomerToDelete(customer);
    setShowDetailModal(false);
  };

  const handleDeleteConfirm = () => {
    if (customerToDelete) {
      const success = deleteCustomer(customerToDelete.id);
      if (success) {
        showToast('Customer deleted successfully!', 'success');
        setSelectedCustomer(null);
      } else {
        showToast('Failed to delete customer. Please try again.', 'error');
      }
      setCustomerToDelete(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-2 border-gray-300 border-t-blue-600 rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading customers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Page Actions */}
      <div className="flex items-center justify-end">
        <Button onClick={handleAddCustomer} className="gap-2">
          <UserPlus className="h-4 w-4" />
          Add Customer
        </Button>
      </div>

        {/* Metrics Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="hover:shadow-md transition-shadow duration-200 border border-gray-200">
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-gray-100 rounded-md flex items-center justify-center">
                  <Users className="h-4 w-4 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Customers</p>
                  <p className="text-xl font-semibold text-gray-900">{metrics.totalCustomers}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow duration-200 border border-gray-200">
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-green-50 rounded-md flex items-center justify-center">
                  <UserCheck className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Active Customers</p>
                  <p className="text-xl font-semibold text-gray-900">{metrics.activeCustomers}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow duration-200 border border-gray-200">
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-blue-50 rounded-md flex items-center justify-center">
                  <DollarSign className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Revenue</p>
                  <p className="text-xl font-semibold text-gray-900">${metrics.totalRevenue.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow duration-200 border border-gray-200">
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-purple-50 rounded-md flex items-center justify-center">
                  <Target className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Conversion Rate</p>
                  <p className="text-xl font-semibold text-gray-900">{metrics.conversionRate.toFixed(1)}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Metrics Row */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="hover:shadow-md transition-shadow duration-200 border border-gray-200">
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-yellow-50 rounded-md flex items-center justify-center">
                  <Eye className="h-4 w-4 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Prospects</p>
                  <p className="text-xl font-semibold text-gray-900">{metrics.prospects}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow duration-200 border border-gray-200">
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-indigo-50 rounded-md flex items-center justify-center">
                  <DollarSign className="h-4 w-4 text-indigo-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Avg Customer Value</p>
                  <p className="text-xl font-semibold text-gray-900">${metrics.averageCustomerValue.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow duration-200 border border-gray-200">
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-red-50 rounded-md flex items-center justify-center">
                  <TrendingUp className="h-4 w-4 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Churn Rate</p>
                  <p className="text-xl font-semibold text-gray-900">{metrics.churnRate.toFixed(1)}%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow duration-200 border border-gray-200">
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-teal-50 rounded-md flex items-center justify-center">
                  <TrendingUp className="h-4 w-4 text-teal-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Monthly Growth</p>
                  <p className="text-xl font-semibold text-gray-900">+{metrics.monthlyGrowth}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="border border-gray-200">
          <CardContent className="p-5">
            <div className="flex flex-col gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search customers by name, email, company, or tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-gray-500" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm bg-white"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="prospect">Prospect</option>
                    <option value="inactive">Inactive</option>
                    <option value="churned">Churned</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-gray-500" />
                  <select
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm bg-white"
                  >
                    <option value="all">All Priority</option>
                    <option value="high">High Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="low">Low Priority</option>
                  </select>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Customers Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredCustomers.map((customer) => (
            <CustomerCard
              key={customer.id}
              customer={customer}
              onViewDetails={handleViewDetails}
              onDelete={handleDeleteClick}
            />
          ))}
        </div>

        {filteredCustomers.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No customers found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || statusFilter !== 'all' || priorityFilter !== 'all'
                ? 'Try adjusting your search or filter criteria.'
                : 'Get started by adding your first customer.'
              }
            </p>
            {(!searchTerm && statusFilter === 'all' && priorityFilter === 'all') && (
              <Button onClick={handleAddCustomer} className="gap-2">
                <UserPlus className="h-4 w-4" />
                Add First Customer
              </Button>
            )}
          </div>
        )}

      {/* Customer Detail Modal */}
      <CustomerDetailModal
        customer={selectedCustomer}
        quotes={selectedCustomer ? getCustomerQuotes(selectedCustomer.id) : []}
        interactions={selectedCustomer ? getCustomerInteractions(selectedCustomer.id) : []}
        open={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        onEdit={handleEditCustomer}
        onDelete={handleDeleteClick}
      />

      {/* Add/Edit Customer Form */}
      <AddCustomerForm
        open={showAddForm}
        onClose={() => {
          setShowAddForm(false);
          setEditingCustomer(null);
        }}
        onSubmit={handleFormSubmit}
        editingCustomer={editingCustomer}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!customerToDelete} onOpenChange={() => setCustomerToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Customer</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {customerToDelete?.firstName} {customerToDelete?.lastName}? 
              This action cannot be undone and will remove all associated quotes and interactions.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-red-600 hover:bg-red-700">
              Delete Customer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};