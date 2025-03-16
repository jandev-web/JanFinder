'use client';

import React from 'react';

const PriceToolQuestions: React.FC = () => {
  const questions = [
    {
      question: 'How do I use the pricing tool?',
      answer:
        'Simply enter your facility details, such as square footage and room types, and the tool will calculate a quote for you instantly.',
    },
    {
      question: 'What factors influence the price?',
      answer:
        'Prices are influenced by facility size, type of cleaning required, frequency of service, and any additional custom requests.',
    },
    {
      question: 'Are there any hidden costs?',
      answer:
        'No, Bid2Clean ensures complete transparency. All costs are clearly outlined in your quote.',
    },
    {
      question: 'Can I customize the pricing for specific needs?',
      answer:
        'Yes, our pricing tool allows you to adjust parameters to fit your unique requirements.',
    },
    {
      question: 'Is the pricing tool free to use?',
      answer: 'Absolutely! The pricing tool is completely free for all users.',
    },
  ];

  return (
    <section className="relative bg-gradient-to-br from-[#001F54] via-[#003a85] to-[#001F54] text-yellow-200 shadow-2xl rounded-lg p-10">
      <h2 className="text-4xl font-extrabold text-center mb-6 tracking-wide drop-shadow-lg">
        <span className="bg-yellow-400 text-[#001F54] px-4 py-2 rounded-lg">
          Pricing Tools
        </span>
      </h2>

      <div className="space-y-6">
        {questions.map((item, index) => (
          <div
            key={index}
            className="bg-[#003a85] p-6 rounded-xl shadow-lg border border-yellow-300 hover:bg-yellow-300 hover:text-[#001F54] transition duration-300 transform hover:scale-105"
          >
            <h3 className="text-2xl font-semibold">{item.question}</h3>
            <p className="mt-3 text-lg">{item.answer}</p>
          </div>
        ))}
      </div>

      {/* Decorative Patterns */}
      <div className="absolute top-[-30px] left-[-40px] w-32 h-32 bg-yellow-400 rounded-full shadow-lg opacity-30 animate-bounce"></div>
      <div className="absolute bottom-[-40px] right-[-30px] w-28 h-28 bg-yellow-500 rounded-full shadow-lg opacity-40 animate-pulse"></div>
    </section>
  );
};

export default PriceToolQuestions;
