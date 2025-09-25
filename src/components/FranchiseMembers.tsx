import React, { useState } from 'react';
//import { Member } from '../types/member';
import { useMembersStorage } from '../hooks/use-members-storage';
import { FranchiseHeader } from '../components/navigation/FranchiseHeader';
import { MemberCard } from '../components/members/MemberCard';
import { MemberDetailSheet } from '../components/members/MemberDetailSheet';
import { AddMemberForm } from '../components/members/AddMemberForm';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { 
  Users, 
  UserPlus, 
  DollarSign, 
  Star, 
  UserCheck,
  Search,
  Filter
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

interface FranchiseMembersProps {
  onSwitchView: (view: string) => void;
  onLogout: () => void;
}

export const FranchiseMembers: React.FC<FranchiseMembersProps> = ({
  onSwitchView,
  onLogout,
}) => {
  const { 
    members, 
    loading, 
    addMember, 
    updateMember,
    deleteMember, 
    getMemberQuotes, 
    getMetrics 
  } = useMembersStorage();
  
  const [selectedMember, setSelectedMember] = useState<any | null>(null);
  const [showDetailSheet, setShowDetailSheet] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingMember, setEditingMember] = useState<any | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [memberToDelete, setMemberToDelete] = useState<any | null>(null);
  
  const showToast = useToastSimple();

  const metrics = getMetrics();

  const filteredMembers = members.filter(member => {
    const matchesSearch = 
      member.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.territory.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || member.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleViewDetails = (member: any) => {
    setSelectedMember(member);
    setShowDetailSheet(true);
  };

  const handleEditMember = (member: any) => {
    setEditingMember(member);
    setShowAddForm(true);
    setShowDetailSheet(false);
  };

  const handleAddMember = () => {
    setEditingMember(null);
    setShowAddForm(true);
  };

  const handleFormSubmit = (formData: any) => {
    try {
      if (editingMember) {
        const updatedMember = updateMember(editingMember.id, formData);
        if (updatedMember) {
          showToast('Member updated successfully!', 'success');
          if (selectedMember?.id === editingMember.id) {
            setSelectedMember(updatedMember);
            setShowDetailSheet(true);
          }
        }
      } else {
        const newMember = addMember(formData);
        showToast('Member added successfully!', 'success');
      }
      setEditingMember(null);
    } catch (error) {
      showToast('An error occurred. Please try again.', 'error');
    }
  };

  const handleDeleteClick = (member: any) => {
    setMemberToDelete(member);
    setShowDetailSheet(false);
  };

  const handleDeleteConfirm = () => {
    if (memberToDelete) {
      const success = deleteMember(memberToDelete.id);
      if (success) {
        showToast('Member deleted successfully!', 'success');
        setSelectedMember(null);
      } else {
        showToast('Failed to delete member. Please try again.', 'error');
      }
      setMemberToDelete(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-2 border-gray-300 border-t-blue-600 rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading members...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Page Actions */}
      <div className="flex items-center justify-end">
        <Button onClick={handleAddMember} className="gap-2">
          <UserPlus className="h-4 w-4" />
          Add Member
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
                  <p className="text-sm text-gray-600">Total Members</p>
                  <p className="text-xl font-semibold text-gray-900">{metrics.totalMembers}</p>
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
                  <p className="text-sm text-gray-600">Active Members</p>
                  <p className="text-xl font-semibold text-gray-900">{metrics.activeMembers}</p>
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
                <div className="w-9 h-9 bg-yellow-50 rounded-md flex items-center justify-center">
                  <Star className="h-4 w-4 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Avg Rating</p>
                  <p className="text-xl font-semibold text-gray-900">{metrics.avgRating}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="border border-gray-200">
          <CardContent className="p-5">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search members by name, email, role, or territory..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm bg-white"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Members Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredMembers.map((member) => (
            <MemberCard
              key={member.id}
              member={member}
              onViewDetails={handleViewDetails}
              onDelete={handleDeleteClick}
            />
          ))}
        </div>

        {filteredMembers.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No members found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your search or filter criteria.'
                : 'Get started by adding your first team member.'
              }
            </p>
            {(!searchTerm && statusFilter === 'all') && (
              <Button onClick={handleAddMember} className="gap-2">
                <UserPlus className="h-4 w-4" />
                Add First Member
              </Button>
            )}
          </div>
        )}

      {/* Member Detail Sheet */}
      <MemberDetailSheet
        member={selectedMember}
        quotes={selectedMember ? getMemberQuotes(selectedMember.id) : []}
        open={showDetailSheet}
        onClose={() => setShowDetailSheet(false)}
        onEdit={handleEditMember}
        onDelete={handleDeleteClick}
      />

      {/* Add/Edit Member Form */}
      <AddMemberForm
        open={showAddForm}
        onClose={() => {
          setShowAddForm(false);
          setEditingMember(null);
        }}
        onSubmit={handleFormSubmit}
        editingMember={editingMember}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!memberToDelete} onOpenChange={() => setMemberToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Member</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {memberToDelete?.firstName} {memberToDelete?.lastName}? 
              This action cannot be undone and will remove all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-red-600 hover:bg-red-700">
              Delete Member
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};