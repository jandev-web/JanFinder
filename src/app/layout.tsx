'use client';


import { Inter } from "next/font/google";
import '@/styles/globals.css';

import { UserProvider } from '@/components/UserContext'; // Import the UserProvider
import { Amplify } from 'aws-amplify';
import awsExports from '@/aws-exports'; // Import your Amplify configuration

// Configure Amplify client-side only
if (typeof window !== "undefined") {
  Amplify.configure(awsExports);
}
const inter = Inter({ subsets: ["latin"] })



export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="w-full">
        <UserProvider> 
          {children}
        </UserProvider>
      </body>
    </html>
  );
}
