'use client';

import React from 'react';

const OwnerToolsQuestions: React.FC = () => {
  const questions = [
    {
      question: 'What tools are available to manage my leads?',
      answer:
        'JanFinder provides a comprehensive dashboard where you can manage leads, track progress, and communicate with potential clients seamlessly.',
    },
    {
      question: 'Can I generate custom quotes for my customers?',
      answer:
        'Yes, our tools allow you to create tailored quotes based on your customers’ unique requirements and specifications.',
    },
    {
      question: 'How do I track my bids?',
      answer:
        'The bid tracking feature lets you monitor the status of all your bids in real-time, ensuring transparency and control.',
    },
    {
      question: 'Are these tools easy to use?',
      answer:
        'Absolutely! JanFinder’s tools are designed with simplicity and efficiency in mind, even for users with minimal technical experience.',
    },
    {
      question: 'Can I access these tools on the go?',
      answer:
        'Yes, JanFinder’s platform is mobile-friendly, so you can manage your business anytime, anywhere.',
    },
  ];

  return (
    <section className="relative bg-gradient-to-br from-[#003a85] to-[#001F54] text-yellow-200 shadow-2xl rounded-xl p-10 overflow-hidden">
      <h2 className="text-4xl font-extrabold text-center mb-8 tracking-wide uppercase drop-shadow-lg">
        Business Tools You Need
      </h2>

      <div className="space-y-6">
        {questions.map((item, index) => (
          <div
            key={index}
            className="bg-[#001F54] p-6 rounded-lg shadow-md border-l-4 border-yellow-400 hover:bg-yellow-300 hover:text-[#001F54] transition-transform transform hover:scale-105"
          >
            <h3 className="text-2xl font-semibold">{item.question}</h3>
            <p className="mt-3 text-lg">{item.answer}</p>
          </div>
        ))}
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-[-40px] left-[-40px] w-32 h-32 bg-yellow-400 rounded-full shadow-xl opacity-25 animate-spin-slow"></div>
      <div className="absolute bottom-[-50px] right-[-50px] w-48 h-48 bg-yellow-500 rounded-full shadow-lg opacity-40 animate-bounce"></div>
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-300 to-yellow-500"></div>
    </section>
  );
};

export default OwnerToolsQuestions;
