// src/components/HomePage.jsx

import React, { useState, useEffect } from 'react';
import { getFirestore, collection, onSnapshot, query, orderBy, limit } from 'firebase/firestore';

function HomePage({ db, appId }) {
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!db) return;

    const suggestionsCollectionRef = collection(db, `artifacts/${appId}/public/data/suggestions`);
    const q = query(suggestionsCollectionRef, orderBy('timestamp', 'desc'), limit(5));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const suggestionsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setSuggestions(suggestionsData);
      setIsLoading(false);
    }, (error) => {
      console.error("Error fetching suggestions:", error);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [db, appId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)]"> {/* Adjust height based on nav */}
        <div className="text-xl text-gray-500 animate-pulse">Loading recent suggestions...</div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 sm:p-8 bg-white rounded-2xl shadow-xl mt-8 mb-8">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-gray-800 leading-tight">Welcome to the <span className="text-blue-600">Suggestion Box</span></h1>
        <p className="mt-3 text-lg text-gray-600 max-w-2xl mx-auto">Your ideas fuel innovation. Let's build a culture of "Better Than Before" and Kaizen together.</p>
      </div>

      <h2 className="text-2xl font-bold text-gray-700 mb-6 border-b-2 pb-2 border-blue-200 text-center">Top 5 Recent Suggestions</h2>
      {suggestions.length === 0 ? (
        <div className="text-center p-10 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <p className="text-lg text-gray-500">No suggestions yet. Be the first to contribute and see your idea here!</p>
          <button
            className="mt-6 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 transform hover:scale-105"
            onClick={() => window.location.reload()} // Simple reload to trigger App.js navigation
          >
            Submit Your Idea Now!
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {suggestions.map((s) => (
            <div key={s.id} className="bg-gray-50 p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
              <div className="flex flex-col md:flex-row md:items-start justify-between">
                <div className="flex-grow">
                  <p className="font-semibold text-xl text-gray-900">{s.problem}</p>
                  {s.suggestion && (
                    <p className="mt-2 text-gray-600 text-base">
                      <span className="font-medium text-blue-700">Suggestion:</span> {s.suggestion}
                    </p>
                  )}
                  <p className="mt-4 text-sm text-gray-500">
                    <span className="font-medium">Submitted by:</span> {s.name} from {s.area}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    <span className="font-medium">Submitted on:</span> {s.timestamp && new Date(s.timestamp.toDate()).toLocaleString()}
                  </p>
                </div>

                <div className="mt-4 md:mt-0 flex-shrink-0 flex items-center">
                  <span className="font-medium text-gray-700 mr-2">Status:</span>
                  <span className={`py-1 px-3 rounded-full text-sm font-semibold inline-block ${
                    s.status === 'Accepted' ? 'bg-green-200 text-green-800' :
                    s.status === 'Rejected' ? 'bg-red-200 text-red-800' :
                    'bg-yellow-200 text-yellow-800'
                  }`}>
                    {s.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default HomePage;