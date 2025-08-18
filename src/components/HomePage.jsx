import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
// The key change is importing "onSnapshot"
import { collection, query, where, orderBy, limit, onSnapshot } from 'firebase/firestore';
import './HomePage.css';

function HomePage() {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const suggestionsRef = collection(db, 'suggestions');
    const q = query(
      suggestionsRef,
      where('isAnonymous', '==', false), // Only get suggestions that are NOT anonymous
      orderBy('createdAt', 'desc'),
      limit(10)
    );

    // onSnapshot creates a real-time listener
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const suggestionsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setSuggestions(suggestionsData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching real-time suggestions: ", error);
      setLoading(false);
    });

    // Cleanup the listener when the component unmounts
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading recent suggestions...</div>;
  }

  return (
    <div className="homepage-container">
      <h2>Recent Suggestions</h2>
      <div className="suggestions-list">
        {suggestions.length === 0 ? (
          <p>No public suggestions have been submitted yet.</p>
        ) : (
          suggestions.map(suggestion => (
            <div key={suggestion.id} className="suggestion-card">
              <h3>Idea: {suggestion.idea}</h3>
              <p><strong>Suggested by:</strong> {suggestion.suggestedBy || 'Anonymous'}</p>
              <p><strong>Department:</strong> {suggestion.department}</p>
              <p className="card-date">
                {suggestion.createdAt && new Date(suggestion.createdAt.toDate()).toLocaleDateString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default HomePage;