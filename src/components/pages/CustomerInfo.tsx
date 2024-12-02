// CustomerInfo.tsx
import React, { useState, useEffect } from 'react';
import AddressForm from '@/components/AddressForm';
import { startQuote } from '../../utils/startQuote';
import { useRouter } from 'next/navigation';
import QuoteProgressBar from '../QuoteProgressBar';
const CustomerInfo: React.FC = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);
  const router = useRouter();
  const memberMade = false
  const confirmed = 'false'
  const cbo = 'None'
  const franchise = 'None'
  const facilityType = 'None'
  const validateEmail = (email: string) => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);

  const formatPhoneNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length <= 3) return `(${cleaned}`;
    if (cleaned.length <= 6) return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedPhone = formatPhoneNumber(e.target.value);
    setPhone(formattedPhone);
  };

  useEffect(() => {
    const isValid =
      Boolean(firstName.trim()) &&
      Boolean(lastName.trim()) &&
      validateEmail(email) &&
      phone.length === 14 && // Ensure phone is fully formatted as (###)-###-####
      Boolean(company.trim()) &&
      Boolean(street.trim()) &&
      Boolean(city.trim()) &&
      Boolean(state.trim()) &&
      Boolean(postalCode.trim()) &&
      Boolean(country.trim());

    setIsFormValid(isValid);
  }, [firstName, lastName, email, phone, company, street, city, state, postalCode, country]);

  const handleAddressChange = (field: string, value: string) => {
    switch (field) {
      case 'street':
        setStreet(value);
        break;
      case 'city':
        setCity(value);
        break;
      case 'state':
        setState(value);
        break;
      case 'postalCode':
        setPostalCode(value);
        break;
      case 'country':
        setCountry(value);
        break;
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const address =
    {
      'street': street,
      'city': city,
      'state': state,
      'postalCode': postalCode,
      'country': country
    }


    try {
      const result = await startQuote(firstName, lastName, email, phone, company, address, confirmed, facilityType, franchise, cbo, memberMade);
      router.push(`/quote?quoteID=${result.quoteID}`);
    } catch (error) {
      console.error('Error creating quote:', error);
    }
  };

  return (
    <div
      className="min-h-screen bg-cover pt-20 pb-20 bg-center flex flex-col items-center justify-center"
      style={{ backgroundImage: "url('/images/customerInfoPic.jpeg')" }}
    >
      <QuoteProgressBar stepNumber={1} />
      {/* Message About the First Step */}
      <div className="bg-[#001F54] pt-6 text-white p-6 rounded-lg shadow-lg mb-8 max-w-2xl text-center">
        <h1 className="text-3xl font-bold mb-2">Step 1: Customer Information</h1>
        <p className="text-lg">
          To get your personalized quote, we first need some basic information
          about you. This will take just a few seconds!
        </p>
      </div>

      {/* Form Section */}
      <div className="bg-gradient-to-b from-white via-gray-100 to-gray-200 p-10 rounded-2xl shadow-2xl max-w-2xl mx-auto border-t-4 border-b-4 border-yellow-500">
        <h2 className="text-4xl font-extrabold text-[#001F54] mb-8 text-center">
          Customer Information
        </h2>

        <form className="space-y-8" onSubmit={handleSubmit}>
          {/* Contact Information Section */}
          <div>
            <h3 className="text-2xl font-semibold text-[#001F54] border-b-2 border-yellow-500 inline-block pb-1 mb-6">
              Contact Information
            </h3>
            <input
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 mb-4 placeholder-gray-500"
            />
            <input
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 mb-4 placeholder-gray-500"
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 mb-4 placeholder-gray-500"
            />
            <input
              type="tel"
              placeholder="Phone (###)-###-####"
              value={phone}
              onChange={handlePhoneChange}
              required
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 mb-4 placeholder-gray-500"
            />
            <input
              type="text"
              placeholder="Company"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              required
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 mb-4 placeholder-gray-500"
            />
          </div>

          {/* Address Form Section */}
          <AddressForm
            street={street}
            city={city}
            state={state}
            postalCode={postalCode}
            country={country}
            onAddressChange={handleAddressChange}
          />

          {/* Submit Button */}
          {isFormValid && (
            <button
              type="submit"
              className="w-full bg-yellow-500 text-white p-4 rounded-xl font-extrabold text-xl hover:text-yellow-500 hover:bg-[#001F54] transition duration-300"
            >
              Start the Bidding War
            </button>
          )}
        </form>
      </div>
    </div>




  );
};

export default CustomerInfo;
