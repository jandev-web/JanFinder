// CustomerInfo.tsx

'use client';

import React, { useState, useEffect } from 'react';
import AddressForm from '@/components/AddressForm';
import { updateCustomerInfo } from '@/utils/updateCustomerInfo'
import LoadingSpinner from '../loadingScreen';

interface CustomerInfoProps {
  quoteID: any;
  customerDetails: any;
  onNextStep: (stepNumber: number) => void;
  onMoveOn: (moveOn: boolean) => void;
  onChangeInfo: (newInfo: any) => void;
}

const CustomerInfo: React.FC<CustomerInfoProps> = ({ quoteID, customerDetails, onNextStep, onMoveOn, onChangeInfo }) => {
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
  const [loading, setLoading] = useState(true);
  const [originalInfo, setOriginalInfo] = useState<any>(customerDetails)

  console.log(customerDetails)

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
    setLoading(true);
    if (quoteID) {
      if (customerDetails) {
        
        setFirstName(customerDetails.firstName)
        setLastName(customerDetails.lastName)
        setEmail(customerDetails.email)
        setPhone(customerDetails.phone)
        setCompany(customerDetails.company)
        const customerAddress = customerDetails.address
        setStreet(customerAddress.street)
        setCity(customerAddress.city)
        setState(customerAddress.state)
        setPostalCode(customerAddress.postalCode)
        setCountry(customerAddress.country)
      }

    }

    setLoading(false);

  }, [quoteID]);

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

  const normalizeCustomerInfo = (info: any) => ({
    
    firstName: info.firstName || "",
    lastName: info.lastName || "",
    email: info.email || "",
    phone: info.phone || "",
    company: info.company || "",
    address: {
      street: info.address?.street || "",
      city: info.address?.city || "",
      state: info.address?.state || "",
      postalCode: info.address?.postalCode || "",
      country: info.address?.country || ""
    }
  });
  
  const hasChanged = () => {
    console.log("Original Info:", originalInfo);
    
    const normalizedOriginal = normalizeCustomerInfo(originalInfo);
    const normalizedNew = {
      firstName,
      lastName,
      email,
      phone,
      company,
      address: { street, city, state, postalCode, country }
    };
    console.log("Normalized Original:", normalizedOriginal);
    console.log("Normalized New:", normalizedNew);
    const result =
      JSON.stringify(normalizedOriginal) !== JSON.stringify(normalizedNew);
    console.log("Has Changed:", result);
    return result;
  };

  useEffect(() => {
    const didChange = hasChanged()
    
    if (isFormValid && !didChange) {
      onMoveOn(true)
    }

    

  }, [isFormValid]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    const address =
    {
      'street': street,
      'city': city,
      'state': state,
      'postalCode': postalCode,
      'country': country
    }


    try {
      const result = await updateCustomerInfo(quoteID, firstName, lastName, email, phone, company, address);
      const newDetails = {
        firstName,
        lastName,
        email,
        phone,
        company,
        address
      }
      onChangeInfo(newDetails);
      console.log(result)
      onNextStep(1)
    } catch (error) {
      console.error('Error creating quote:', error);
    }
  };



  if (loading) {
    return <LoadingSpinner />;
  }

 

  return (
    <div>


      {/* Message About the First Step */}
      <div className="bg-[#001F54] text-white p-8 rounded-md shadow-lg max-w-2xl text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Step <span className='text-yellow-500'>1</span>: Customer Information</h1>
        <p className="text-xl">
          To get your personalized quote, we first need some basic information about you.
          This will only take a few seconds.
        </p>
      </div>

      {/* Form Section */}
      <div className="bg-gradient-to-br from-white to-gray-200 p-10 rounded-xl shadow-2xl max-w-2xl w-full border border-yellow-500">
        <h2 className="text-4xl font-extrabold text-[#001F54] text-center mb-8">
          Customer Information
        </h2>
        <form className="space-y-6" onSubmit={handleSubmit}>

          {/* Contact Information Section */}
          <div>
            <h3 className="text-2xl font-semibold text-[#001F54] border-b border-yellow-500 pb-2 mb-6 inline-block">
              Contact Information
            </h3>
            <input
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 mb-4 placeholder-gray-400"
            />
            <input
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 mb-4 placeholder-gray-400"
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 mb-4 placeholder-gray-400"
            />
            <input
              type="tel"
              placeholder="Phone (###)-###-####"
              value={phone}
              onChange={handlePhoneChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 mb-4 placeholder-gray-400"
            />
            <input
              type="text"
              placeholder="Company"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 mb-4 placeholder-gray-400"
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
          {(isFormValid && hasChanged()) && (
            <button
              type="submit"
              className="w-full py-4 bg-yellow-500 text-white font-extrabold text-xl rounded-md shadow-md hover:bg-[#001F54] transition duration-300"
            >
              Submit
            </button>
          )}
        </form>
      </div>
    </div>





  );
};

export default CustomerInfo;
