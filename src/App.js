import React from 'react';
import { Routes, Route, Link } from 'react-router-dom'; // 1. Import routing tools
import './App.css';

// 2. Import the components for your pages
import HomePage from './components/HomePage';
import SuggestionForm from './components/SuggestionForm';
import MySuggestions from './components/MySuggestions';
import AdminLoginPage from './components/AdminLoginPage';

function App() {
  return (
    <div className="App">
      <header className="app-header">
        <div className="header-left">
          <img src="/jindal_steel_logo.png" className="logo" alt="Jindal Steel Logo" />
          <nav>
            {/* 3. Replace <a> tags with <Link> tags */}
            <Link to="/">Home</Link>
            <Link to="/submit">Submit Suggestion</Link>
            <Link to="/my-suggestions">My Suggestions</Link>
            <Link to="/admin">Admin</Link>
          </nav>
        </div>
        <img src="/sohar_steel_logo.png" className="logo" alt="Sohar Steel Logo" />
      </header>

      <main>
        {/* 4. Define which component shows for each path */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/submit" element={<SuggestionForm />} />
          <Route path="/my-suggestions" element={<MySuggestions />} />
          <Route path="/admin" element={<AdminLoginPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;