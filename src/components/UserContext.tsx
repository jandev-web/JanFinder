import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import CryptoJS from 'crypto-js';

interface UserContextProps {
  attributes: any;
  setAttributes: (attributes: any) => void;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

const SECRET_KEY = 'mySuperSecretKey123'; // Replace with a more secure key

// Function to encrypt data
const encryptData = (data: any) => {
  return CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString();
};

// Function to decrypt data
const decryptData = (cipherText: string) => {
  const bytes = CryptoJS.AES.decrypt(cipherText, SECRET_KEY);
  const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
  return JSON.parse(decryptedData);
};

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [attributes, setUserState] = useState<any>(null);
  //console.log('The context user is', attributes)
  useEffect(() => {
    // When the component mounts, check if the user is already saved in sessionStorage
    const encryptedUser = sessionStorage.getItem('attributes');
    if (encryptedUser) {
      try {
        const decryptedUser = decryptData(encryptedUser); // Decrypt the user data
        setUserState(decryptedUser);
      } catch (error) {
        console.error('Error decrypting user data', error);
      }
    }
  }, []);

  const setAttributes = (attributes: any) => {
    if (attributes) {
      const encryptedUser = encryptData(attributes); // Encrypt the user data
      sessionStorage.setItem('attributes', encryptedUser); // Store encrypted data in sessionStorage
    } else {
      sessionStorage.removeItem('attributes'); // Remove data from sessionStorage if user is logged out
    }
    setUserState(attributes);
  };

  return (
    <UserContext.Provider value={{ attributes, setAttributes }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
