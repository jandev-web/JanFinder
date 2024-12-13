'use client';

import React from 'react';

const GuarenteeQuestions: React.FC = () => {
  const questions = [
    {
      question: 'What is the JanFinder guarantee?',
      answer:
        'The JanFinder guarantee ensures you receive top-quality service from trusted cleaning companies. If expectations are not met, we’ll assist in finding a resolution.',
    },
    {
      question: 'Do you guarantee satisfaction?',
      answer:
        'Yes! Your satisfaction is our top priority. JanFinder ensures you work with reliable companies who stand behind their services.',
    },
    {
      question: 'How are disputes handled?',
      answer:
        'Disputes are handled with utmost care. Contact our support team, and we’ll mediate to find a fair resolution for both parties.',
    },
    {
      question: 'Is there a refund policy?',
      answer:
        'Refunds are evaluated on a case-by-case basis depending on the circumstances. Our team is here to help!',
    },
    {
      question: 'How do you ensure company reliability?',
      answer:
        'We vet all cleaning companies for quality and reliability before allowing them to bid on jobs through JanFinder.',
    },
  ];

  return (
    <section className="relative bg-gradient-to-r from-yellow-400 to-yellow-300 text-[#001F54] shadow-2xl rounded-xl p-10 overflow-hidden">
      <h2 className="text-4xl font-extrabold text-center mb-8 uppercase tracking-widest drop-shadow-md">
        The JanFinder Guarantee
      </h2>

      <div className="space-y-6">
        {questions.map((item, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-lg shadow-md border-l-4 border-[#001F54] hover:bg-[#001F54] hover:text-yellow-300 transition-transform transform hover:scale-[1.05]"
          >
            <h3 className="text-2xl font-semibold">{item.question}</h3>
            <p className="mt-3 text-lg">{item.answer}</p>
          </div>
        ))}
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-[-30px] right-[-30px] w-40 h-40 bg-[#001F54] rounded-full shadow-xl opacity-20 animate-bounce"></div>
      <div className="absolute bottom-[-50px] left-[-50px] w-48 h-48 bg-yellow-500 rounded-full shadow-lg opacity-40 animate-pulse"></div>
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#001F54] to-[#003a85]"></div>
    </section>
  );
};

export default GuarenteeQuestions;
