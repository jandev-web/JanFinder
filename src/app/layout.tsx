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
        <title>JanFinder - The Best Commercial Cleaning Quote Platform</title>
        <meta name="description" content="JanFinder offers the best commercial cleaning quotes and innovative tools for businesses and customers. Get quick and easy quotes today!" />
        <meta name="keywords" content="commercial cleaning, cleaning services, janitorial services, cleaning quotes, JanFinder" />
        <meta name="author" content="JanFinder Team" />
        <meta property="og:description" content="JanFinder connects cleaning companies and customers with fast, reliable quotes and innovative tools to streamline operations." />
        <meta property="twitter:description" content="Get quick and easy commercial cleaning quotes with JanFinder. Streamline your business or find the perfect cleaner today!" />

        <meta property="og:title" content="JanFinder - The Best Commercial Cleaning Quote Platform" />
        <meta property="og:site_name" content="Jan Finder" />
        <meta property="twitter:title" content="JanFinder - The Best Commercial Cleaning Quote Platform" />
        <meta property="twitter:site" content="@janfinder" />

        {/* Favicon Links */}
        <link rel="icon" href="/favicon.ico?v=2" type="image/x-icon" />
        <link rel="shortcut icon" href="/favicon.ico?v=2" type="image/x-icon" />
        <link rel="apple" href="/favicon.png" />
        <link rel="apple-touch-icon" href="/favicon.png" />
        <link rel="manifest" href="/site.webmanifest" />

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