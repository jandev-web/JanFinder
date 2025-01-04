'use client';

import React from 'react';

function OwnerFooter() {
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
                            <li><a href="/forgot-password" className="hover:underline">Forgot Password</a></li>
                            <li><a href="/members/sign-up" className="hover:underline">Sign Up</a></li>
                            <li><a href="/help" className="hover:underline">Help</a></li>
                            <li><a href="/faq" className="hover:underline">FAQ</a></li>
                            <li><a href="/contact" className="hover:underline">Contact Us</a></li>
                        </ul>
                    </div>

                    {/* Social Media Links */}
                    <div className="w-full md:w-1/3">
                        <h3 className="text-lg font-bold mb-2">Follow Us</h3>
                        <ul className="flex space-x-4">
                            <li>
                                <a href="#" className="hover:opacity-75 transition">
                                    <i className="fab fa-facebook-f text-white text-lg"></i>
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:opacity-75 transition">
                                    <i className="fab fa-twitter text-white text-lg"></i>
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:opacity-75 transition">
                                    <i className="fab fa-instagram text-white text-lg"></i>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Footer Bottom */}
                <div className="mt-8 text-center border-t border-yellow-400 pt-4">
                    <p className="text-sm">&copy; 2024 JanFinder. All rights reserved.</p>
                    <p className="text-sm">&copy; Created by Synergy Technology Developers.</p>
                </div>
            </div>
        </footer>
    );
}

export default OwnerFooter;