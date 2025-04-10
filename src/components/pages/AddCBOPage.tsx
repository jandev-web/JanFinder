import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import CreateCBOForm from '@/components/pages/AddCBOForm';
import { useRouter } from 'next/navigation';
import sendCBOInvite from '@/utils/sendCBOInvite';
import getFranchiseInfo from '@/utils/getFranchiseInfo'
import LoadingSpinner from '@/components/loadingScreen';
import CopyAccountNumber from '../AddCBOByFranNumber';
import InviteCBOSuccess from '../InviteCBOSuccess';
import createCBO from '@/utils/createCBO';
import checkUserPoolEmail from '@/utils/checkUserPoolEmail';
import AddFormSuccess from '../AddCBOFormSuccess';
interface AddCBOPageProps {
  user: any;
}

const AddCBOPage: React.FC<AddCBOPageProps> = ({ user }) => {
  const router = useRouter()
  const [showEmailInvite, setShowEmailInvite] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showAccountNumber, setShowAccountNumber] = useState(false);
  const [franchise, setFranchise] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);


  const [emailExists, setEmailExists] = useState(false);
  const [hasChecked, setHasChecked] = useState(false);

  const [inviteEmail, setInviteEmail] = useState('');

  const [inviteSuccess, setInviteSuccess] = useState(false);

  const [addFormSuccess, setAddFormSuccess] = useState(false)

  useEffect(() => {
    if (user) {
      const fetchFranchiseInfo = async () => {
        try {
          const franchiseInfo = await getFranchiseInfo(user.franchiseID);
          setFranchise(franchiseInfo);
        } catch (error) {
          console.error('Error fetching franchise info:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchFranchiseInfo();
    }
  }, [user]);

  const handleInviteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await sendCBOInvite(user?.OwnerID, inviteEmail);
      if (result) {
        // Show the success animation component

        setInviteSuccess(true);
        setInviteEmail('');
      }

    } catch (err) {
      console.error('Error sending invite:', err);
    }
  };

  const handleAnotherInvite = async () => {
    setInviteSuccess(false);
  };

  const handleAnotherAddForm = async () => {
    setAddFormSuccess(false);
  };

  const handleFormSubmit = async (cboData: any) => {
    setFormLoading(true);
    try {
      const result = await createCBO(cboData);
      if (result) {
        // Show the success animation component

        setAddFormSuccess(true);
      }
    } catch (err) {
      console.error('Error creating CBO:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailBlur = async () => {
    if (!inviteEmail) return;
    try {
      const response = await checkUserPoolEmail(inviteEmail);
      // Assume response shape: { exists: boolean }
      setEmailExists(response.exists);
      setHasChecked(true);
    } catch (err) {
      console.error('Error checking email:', err);
    }
  };

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inviteEmail);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen w-full bg-gray-100 overflow-x-hidden">
      {/* Banner with Back button */}
      <div className="bg-[#001F54] text-white py-2 px-4 flex items-center w-full">
        <Link href="/members/owner/cbos" className="flex items-center text-white hover:text-yellow-300">
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
        <h1 className="text-3xl font-bold text-[#001F54] mb-8">Add Member to {franchise.franchiseName}</h1>
        {inviteSuccess ? (
          <InviteCBOSuccess handleSubmitAction={handleAnotherInvite} />
        ) : (
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
                  onChange={(e) => {
                    setInviteEmail(e.target.value);
                    setEmailExists(false);
                  }}
                  onBlur={handleEmailBlur}
                  required
                  className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 placeholder-gray-500"
                />
                {isEmailValid && !emailExists && hasChecked ? (
                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-2 px-4 bg-yellow-500 text-[#001F54] font-bold rounded-lg hover:bg-yellow-400 transition-colors ${loading ? 'cursor-not-allowed opacity-50' : ''
                      }`}
                  >
                    {loading ? 'Submitting...' : 'Invite Franchise Member'}
                  </button>
                ) : (
                  <div className="w-full py-2 text-center text-gray-500">Please enter a valid email.</div>
                )}
              </form>
            )}
          </div>
        )}
        {/* Option 1: Send Email Invite */}


        {/* Option 2: Fill out Franchise Member Form */}
        {addFormSuccess ? (
          <AddFormSuccess handleSubmitAction={handleAnotherAddForm} />
        ) : (
          <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6 mb-6">
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
                <CreateCBOForm user={user} handleSubmitAction={handleFormSubmit} buttonMessage='Add Member'/>
              </div>
            )}
          </div>
        )}
        

        {/* Option 3: Add By FranchiseAccount# */}
        <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
          <div
            className="flex items-center justify-between cursor-pointer border-b-2 border-yellow-500 pb-2 mb-4"
            onClick={() => setShowAccountNumber(!showAccountNumber)}
          >
            <h2 className="text-xl font-semibold text-[#001F54]">Option 3: Add By Franchise Account#</h2>
            <svg
              className={`w-6 h-6 transform transition-transform duration-300 ${showAccountNumber ? 'rotate-180' : 'rotate-0'}`}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          {showAccountNumber && (
            <div>
              <CopyAccountNumber accountNumber={franchise.FranchiseAccountNumber} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddCBOPage;