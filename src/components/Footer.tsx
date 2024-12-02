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
              The Number One Quote Bidding Platform. Try it Today!
            </p>
          </div>

          {/* Quick Links */}
          <div className="w-full md:w-1/3 mb-6 md:mb-0">
            <h3 className="text-lg font-bold mb-2">Quick Links</h3>
            <ul className="text-sm space-y-2">
              <li><a href="/about" className="hover:underline">About Us</a></li>
              <li><a href="/services" className="hover:underline">Services</a></li>
              <li><a href="/contact" className="hover:underline">Contact</a></li>
              <li><a href="/faq" className="hover:underline">FAQ</a></li>
            </ul>
          </div>

          {/* Social Media Links */}
          <div className="w-full md:w-1/3">
            <h3 className="text-lg font-bold mb-2">Follow Us</h3>
            <ul className="flex space-x-4">
              {/* Facebook SVG */}
              <li>
                <a href="#" className="hover:opacity-75 transition">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" width="24" height="24" fill="white">
                    <path d="M279.14 288l14.22-92.66h-88.91V134.31c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S259.12 0 225.36 0C141.09 0 89.09 54.42 89.09 128.21v67.13H0v92.66h89.09V512h107.88V288z"/>
                  </svg>
                </a>
              </li>

              {/* Twitter SVG */}
              <li>
                <a href="#" className="hover:opacity-75 transition">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="24" height="24" fill="white">
                    <path d="M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558A296.77 296.77 0 0 1 0 410.602a218.548 218.548 0 0 0 25.838 1.464 209.58 209.58 0 0 0 129.872-44.843 104.72 104.72 0 0 1-97.784-72.772c14.086 2.126 28.498 2.126 42.584-.862a104.65 104.65 0 0 1-83.958-102.718v-1.465a104.46 104.46 0 0 0 47.293 13.066A104.702 104.702 0 0 1 35.248 97.92a296.13 296.13 0 0 0 214.216 108.92 117.835 117.835 0 0 1-2.599-23.894 104.716 104.716 0 0 1 104.715-104.715c30.173 0 57.38 12.726 76.416 33.137a209.08 209.08 0 0 0 66.417-25.346 104.403 104.403 0 0 1-46.03 57.665 209.94 209.94 0 0 0 60.08-16.326 224.935 224.935 0 0 1-52.33 54.16z"/>
                  </svg>
                </a>
              </li>

              {/* Instagram SVG */}
              <li>
                <a href="#" className="hover:opacity-75 transition">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="24" height="24" fill="white">
                    <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9S160.5 370.9 224.1 370.9 339 319.6 339 255.9 287.7 141 224.1 141zm146.4-194.3c0 14.9-12 26.9-26.9 26.9h-53.6c-14.9 0-26.9-12-26.9-26.9v-53.6c0-14.9 12-26.9 26.9-26.9h53.6c14.9 0 26.9 12 26.9 26.9v53.6zM398.8 76.3C384.8 54.7 362 42 336.6 42h-225C70.2 42 47.4 54.7 33.4 76.3 21.8 96 16 119.8 16 145.2v225c0 25.4 5.8 49.2 17.4 68.9 14 21.6 36.8 34.3 62.2 34.3h225c25.4 0 49.2-12.7 62.2-34.3 11.6-19.7 17.4-43.5 17.4-68.9v-225c0-25.4-5.8-49.2-17.4-68.9zM398.8 370c0 16.5-3.6 31.9-10.7 43.6-8.4 14.2-23.2 22.4-40.9 22.4h-225c-17.7 0-32.5-8.2-40.9-22.4-7.1-11.7-10.7-27.1-10.7-43.6v-225c0-16.5 3.6-31.9 10.7-43.6C100.4 90.2 115.2 82 132.9 82h225c17.7 0 32.5 8.2 40.9 22.4 7.1 11.7 10.7 27.1 10.7 43.6v225z"/>
                  </svg>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-8 text-center border-t border-yellow-400 pt-4">
          <p className="text-sm">&copy; 2024 JanFinder. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
