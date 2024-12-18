

import '@/styles/globals.css';
import { Inter } from "next/font/google";


import { metadata } from './metadata'; // Import the metadata
import "@aws-amplify/ui-react/styles.css";

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
        <link rel="icon" href="/favicon.ico?v=2" type="image/x-icon" />
      </head>
      <body className={`${inter.className} w-full`}>
        <ConfigureAmplifyClientSide />
        {children}
      </body>
    </html>
  );
}
