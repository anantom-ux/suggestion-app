// src/components/SharedComponents.jsx

import React, { useState } from 'react';

export function FormInput({ label, name, type = 'text', value, onChange, required = false }) {
  return (
    <div>
      <label htmlFor={name} className="block text-base font-medium text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        name={name}
        id={name}
        value={value}
        onChange={onChange}
        required={required}
        className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-200 p-3 text-base"
      />
    </div>
  );
}

export function FormTextArea({ label, name, value, onChange, required = false }) {
  return (
    <div>
      <label htmlFor={name} className="block text-base font-medium text-gray-700 mb-1">{label}</label>
      <textarea
        name={name}
        id={name}
        rows="4" // Increased rows for better usability
        value={value}
        onChange={onChange}
        required={required}
        className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-200 p-3 text-base"
      ></textarea>
    </div>
  );
}

export function Modal({ status, onClose }) {
  const isSuccess = status === 'success';
  const modalIcon = isSuccess ? (
    <svg className="mx-auto h-16 w-16 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ) : (
    <svg className="mx-auto h-16 w-16 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );

  const modalTitle = isSuccess ? 'Suggestion Submitted!' : 'Submission Failed';
  const modalText = isSuccess
    ? 'Thank you for your valuable suggestion. It has been successfully recorded.'
    : 'An error occurred during submission. Please try again later.';

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="relative p-8 w-full max-w-sm bg-white rounded-xl shadow-2xl text-center transform scale-100 transition-transform duration-300 ease-out">
        {modalIcon}
        <h3 className="mt-4 text-2xl font-bold leading-tight text-gray-900">{modalTitle}</h3>
        <p className="mt-2 text-base text-gray-600">{modalText}</p>
        <div className="mt-6">
          <button
            type="button"
            className="inline-flex justify-center rounded-full border border-transparent bg-blue-600 px-6 py-3 text-base font-semibold text-white shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 transform hover:scale-105"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export function RejectionReasonModal({ onClose, onConfirm, rejectionReason, setRejectionReason }) {
  const [showError, setShowError] = useState(false);

  const handleConfirm = () => {
    if (rejectionReason.trim() === '') {
      setShowError(true);
      return;
    }
    onConfirm(rejectionReason);
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="relative p-8 w-full max-w-sm bg-white rounded-xl shadow-2xl text-center transform scale-100 transition-transform duration-300 ease-out">
        <h3 className="mt-2 text-2xl font-bold leading-tight text-gray-900">Reason for Rejection</h3>
        <p className="mt-2 text-base text-gray-600">Please provide a clear reason for rejecting this suggestion.</p>
        <div className="mt-4">
            <textarea
              rows="4"
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 p-3 text-base"
              placeholder="Reason for rejection..."
              value={rejectionReason}
              onChange={(e) => {
                setRejectionReason(e.target.value);
                setShowError(false);
              }}
            ></textarea>
            {showError && (
              <p className="mt-1 text-sm text-red-600">Rejection reason cannot be empty.</p>
            )}
          </div>
        <div className="mt-6 flex justify-end space-x-3">
          <button
            type="button"
            className="inline-flex justify-center rounded-full border border-gray-300 bg-white px-5 py-2.5 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="button"
            className="inline-flex justify-center rounded-full border border-transparent bg-blue-600 px-5 py-2.5 text-base font-medium text-white shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 transform hover:scale-105"
            onClick={handleConfirm}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

export function AdminLoginModal({ onPasswordSubmit, statusMessage }) {
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    onPasswordSubmit(password);
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="p-8 w-full max-w-sm bg-white rounded-2xl shadow-2xl text-center transform scale-100 transition-transform duration-300 ease-out">
        <h3 className="text-3xl font-bold text-gray-900 mb-4">Admin Login</h3>
        <p className="mt-2 text-lg text-gray-600 mb-4">Enter the admin password to access this page.</p>
        <form onSubmit={handleLogin} className="space-y-5">
          <FormInput
            label="Admin Password"
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {statusMessage && (
            <p className="text-sm text-red-600 mt-2">{statusMessage}</p>
          )}
          <button
            type="submit"
            className="w-full inline-flex justify-center rounded-full border border-transparent bg-blue-600 px-6 py-3 text-lg font-semibold text-white shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 transform hover:scale-105"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}