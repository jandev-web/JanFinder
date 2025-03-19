'use client';

import React from 'react';

function OwnerFooter() {
  return (
    <footer className="bg-gradient-to-r from-[#001F54] to-[#003a85] text-white text-xs fixed bottom-0 w-full py-2">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex space-x-4">
          <a href="/" className="text-yellow-400 font-bold hover:underline">
            Bid2Clean
          </a>
          <a href="/help" className="hover:underline">
            Help
          </a>
          <a href="/privacy" className="hover:underline">
            Privacy
          </a>
          <a href="/cookies" className="hover:underline">
            Cookies
          </a>
        </div>
        <div>
          <p>&copy; 2024 Bid2Clean. All rights reserved. Created by Synergy Technology Developers.</p>
        </div>
      </div>
    </footer>
  );
}

export default OwnerFooter;
