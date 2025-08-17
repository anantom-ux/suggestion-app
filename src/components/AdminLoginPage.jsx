import React, { useState } from 'react';
import { FormInput } from './SharedComponents';

const ADMIN_PASSWORD = 'admin123'; // CHANGE THIS PASSWORD IMMEDIATELY

function AdminLoginPage({ onLoginSuccess, userId }) {
  const [password, setPassword] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      onLoginSuccess();
    } else {
      setStatusMessage('Incorrect password. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-100 flex items-center justify-center">
      <div className="p-8 w-96 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-900">Admin Login</h3>
          <p className="mt-2 text-sm text-gray-500">Enter the admin password to access this page.</p>
          <p className="mt-1 text-xs text-gray-400">Your User ID: <span className="font-mono">{userId}</span></p>
          <form onSubmit={handleLogin} className="mt-4 space-y-4">
            <FormInput
              label="Password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {statusMessage && (
              <p className="text-sm text-red-600">{statusMessage}</p>
            )}
            <button
              type="submit"
              className="w-full inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AdminLoginPage;