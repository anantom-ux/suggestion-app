// src/components/UnauthorizedPage.jsx

import React from 'react';

function UnauthorizedPage({ userId }) {
  return (
    <div className="max-w-md mx-auto p-8 text-center mt-24 bg-white rounded-2xl shadow-xl">
      <svg className="mx-auto h-16 w-16 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
      </svg>
      <h1 className="mt-4 text-3xl font-bold text-gray-900">Access Denied</h1>
      <p className="mt-2 text-lg text-gray-600">You do not have permission to view the Admin Panel.</p>
      <p className="mt-2 text-sm text-gray-500">Your User ID: <span className="font-mono bg-gray-200 px-2 py-1 rounded">{userId}</span></p>
    </div>
  );
}

export default UnauthorizedPage;