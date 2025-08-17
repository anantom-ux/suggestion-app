import React, { useState, useEffect } from 'react';
import { db } from '../firebase'; // Make sure you have your firebase.js config file
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import './HomePage.css'; // We'll create this file for styling

function HomePage() {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        // 1. Reference to the 'suggestions' collection
        const suggestionsRef = collection(db, 'suggestions');

        // 2. Create a query to get the latest 10 public suggestions
        const q = query(
          suggestionsRef,
          where('isAnonymous', '==', false), // Only get suggestions that are NOT anonymous
          orderBy('createdAt', 'desc'),      // Order by newest first
          limit(10)                          // Get a maximum of 10
        );

        // 3. Execute the query
        const querySnapshot = await getDocs(q);
        const suggestionsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setSuggestions(suggestionsData);
      } catch (error) {
        console.error("Error fetching suggestions: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestions();
  }, []); // The empty array [] means this effect runs only once when the component mounts

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
              <p><strong>Suggested by:</strong> {suggestion.suggestedBy}</p>
              <p><strong>Department:</strong> {suggestion.department}</p>
              <p className="card-date">
                {new Date(suggestion.createdAt?.toDate()).toLocaleDateString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default HomePage;