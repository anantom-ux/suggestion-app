import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import './AdminLoginPage.css';

function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate(); // Initialize the navigate function

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      // On success, navigate to the admin dashboard
      navigate('/admin/dashboard'); 
    } catch (error) {
      console.error("Error logging in:", error);
      setError("Failed to log in. Please check your email and password.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleLogin}>
        <h2>Admin Portal</h2>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="error-message">{error}</p>}
        <button type="submit" className="submit-button" disabled={isLoading}>
          {isLoading ? 'Logging In...' : 'Log In'}
        </button>
      </form>
    </div>
  );
}

export default AdminLoginPage;
