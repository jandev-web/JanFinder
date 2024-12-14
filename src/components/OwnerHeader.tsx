'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

import fetchOwnerById from '@/utils/getOwnerById'

interface OwnerHeaderProps {
  user: any;
}

const OwnerHeader: React.FC<OwnerHeaderProps> = ({ user }) => {
  //console.log(user);
  const [loading, setLoading] = useState(false);
  const [ownerInfo, setOwnerInfo] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchOwnerInfo = async () => {
      if (user?.sub) {
        try {
          const fetchedOwnerInfo = await fetchOwnerById(user.sub);
          //console.log(fetchedOwnerInfo)
          setOwnerInfo(fetchedOwnerInfo);
          
        } catch (err) {
          setError('Failed to fetch owner information');
          console.error('Error fetching owner info:', err);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchOwnerInfo();
  }, [user]);
  if (loading) {
    return <div>Loading...</div>;
  } else {
    return (
      <header className="bg-green-600 text-white p-4 shadow-md w-full fixed z-10 top-0 left-0">
        <nav className="flex justify-between items-center max-w-screen-xl mx-auto w-full">
          
          <ul className="flex items-center space-x-6">
            <li>
              <Link href="/members/owner" className="hover:text-yellow-300">
                {ownerInfo?.firstName}&apos;s Dashboard
              </Link>
            </li>
            <li>
              <Link href="/members/owner/profile" className="hover:text-yellow-300">
                Profile
              </Link>
              
            </li>
            <li>
              <Link href="/members/owner/subscription" className="hover:text-yellow-300">
                Manage Subscription
              </Link>
            </li>
            {user && (
              <li>
                <Link href="/members/logging-out" className="hover:text-yellow-300">
                  Log Out
                </Link>
              </li>
            )}
          </ul>

          
          <ul className="flex items-center space-x-6">
          <li>
              <Link href="/members/owner/franchise" className="hover:text-yellow-300">
                Franchise
              </Link>
            </li>
            <li>
              <Link href="/members/owner/CBOs" className="hover:text-yellow-300">
                Manage CBOs
              </Link>
            </li>
            <li>
              <Link href="/members/owner/quotes" className="hover:text-yellow-300">
                Manage Quotes
              </Link>
            </li>
          </ul>
        </nav>
      </header>
    );
  }
};

export default OwnerHeader;
