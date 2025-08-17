// src/App.js

import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithCustomToken, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Component imports
import HomePage from './components/HomePage.jsx';
import SuggestionForm from './components/SuggestionForm.jsx';
import AdminPanel from './components/AdminPanel.jsx';
import MySuggestions from './components/MySuggestions.jsx';
import UnauthorizedPage from './components/UnauthorizedPage.jsx';
import AdminLoginPage from './components/AdminLoginPage.jsx';

// Global variables provided by the Canvas environment (using dummy values for local build)
const firebaseConfig = {
  apiKey: "dummy-api-key",
  authDomain: "dummy-auth-domain",
  projectId: "dummy-project-id",
  storageBucket: "dummy-storage-bucket",
  messagingSenderId: "dummy-sender-id",
  appId: "dummy-app-id",
};
const appId = "default-app-id";
const initialAuthToken = null;

// The list of authorized user IDs for the admin panel.
const AUTHORIZED_ADMIN_IDS = [
  'y5q2Jm3hLwF6r8eQ0n9gZcV4', // Example Admin ID 1
  'z1XcVbN5mKlP0o8iJ7hG6fD3', // Example Admin ID 2
  // Add other authorized user IDs here
];

const customStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
  body {
    font-family: 'Inter', sans-serif;
  }
`;

function App() {
  const [db, setDb] = useState(null);
  const [auth, setAuth] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');
  const [isAdmin, setIsAdmin] = useState(false);

  // Initialize Firebase and set up auth listener
  useEffect(() => {
    try {
      const app = initializeApp(firebaseConfig);
      const firestore = getFirestore(app);
      const firebaseAuth = getAuth(app);
      setDb(firestore);
      setAuth(firebaseAuth);

      const unsubscribe = onAuthStateChanged(firebaseAuth, async (user) => {
        if (user) {
          setUserId(user.uid);
          setIsAdmin(AUTHORIZED_ADMIN_IDS.includes(user.uid));
        } else {
          if (initialAuthToken) {
            await signInWithCustomToken(firebaseAuth, initialAuthToken);
          } else {
            await signInAnonymously(firebaseAuth);
          }
        }
        setIsAuthReady(true);
      });
      return () => unsubscribe();
    } catch (e) {
      console.error("Error initializing Firebase:", e);
      setIsAuthReady(true);
    }
  }, []);

  const renderContent = () => {
    if (!isAuthReady) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
          <div className="text-xl text-gray-500">Loading...</div>
        </div>
      );
    }

    switch (currentPage) {
      case 'home':
        return <HomePage db={db} appId={appId} />;
      case 'submit':
        return <SuggestionForm db={db} userId={userId} appId={appId} />;
      case 'my-suggestions':
        return <MySuggestions db={db} userId={userId} appId={appId} />;
      case 'admin':
        if (isAdmin) {
          return <AdminPanel db={db} userId={userId} appId={appId} />;
        } else {
          return <AdminLoginPage userId={userId} onLoginSuccess={() => setCurrentPage('admin-panel')} />;
        }
      case 'admin-panel':
        if (isAdmin) {
          return <AdminPanel db={db} userId={userId} appId={appId} />;
        } else {
          setCurrentPage('admin');
          return <AdminLoginPage userId={userId} onLoginSuccess={() => setCurrentPage('admin-panel')} />;
        }
      default:
        return <HomePage db={db} appId={appId} />;
    }
  };

  return (
    <>
      <style>{customStyles}</style>
      <div className="bg-gray-100 min-h-screen">
        <nav className="bg-white shadow-lg p-4">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            {/* Left Logo and App Title */}
            <div className="flex items-center space-x-3">
              <img src={process.env.PUBLIC_URL + '/jindal_steel_logo.png'} alt="Jindal Steel Logo" className="h-10 w-auto object-contain" onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/100x40/e0e0e0/333333?text=Jindal'; }} />

              <span className="text-2xl font-bold text-gray-800 hidden sm:block">Suggestion Box</span>
            </div>

            {/* Navigation Links */}
            <div className="flex space-x-2 sm:space-x-4 items-center">
              <button
                onClick={() => setCurrentPage('home')}
                className={`py-2 px-3 sm:px-4 rounded-lg font-medium text-sm sm:text-base transition-colors duration-200 ${currentPage === 'home' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                Home
              </button>
              <button
                onClick={() => setCurrentPage('submit')}
                className={`py-2 px-3 sm:px-4 rounded-lg font-medium text-sm sm:text-base transition-colors duration-200 ${currentPage === 'submit' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                Submit
              </button>
              <button
                onClick={() => setCurrentPage('my-suggestions')}
                className={`py-2 px-3 sm:px-4 rounded-lg font-medium text-sm sm:text-base transition-colors duration-200 ${currentPage === 'my-suggestions' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                My Suggestions
              </button>
              <button
                onClick={() => setCurrentPage('admin')}
                className={`py-2 px-3 sm:px-4 rounded-lg font-medium text-sm sm:text-base transition-colors duration-200 ${currentPage === 'admin' || currentPage === 'admin-panel' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                Admin
              </button>
            </div>

            {/* Right Logo */}
            <div className="flex items-center">
                <img src = "\sohar_steel_logo.png"></img>
               </div>
          </div>
        </nav>
        {renderContent()}
      </div>
    </>
  );
}

export default App;