import React from 'react';

const GoldBox = () => {
  return (
    <div style={{
      backgroundColor: '#D4AF8F', 
      padding: '20px',
      borderRadius: '10px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
      border: '2px solid #A67C52'
    }}>
      {/* Content of the box */}
      <h2>Metallic Gold Box</h2>
      <p>This is a shiny gold box!</p>
    </div>
  );
};

export default GoldBox;