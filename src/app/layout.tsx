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
        {/* Favicon Links */}
        <link rel="icon" href="/favicon.ico?v=2" type="image/x-icon" />
        <link rel="shortcut icon" href="/favicon.ico?v=2" type="image/x-icon" />
        <link rel="apple-touch-icon" href="/favicon.png" />
        {/* Meta Tags for Browsers */}
        <meta name="theme-color" content="#001F54" />
        <meta name="msapplication-TileColor" content="#001F54" />
        <meta name="msapplication-TileImage" content="/favicon.png" />
      </head>
      <body className={`${inter.className} w-full`}>
        <ConfigureAmplifyClientSide />
        {children}
      </body>
    </html>
  );
}