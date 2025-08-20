
//src/app/layout.tsx
import '../styles/globals.css';
import { Inter } from "next/font/google";
import Providers from "../components/providers"
import { initAmplifyServer } from '@/amplify/init.server';
import { metadata } from './metadata'; // Import the metadata
initAmplifyServer();


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
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
