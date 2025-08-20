import React from 'react';
import { Routes, Route, Link, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext'; // Import the Auth Provider
import './App.css';

import HomePage from './components/HomePage';
import SuggestionForm from './components/SuggestionForm';
import MySuggestions from './components/MySuggestions';
import AdminLoginPage from './components/AdminLoginPage';
import AdminPanel from './components/AdminPanel'; // We will create this next

// This is the protected route component
function ProtectedRoute({ children }) {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/admin" />;
}

function App() {
  return (
    <AuthProvider> {/* Wrap the entire app in the AuthProvider */}
      <div className="App">
        <header className="app-header">
          <div className="header-left">
            <img src="/jindal_steel_logo.png" className="logo" alt="Jindal Steel Logo" />
            <nav>
              <Link to="/">Home</Link>
              <Link to="/submit">Submit Suggestion</Link>
              <Link to="/my-suggestions">My Suggestions</Link>
              <Link to="/admin">Admin</Link>
            </nav>
          </div>
          <img src="/sohar_steel_logo.png" className="logo" alt="Sohar Steel Logo" />
        </header>

        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/submit" element={<SuggestionForm />} />
            <Route path="/my-suggestions" element={<MySuggestions />} />
            <Route path="/admin" element={<AdminLoginPage />} />
            {/* This is the new protected route for the admin dashboard */}
            <Route 
              path="/admin/dashboard" 
              element={
                <ProtectedRoute>
                  <AdminPanel />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </main>
      </div>
    </AuthProvider>
  );
}

export default App;
