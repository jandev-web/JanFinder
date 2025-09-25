
//src/app/layout.tsx
import '../styles/globals.css';
import { Inter } from "next/font/google";
import AmplifyClientProvider from './AmplifyClientProvider';
import { metadata } from './metadata'; // Import the metadata

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
      <body className={`${inter.className} bg-background text-foreground w-full`}>
        <AmplifyClientProvider>{children}</AmplifyClientProvider>
      </body>
    </html>
  );
}
