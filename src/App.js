import React from 'react';
import './App.css'; // <-- THIS IS THE CRITICAL MISSING LINE. ADD IT.

function App() {
  // Inside your App() function in src/App.js

return (
  <div className="App">
    <header className="app-header">
      
      {/* Group the first logo and nav links together on the left */}
      <div className="header-left">
        <img src="/jindal_steel_logo.png" className="logo" alt="Jindal Steel Logo" />
        <nav>
          <a href="/">Home</a>
          <a href="/submit">Submit Suggestion</a>
          <a href="/my-suggestions">My Suggestions</a>
          <a href="/admin">Admin</a>
        </nav>
      </div>
      
      {/* The second logo will be pushed to the far right by itself */}
      <img src="/sohar_steel_logo.png" className="logo" alt="Sohar Steel Logo" />

    </header>

    <main>
      {/* Page content will go here */}
    </main>

  </div>
);
}

export default App;