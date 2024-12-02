'use client';

import React from 'react';

function Contact() {
  return (
    <div className="bg-gray-100 py-12 px-6 flex flex-col items-center">
      <div className="max-w-md w-full text-center bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-3xl font-bold text-green-600 mb-4">Contact Us</h2>
        <p className="text-gray-700 mb-4">For more information or to book a service, please contact us at:</p>
        <div className="text-lg">
          <p className="contact-info mb-2">
            <span className="font-semibold text-gray-900">Email: </span>
            <a href="mailto:info@cleaningcompany.com" className="text-blue-500 hover:underline">info@cleaningcompany.com</a>
          </p>
          <p className="contact-info">
            <span className="font-semibold text-gray-900">Phone: </span>
            <a href="tel:+1234567890" className="text-blue-500 hover:underline">(123) 456-7890</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Contact;
