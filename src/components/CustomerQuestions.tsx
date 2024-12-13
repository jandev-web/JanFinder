'use client';

import React from 'react';

const CustomerQuestions: React.FC = () => {
  const questions = [
    {
      question: 'How do I get a cleaning quote?',
      answer:
        'You can easily get a cleaning quote by clicking on "Get Your Free Quote Now" and filling out a simple form with your building details.',
    },
    {
      question: 'What types of buildings do you service?',
      answer:
        'We service a wide range of commercial buildings, including offices, schools, medical facilities, retail stores, and more!',
    },
    {
      question: 'How long does it take to receive a quote?',
      answer:
        'Most quotes are generated instantly, but depending on the details, it may take up to 24 hours.',
    },
    {
      question: 'Can I compare multiple quotes?',
      answer:
        'Absolutely! JanFinder allows you to compare quotes from different cleaning companies side by side.',
    },
    {
      question: 'Is JanFinder free to use?',
      answer: 'Yes, JanFinder is completely free for customers to use!',
    },
  ];

  return (
    <section className="relative bg-gradient-to-tr from-yellow-300 to-yellow-400 text-[#001F54] shadow-xl rounded-lg p-8 hover:scale-[1.02] transition-transform duration-300">
      <h2 className="text-4xl font-extrabold text-center mb-6 drop-shadow-md">
        <span className="text-white bg-[#001F54] px-3 py-1 rounded-lg">
          For Customers
        </span>
      </h2>
      <div className="space-y-6">
        {questions.map((item, index) => (
          <div
            key={index}
            className="group bg-white p-6 rounded-lg shadow-md border border-[#001F54] hover:bg-yellow-200 transition-colors duration-300"
          >
            <h3 className="text-2xl font-bold group-hover:text-[#001F54]">
              {item.question}
            </h3>
            <p className="mt-2 text-lg text-[#003a85] group-hover:text-[#001F54]">
              {item.answer}
            </p>
          </div>
        ))}
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-[-20px] right-[-20px] w-16 h-16 bg-yellow-300 rounded-full shadow-lg animate-bounce"></div>
      <div className="absolute bottom-[-30px] left-[-30px] w-20 h-20 bg-yellow-500 rounded-full shadow-lg animate-pulse"></div>
    </section>
  );
};

export default CustomerQuestions;
