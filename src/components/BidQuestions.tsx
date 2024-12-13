'use client';

import React from 'react';

const BidQuestions: React.FC = () => {
  const questions = [
    {
      question: 'How does the bidding process work?',
      answer:
        'The bidding process allows cleaning companies to compete for your job by submitting their best offers. You review the bids and choose the one that suits your needs.',
    },
    {
      question: 'What happens if I win a bid?',
      answer:
        'If you win a bid, you will be notified immediately. You can then contact the customer to finalize the details and begin the service.',
    },
    {
      question: 'Can I view bid statuses?',
      answer:
        'Yes, you can track the status of all your bids in real-time from your dashboard.',
    },
    {
      question: 'Is there a time limit for bids?',
      answer:
        'Yes, bids typically have a set expiration time to ensure timely decisions.',
    },
    {
      question: 'Can I modify a submitted bid?',
      answer:
        'Yes, you can adjust your bid before the expiration time if needed.',
    },
  ];

  return (
    <section className="relative bg-yellow-400 text-[#001F54] shadow-2xl rounded-xl p-10 overflow-hidden">
      <h2 className="text-4xl font-extrabold text-center mb-8 uppercase tracking-wide drop-shadow-md">
        Bidding Process Explained
      </h2>

      <div className="space-y-6">
        {questions.map((item, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-lg shadow-md border-l-4 border-[#001F54] hover:bg-[#001F54] hover:text-yellow-400 transition-transform transform hover:scale-105"
          >
            <h3 className="text-2xl font-semibold">{item.question}</h3>
            <p className="mt-3 text-lg">{item.answer}</p>
          </div>
        ))}
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-[-40px] left-[-40px] w-40 h-40 bg-[#001F54] rounded-full shadow-xl opacity-25 animate-bounce"></div>
      <div className="absolute bottom-[-50px] right-[-50px] w-48 h-48 bg-[#003a85] rounded-full shadow-lg opacity-40 animate-pulse"></div>
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#001F54] to-[#003a85]"></div>
    </section>
  );
};

export default BidQuestions;
