'use client';
import React from 'react';

function MemberLoadingScreen() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-green-100">
            <div className="flex flex-col items-center space-y-4">
                {/* Logo or Spinner */}
                <div className="flex justify-center mt-6">
                    <div className="relative w-64 h-64 rounded-full p-1 bg-gradient-to-r from-green-700 via-yellow-400 to-yellow-200 animate-spin-slow">
                        <div className="w-full h-full bg-gray-100 p-1 rounded-full animate-reverse-spin-slow">
                            <img
                                src="/images/singleJan.jpeg"
                                alt="Cleaning janitor"
                                className="w-full h-full object-cover rounded-full shadow-lg"
                            />
                        </div>
                    </div>
                </div>

                {/* Loading Text */}
                <h2 className="text-2xl font-semibold text-green-800">Loading Members Page...</h2>

                {/* Subtle animated dots */}
                <div className="flex space-x-2">
                    <div className="w-2.5 h-2.5 bg-green-600 rounded-full animate-bounce"></div>
                    <div className="w-2.5 h-2.5 bg-yellow-400 rounded-full animate-bounce200"></div>
                    <div className="w-2.5 h-2.5 bg-green-600 rounded-full animate-bounce400"></div>
                </div>
            </div>
        </div>
    );
}

export default MemberLoadingScreen;
