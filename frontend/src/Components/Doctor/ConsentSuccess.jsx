// src/components/Doctor/ConsentSuccess.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const ConsentSuccess = () => {
  const navigate = useNavigate();

  // Auto redirect to Google after 5 seconds
  setTimeout(() => {
    window.location.href = 'https://mail.google.com';
  }, 5000);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="text-center">
        {/* Big Green Tick SVG */}
        <div className="mb-8 animate-bounce">
          <svg 
            className="w-32 h-32 mx-auto text-green-500" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        {/* Success Message */}
        <h1 className="text-3xl font-bold text-green-600 mb-4">
          Consent Received Successfully!
        </h1>
        
        <p className="text-gray-600 mb-8">
          Thank you for your consent. You will now receive activity updates and reports.
        </p>

        {/* Redirect Message */}
        <p className="text-sm text-gray-500">
          Redirecting you to your email...
        </p>

        {/* Manual Link */}
        <button
          onClick={() => window.location.href = 'https://mail.google.com'}
          className="mt-4 text-blue-600 hover:text-blue-800 text-sm underline"
        >
          Click here if not redirected automatically
        </button>
      </div>
    </div>
  );
};

export default ConsentSuccess;