import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, where, orderBy, onSnapshot, doc, updateDoc, increment } from 'firebase/firestore';
import './HomePage.css';

function HomePage() {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  // State to keep track of which suggestions have been voted on in this session
  const [votedIds, setVotedIds] = useState(JSON.parse(localStorage.getItem('votedSuggestions')) || []);

  useEffect(() => {
    const suggestionsRef = collection(db, 'suggestions');
    const q = query(
      suggestionsRef,
      where('isAnonymous', '==', false),
      orderBy('createdAt', 'desc')
    );

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

  const toggleVote = async (id) => {
    const hasVoted = votedIds.includes(id);
    const suggestionRef = doc(db, 'suggestions', id);
    const voteIncrement = hasVoted ? -1 : 1; // If already voted, subtract 1, otherwise add 1

    // Optimistic UI Update
    setSuggestions(currentSuggestions =>
      currentSuggestions.map(suggestion =>
        suggestion.id === id
          ? { ...suggestion, votes: (suggestion.votes || 0) + voteIncrement }
          : suggestion
      )
    );

    // Update localStorage
    const newVotedIds = hasVoted
      ? votedIds.filter(votedId => votedId !== id)
      : [...votedIds, id];
    setVotedIds(newVotedIds);
    localStorage.setItem('votedSuggestions', JSON.stringify(newVotedIds));

    // Update Firebase in the background
    try {
      await updateDoc(suggestionRef, {
        votes: increment(voteIncrement)
      });
    } catch (error) {
      console.error("Error toggling vote:", error);
      // Optional: Revert UI change on error
    }
  };


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
              <div className="card-content">
                <h3>Idea: {suggestion.idea}</h3>
                <p><strong>Suggested by:</strong> {suggestion.suggestedBy || 'Anonymous'}</p>
                <p><strong>Department:</strong> {suggestion.department}</p>
              </div>
              <div className="vote-section">
                {/* Add a class if the user has voted */}
                <button 
                  onClick={() => toggleVote(suggestion.id)} 
                  className={`vote-button ${votedIds.includes(suggestion.id) ? 'voted' : ''}`}
                >
                  👍
                </button>
                <span className="vote-count">{suggestion.votes || 0}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default HomePage;