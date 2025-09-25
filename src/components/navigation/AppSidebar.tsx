// src/components/navigation/AppSidebar.tsx
'use client';
import React from 'react';
import {
  Building2,
  Users,
  Info,
  User,
  Settings,
  LogOut,
  Gavel,
  FileText,
  MessageSquare,
  ShoppingCart,
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';

interface AppSidebarProps {
  userType: 'owner' | 'member';
  currentView: string;
  onNavigate: (view: string) => void;
  onLogout: () => void;
}

export function AppSidebar({ userType, currentView, onNavigate, onLogout }: AppSidebarProps) {
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';
  const isOwner = userType === 'owner';

  const ownerNavItems = [
    { icon: Building2, label: 'Dashboard', action: () => onNavigate('dashboard'), key: 'dashboard' },
    { icon: Gavel, label: 'Bidding Platform', action: () => onNavigate('bidding'), key: 'bidding' },
    { icon: ShoppingCart, label: 'Customers', action: () => onNavigate('customers'), key: 'customers' },
    { icon: Users, label: 'Members', action: () => onNavigate('members'), key: 'members' },
    { icon: MessageSquare, label: 'CRM', action: () => onNavigate('crm'), key: 'crm' },
    { icon: Info, label: 'Franchise Info', action: () => onNavigate('franchise-info'), key: 'franchise-info' },
  ];

  const memberNavItems = [
    { icon: Building2, label: 'Dashboard', action: () => onNavigate('dashboard'), key: 'dashboard' },
    { icon: FileText, label: 'Quotes', action: () => onNavigate('quotes'), key: 'quotes' },
    { icon: MessageSquare, label: 'CRM', action: () => onNavigate('crm'), key: 'crm' },
    { icon: Info, label: 'Franchise Info', action: () => onNavigate('franchise-info'), key: 'franchise-info' },
  ];

  const userItems = [
    { icon: User, label: 'Profile', action: () => onNavigate('profile'), key: 'profile' },
    { icon: Settings, label: 'Settings', action: () => onNavigate('settings'), key: 'settings' },
  ];

  const navItems = isOwner ? ownerNavItems : memberNavItems;

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-3 px-2 py-2">
          <div className="relative flex-shrink-0">
            <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent rounded-xl blur-sm opacity-50"></div>
            <div className="relative p-2 bg-gradient-to-br from-primary to-accent rounded-xl shadow-lg">
              <Building2 className="h-6 w-6 text-white" />
            </div>
          </div>
          {!isCollapsed && (
            <div className="min-w-0">
              <h1 className="text-base font-bold text-foreground tracking-tight">
                {isOwner ? 'Franchise Owner' : 'Franchise Member'}
              </h1>
              <p className="text-xs text-muted-foreground font-medium">
                {isOwner ? 'Management Portal' : 'Member Portal'}
              </p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{isOwner ? 'Management' : 'Work'}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.key}>
                  <SidebarMenuButton
                    asChild
                    isActive={currentView === item.key}
                    tooltip={isCollapsed ? item.label : undefined}
                  >
                    <button onClick={item.action} className="w-full">
                      <item.icon className="h-4 w-4" />
                      {!isCollapsed && <span>{item.label}</span>}
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Account</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {userItems.map((item) => (
                <SidebarMenuItem key={item.key}>
                  <SidebarMenuButton
                    asChild
                    isActive={currentView === item.key}
                    tooltip={isCollapsed ? item.label : undefined}
                  >
                    <button onClick={item.action} className="w-full">
                      <item.icon className="h-4 w-4" />
                      {!isCollapsed && <span>{item.label}</span>}
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              tooltip={isCollapsed ? 'Logout' : undefined}
            >
              <Button
                variant="ghost"
                onClick={onLogout}
                className="w-full justify-start gap-2 text-sm font-medium text-muted-foreground hover:text-red-600 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4" />
                {!isCollapsed && <span>Logout</span>}
              </Button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}