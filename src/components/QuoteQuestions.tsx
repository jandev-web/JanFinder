'use client';

import React from 'react';

const QuoteQuestions: React.FC = () => {
  const questions = [
    {
      question: 'What details are required for a quote?',
      answer:
        'You will need to provide the building type, size (square footage), frequency of cleaning, and any specific services required.',
    },
    {
      question: 'Are quotes binding?',
      answer:
        'No, quotes are not binding. They are intended to give you an estimate based on the provided details.',
    },
    {
      question: 'How long are quotes valid?',
      answer:
        'Quotes are valid for up to 30 days, giving you ample time to make a decision.',
    },
    {
      question: 'Can I edit my quote details?',
      answer:
        'Yes, you can update your information and request a new quote at any time.',
    },
    {
      question: 'Are quotes personalized?',
      answer:
        'Absolutely! Each quote is tailored specifically to your requirements to ensure accuracy and transparency.',
    },
  ];

  return (
    <section className="relative bg-yellow-300 text-[#001F54] shadow-2xl rounded-xl p-10 overflow-hidden">
      <h2 className="text-4xl font-extrabold text-center mb-8 drop-shadow-lg uppercase tracking-widest">
        Quotes Simplified
      </h2>

      <div className="space-y-6">
        {questions.map((item, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-lg shadow-md border-l-4 border-[#001F54] hover:scale-[1.03] transition-transform duration-300 hover:shadow-xl"
          >
            <h3 className="text-2xl font-bold mb-2">{item.question}</h3>
            <p className="text-lg">{item.answer}</p>
          </div>
        ))}
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-[-50px] left-[-50px] w-40 h-40 bg-[#001F54] rounded-full shadow-xl opacity-20"></div>
      <div className="absolute bottom-[-60px] right-[-60px] w-48 h-48 bg-yellow-400 rounded-full shadow-lg opacity-50"></div>
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#001F54] to-[#003a85]"></div>
    </section>
  );
};

export default QuoteQuestions;
