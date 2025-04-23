'use client'

import React from 'react';

function TestTemplatePage() {
  // Static data for testing
  const firstName = 'John';
  const lastName = 'Doe';
  const confirmationNumber = '12345';
  const company = 'Doe Enterprises';
  const email = 'john.doe@example.com';
  const phone = '(123) 456-7890';
  const addressStr = '123 Main St, Springfield, IL 62701';
  const facilityType = 'Office';
  const frequency = 'Weekly';
  const roomsHtmlRows = (
    "<tr><td style='padding: 8px; border: 1px solid #ddd;'>Hallways</td><td style='padding: 8px; border: 1px solid #ddd;'>2323 sqft</td></tr>"
  );

  return (
    <div>
      <head>
        <style>
          {`
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              margin: 0;
              padding: 0;
            }
            .container {
              width: 80%;
              margin: auto;
              padding: 20px;
              background-color: #ffffff;
              border-radius: 10px;
              box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
            }
            .header {
              background-color: #001F54;
              color: #FFD700;
              padding: 20px;
              text-align: center;
              border-radius: 10px 10px 0 0;
            }
            h1 {
              font-size: 36px;
              font-weight: 700;
              margin: 0;
            }
            .content {
              padding: 20px;
            }
            .info-table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 20px;
            }
            .info-table th, .info-table td {
              padding: 10px;
              border: 1px solid #ddd;
              text-align: left;
            }
            .footer {
              text-align: center;
              font-size: 12px;
              color: #777;
              margin-top: 20px;
            }
            .button {
              background-color: #FFD700;
              color: #001F54;
              padding: 12px 20px;
              text-align: center;
              text-decoration: none;
              border-radius: 5px;
              display: inline-block;
              font-weight: bold;
              margin-top: 15px;
              transition: background-color 0.3s ease;
            }
            .button:hover {
              background-color: #FFB800;
            }
          `}
        </style>
      </head>
      <body>
        <div className="container">
          <div className="header">
            <h1>Bid2Clean Quote Confirmation</h1>
          </div>
          <div className="content">
            <p>Dear {firstName} {lastName},</p>
            <p>Thank you for choosing Bid2Clean for your quote request. We are pleased to confirm your quote with the following details:</p>
            
            <h2>Confirmation Details</h2>
            <p><strong>Confirmation Number:</strong> {confirmationNumber}</p>
            
            <h2>Customer Information</h2>
            <table className="info-table">
              <tr><th>Company</th><td>{company}</td></tr>
              <tr><th>Email</th><td>{email}</td></tr>
              <tr><th>Phone</th><td>{phone}</td></tr>
              <tr><th>Address</th><td>{addressStr}</td></tr>
            </table>
            
            <h2>Quote Details</h2>
            <table className="info-table">
              <tr><th>Facility Type</th><td>{facilityType}</td></tr>
              <tr><th>Service Frequency</th><td>{frequency}</td></tr>
            </table>
            
            <h2>Selected Rooms</h2>
            <table className="info-table">
              <tr>
                <th>Room Type</th>
                <th>Square Footage</th>
              </tr>
              {roomsHtmlRows}
            </table>
            
            <p>We appreciate the opportunity to serve you. If you have any questions or require further assistance, please feel free to reach out to us at info@bid2clean.com.</p>
            <p><a href="http://localhost:3000/quote-status" className="button">Check Bid Status</a></p>
            <p>Sincerely,<br />The Bid2Clean Team</p>
          </div>
          <div className="footer">
            <p>This is an automated message from Bid2Clean. Please do not reply directly to this email.</p>
          </div>
        </div>
      </body>
    </div>
  );
}

export default TestTemplatePage;
