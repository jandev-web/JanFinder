'use client'
import React, { useState, useEffect } from 'react';


interface CBOComponentProps {
  user: any;
}

const CBOComponent: React.FC<CBOComponentProps> = ({user}) => {
  //console.log(user.signInDetails)
  return (
    
      
    <div className="flex">
    <div>
      {user && <h2>Welcome to the CBO Homepage, {user.email}</h2>}
    </div>
    <div>
      <p>New Quotes</p>
    </div>
    </div>
      
    
  );
};

export default CBOComponent;
