'use client';

import React from 'react';

function Footer() {
  return (
    <footer className="bg-gradient-to-r from-[#001F54] to-[#003a85] text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-between">
          {/* Company Information */}
          <div className="w-full md:w-1/3 mb-6 md:mb-0">
            <h3 className="text-lg text-yellow-400 font-bold mb-2">JanFinder</h3>
            <p className="text-sm">
              The Number One Quote Bidding Platform. Coming Soon!
            </p>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-8 text-center border-t border-yellow-400 pt-4">
          <p className="text-sm">&copy; 2024 JanFinder. All rights reserved.</p>
          <p className="text-sm">&copy; Created by Synergy Technology Developers LLC</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
