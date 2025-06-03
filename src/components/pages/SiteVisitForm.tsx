'use client';

import React, { useEffect, useState } from 'react';
import getQuoteDetails from '@/utils/getQuoteDetails';

interface Room {
  roomName: string;
  sqft: number;
}

interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

interface CustomerData {
  firstName: string;
  lastName: string;
  company: string;
  email: string;
  phone: string;
  address: Address;
}

interface QuoteInfo {
  roomTypes?: Record<string, number>;
  selectedRooms?: string[];
  // other quote-specific fields if needed
}

interface SiteVistFormProps {
  user: any;
  quoteID: any;
}

const SiteVistForm: React.FC<SiteVistFormProps> = ({ user, quoteID }) => {
  const [customerData, setCustomerData] = useState<CustomerData | null>(null);
  const [quoteInfo, setQuoteInfo] = useState<QuoteInfo | null>(null);
  const [roomInfo, setRoomInfo] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [verified, setVerified] = useState<Record<string, boolean>>({});

  // Helper to format the address as a single string
  const formatAddress = (addr: Address) =>
    `${addr.street}, ${addr.city}, ${addr.state} ${addr.postalCode}, ${addr.country}`;

  useEffect(() => {
    async function fetchQuote() {
      try {
        const data = await getQuoteDetails(quoteID);
        // Set customer info
        setCustomerData(data.customerData);
        // Set raw quoteInfo
        setQuoteInfo(data.quoteInfo);

        // Normalize rooms list
        console.log(data)
        const rawTypes = data.quoteInfo.roomTypes || {};
        console.log(rawTypes)
        let roomsArray: Room[] = [];
        if (Array.isArray(data.quoteInfo.selectedRooms)) {
          roomsArray = data.quoteInfo.selectedRooms.map((name: string) => ({
            roomName: name,
            sqft: Number(rawTypes[name] || 0),
          }));
        } else {
          roomsArray = Object.entries(rawTypes).map(([name, sqft]) => ({
            roomName: name,
            sqft: Number(sqft),
          }));
        }
        console.log(roomsArray)
        setRoomInfo(roomsArray);

        // Initialize verification state
        const initVer: Record<string, boolean> = {};
        ['firstName', 'lastName', 'address', 'email', 'phone', 'company'].forEach(
          (f) => (initVer[f] = false)
        );
        roomsArray.forEach((_, idx) => (initVer[`room-${idx}`] = false));
        setVerified(initVer);
      } catch (e) {
        console.error(e);
        setError('Failed to load quote details.');
      } finally {
        setLoading(false);
      }
    }
    fetchQuote();
  }, [quoteID]);

  const handleCheckbox = (key: string) => {
    setVerified((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const allChecked =
    Object.keys(verified).length > 0 && Object.values(verified).every(Boolean);

  const handleConfirm = () => {
    console.log(`User ${user.ID || user} confirmed quote ${quoteID}`);
    alert('Thank you! All fields have been verified.');
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!customerData || !quoteInfo) return null;

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">Verify Site Visit Details</h2>
      <form>
        {(['firstName', 'lastName', 'company', 'email', 'phone', 'address'] as const).map(
          (field) => {
            let value = '';
            if (field === 'address') {
              value = formatAddress(customerData.address);
            } else {
              value = (customerData as any)[field] || '';
            }
            const label =
              field === 'firstName'
                ? 'First Name'
                : field === 'lastName'
                ? 'Last Name'
                : field.charAt(0).toUpperCase() + field.slice(1);

            return (
              <div key={field} className="flex items-center mb-4">
                <label className="w-32 font-medium">{label}:</label>
                <input
                  type="text"
                  value={value}
                  readOnly
                  className="flex-1 border rounded p-2 mr-4 bg-gray-50"
                />
                <input
                  type="checkbox"
                  checked={!!verified[field]}
                  onChange={() => handleCheckbox(field)}
                  className="h-5 w-5"
                />
              </div>
            );
          }
        )}

        <div className="mb-6">
          <h3 className="font-medium mb-2">Rooms</h3>
          {roomInfo.map((room, idx) => (
            <div key={idx} className="flex items-center mb-2">
              <span className="flex-1">
                {room.roomName} — {room.sqft} sqft
              </span>
              <input
                type="checkbox"
                checked={!!verified[`room-${idx}`]}
                onChange={() => handleCheckbox(`room-${idx}`)}
                className="h-5 w-5"
              />
            </div>
          ))}
        </div>

        <button
          type="button"
          disabled={!allChecked}
          onClick={handleConfirm}
          className={`
            w-full py-2 rounded font-semibold transition
            ${allChecked
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-300 text-gray-600 cursor-not-allowed'}
          `}
        >
          Confirm
        </button>
      </form>
    </div>
  );
};

export default SiteVistForm;
