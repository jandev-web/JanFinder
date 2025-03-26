import React, { useState } from 'react';
import Link from 'next/link';
import CreateCBOForm from '@/components/pages/AddCBOForm';
import { useRouter } from 'next/navigation';
import sendCBOInvite from '@/utils/sendCBOInvite';

interface AddCBOPageProps {
  user: any;
}

const AddCBOPage: React.FC<AddCBOPageProps> = ({ user }) => {
  const router = useRouter()
  const [showEmailInvite, setShowEmailInvite] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendCBOInvite(user?.OwnerID, inviteEmail);
    router.push('/members/owner/cbos')
 
  };

  return (
    <div className="flex flex-col min-h-screen w-full bg-gray-100 overflow-x-hidden">
      {/* Banner with Back button */}
      <div className="bg-[#001F54] text-white py-2 px-4 flex items-center w-full">
        <Link href="/members/owner/CBOs" className="flex items-center text-white hover:text-yellow-300">
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </Link>
      </div>

      {/* Main Container */}
      <div className="flex flex-col items-center justify-center flex-grow p-8">
        <h1 className="text-3xl font-bold text-[#001F54] mb-8">Add Franchise Member</h1>

        {/* Option 1: Send Email Invite */}
        <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6 mb-6">
          <div
            className="flex items-center justify-between cursor-pointer border-b-2 border-yellow-500 pb-2 mb-4"
            onClick={() => setShowEmailInvite(!showEmailInvite)}
          >
            <h2 className="text-xl font-semibold text-[#001F54]">Option 1: Send Email Invite</h2>
            <svg
              className={`w-6 h-6 transform transition-transform duration-300 ${showEmailInvite ? 'rotate-180' : 'rotate-0'}`}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          {showEmailInvite && (
            <form onSubmit={handleInviteSubmit} className="space-y-4">
              <input
                type="email"
                placeholder="Enter email address"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                required
                className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 placeholder-gray-500"
              />
              <button
                type="submit"
                className="w-full py-2 px-4 bg-yellow-500 text-[#001F54] font-bold rounded-lg hover:bg-yellow-400 transition-colors"
              >
                Invite Franchise Member
              </button>
            </form>
          )}
        </div>

        {/* Option 2: Fill out Franchise Member Form */}
        <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
          <div
            className="flex items-center justify-between cursor-pointer border-b-2 border-yellow-500 pb-2 mb-4"
            onClick={() => setShowForm(!showForm)}
          >
            <h2 className="text-xl font-semibold text-[#001F54]">Option 2: Fill out Franchise Member Form</h2>
            <svg
              className={`w-6 h-6 transform transition-transform duration-300 ${showForm ? 'rotate-180' : 'rotate-0'}`}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          {showForm && (
            <div>
              <CreateCBOForm user={user}/>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddCBOPage;
