'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import fetchCBOById from '@/utils/getCBOByID'
import LoadingSpinner from '@/components/loadingScreen'


interface CBOHeaderProps {
  user: any;
}

const CBOHeader: React.FC<CBOHeaderProps> = ({ user }) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [cboInfo, setCBOInfo] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchOwnerInfo = async () => {
      if (user?.sub) {
        try {
          const fetchedCBOInfo = await fetchCBOById(user.sub);
          setCBOInfo(fetchedCBOInfo);
          
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
    return (
      <LoadingSpinner />
    );
}
  else {
    return (
      <header className="bg-green-600 text-white p-4 shadow-md w-full fixed top-0 left-0">
        <nav className="flex justify-between items-center max-w-screen-xl mx-auto w-full">
          
          <ul className="flex items-center space-x-6">
            <li>
              <Link href="/members/cbo" className="hover:text-yellow-300">
                {cboInfo?.firstName}&apos;s Dashboard
              </Link>
            </li>
            <li>
              <Link href="/members/cbo/profile" className="hover:text-yellow-300">
                Profile
              </Link>
            </li>
            <li>
              <Link href="/members/cbo/subscription" className="hover:text-yellow-300">
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
              <Link href="/members/cbo/quotes" className="hover:text-yellow-300">
                Manage Quotes
              </Link>
            </li>
          </ul>
          
        </nav>
      </header>
    );
    
  };
};

export default CBOHeader;

