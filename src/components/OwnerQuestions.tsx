'use client';

import React from 'react';

const OwnerQuestions: React.FC = () => {
  const questions = [
    {
      question: 'How do I sign up as an owner?',
      answer:
        'You can sign up as a franchise owner by visiting the "For Business Owners" page and following the registration process.',
    },
    {
      question: 'What are the benefits of using Bid2Clean?',
      answer:
        'Bid2Clean helps you generate more leads, simplify your quoting process, and connect with customers actively seeking cleaning services.',
    },
    {
      question: 'Are there tools to help me manage my cleaning business?',
      answer:
        'Yes, we provide tools for lead management, quote generation, bid tracking, and performance analytics to streamline your operations.',
    },
    {
      question: 'Can I customize quotes for my customers?',
      answer:
        'Absolutely! You can tailor quotes based on customer requirements directly from your dashboard.',
    },
    {
      question: 'What kind of support is available for franchise owners?',
      answer:
        'We offer dedicated support, tutorials, and resources to help you make the most of Bid2Clean’s platform.',
    },
  ];

  return (
    <section className="relative bg-[#001F54] text-yellow-200 shadow-xl rounded-lg p-8 border-4 border-yellow-400">
      <h2 className="text-4xl font-bold text-center mb-6 uppercase tracking-wide">
        Empowering Franchise Owners
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {questions.map((item, index) => (
          <div
            key={index}
            className="bg-[#003a85] p-6 rounded-xl shadow-lg border border-yellow-400 transition-transform transform hover:-translate-y-2 hover:scale-105"
          >
            <h3 className="text-2xl font-semibold text-yellow-300">
              {item.question}
            </h3>
            <p className="mt-3 text-lg text-yellow-100">{item.answer}</p>
          </div>
        ))}
      </div>

      {/* Decorative Wave */}
      <div className="absolute top-0 left-0 w-full h-12 bg-yellow-400 rounded-b-full"></div>
      <div className="absolute bottom-[-20px] right-[-30px] w-28 h-28 bg-yellow-300 rounded-full shadow-lg animate-spin-slow"></div>
    </section>
  );
};

export default OwnerQuestions;
