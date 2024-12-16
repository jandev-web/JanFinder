

import '@/styles/globals.css';
import { Inter } from "next/font/google";

import { Amplify } from 'aws-amplify';
import awsExports from '@/aws-exports'; // Import your Amplify configuration
import { metadata } from './metadata'; // Import the metadata
import "@aws-amplify/ui-react/styles.css";
import type { Metadata } from "next";

import ConfigureAmplifyClientSide from "@/components/ConfigureAmplify";

const inter = Inter({ subsets: ["latin"] });



export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>{metadata.title}</title>
        <link
          rel="icon"
          href="/icon?<generated>"
          type="image/<generated>"
          sizes="<generated>"
        />
      </head>
      <body className={`${inter.className} w-full`}>
        <ConfigureAmplifyClientSide />
        {children}
      </body>
    </html>
  );
}
