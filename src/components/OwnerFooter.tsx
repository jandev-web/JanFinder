// components/OwnerFooter.tsx
import Link from 'next/link';

export default function OwnerFooter() {
  return (
    <footer className="bg-gradient-to-r from-[#001F54] to-[#003a85] text-white text-xs fixed bottom-0 w-full py-2">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex space-x-4">
          <Link href="/" className="text-yellow-400 font-bold hover:underline">Bid2Clean</Link>
          <Link href="/help" className="hover:underline">Help</Link>
          <Link href="/privacy" className="hover:underline">Privacy</Link>
          <Link href="/cookies" className="hover:underline">Cookies</Link>
        </div>
        <div>
          <p>
            &copy; {new Date().getFullYear()} Bid2Clean. All rights reserved. Created by Synergy Technology Developers.
          </p>
        </div>
      </div>
    </footer>
  );
}
