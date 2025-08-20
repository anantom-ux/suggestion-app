import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import './AdminPanel.css'; // We will create this next

function AdminPanel() {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const suggestionsRef = collection(db, 'suggestions');
    const q = query(suggestionsRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const suggestionsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setSuggestions(suggestionsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/admin');
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  if (loading) {
    return <div>Loading all suggestions...</div>;
  }

  return (
    <div className="admin-panel-container">
      <div className="admin-header">
        <h2>Admin Dashboard</h2>
        <button onClick={handleLogout} className="logout-button">Logout</button>
      </div>
      
      <div className="suggestions-grid">
        {suggestions.map(suggestion => (
          <div key={suggestion.id} className="suggestion-admin-card">
            <h4>Suggestion by: {suggestion.suggestedBy || 'N/A'} ({suggestion.empCode || 'N/A'})</h4>
            <p><strong>Department:</strong> {suggestion.department}</p>
            <hr />
            <p><strong>Problem:</strong> {suggestion.currentStatus}</p>
            <p><strong>Suggestion:</strong> {suggestion.idea}</p>
            {suggestion.fileUrl && (
              <p><strong>Attachment:</strong> <a href={suggestion.fileUrl} target="_blank" rel="noopener noreferrer">View File</a></p>
            )}
            <div className="card-footer">
              <span>{suggestion.isAnonymous ? 'Anonymous' : 'Public'}</span>
              <span>{suggestion.createdAt && new Date(suggestion.createdAt.toDate()).toLocaleString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminPanel;
