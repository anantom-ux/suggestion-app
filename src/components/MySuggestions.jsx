// src/components/MySuggestions.jsx

import React, { useState, useEffect } from 'react';
import { getFirestore, collection, onSnapshot, query, where, orderBy } from 'firebase/firestore';

function MySuggestions({ db, userId, appId }) {
  const [mySuggestions, setMySuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!db || !userId) return;

    const suggestionsCollectionRef = collection(db, `artifacts/${appId}/public/data/suggestions`);
    const q = query(suggestionsCollectionRef, where("submitterId", "==", userId), orderBy('timestamp', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const suggestionsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMySuggestions(suggestionsData);
      setIsLoading(false);
    }, (error) => {
      console.error("Error fetching my suggestions:", error);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [db, userId, appId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
        <div className="text-xl text-gray-500 animate-pulse">Loading your suggestions...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 sm:p-8 bg-white rounded-2xl shadow-xl mt-8 mb-8">
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 p-8 sm:p-10 rounded-t-xl mb-8 text-white text-center">
        <h1 className="text-3xl sm:text-4xl font-extrabold leading-tight">My Submitted Suggestions</h1>
        <p className="mt-2 text-lg opacity-90 max-w-md mx-auto">Track the status of your valuable ideas here.</p>
      </div>

      {mySuggestions.length === 0 ? (
        <div className="text-center p-10 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <p className="text-lg text-gray-500">You have not submitted any suggestions yet.</p>
          <button
            className="mt-6 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 transform hover:scale-105"
            onClick={() => window.location.reload()} // Simple reload to trigger App.js navigation
          >
            Submit Your First Idea!
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {mySuggestions.map((s) => (
            <div key={s.id} className="bg-gray-50 p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
              <div className="flex flex-col md:flex-row md:items-start justify-between">
                <div className="flex-grow">
                  <p className="font-semibold text-xl text-gray-900">{s.problem}</p>
                  {s.suggestion && (
                    <p className="mt-2 text-gray-600 text-base">
                      <span className="font-medium text-blue-700">Suggestion:</span> {s.suggestion}
                    </p>
                  )}
                  {s.rejectionReason && (
                    <p className="mt-2 text-base text-red-600">
                      <span className="font-medium">Rejection Reason:</span> {s.rejectionReason}
                    </p>
                  )}
                  {s.attachmentURL && (
                    <div className="mt-4">
                      <a href={s.attachmentURL} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700 underline flex items-center space-x-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 11.586V4a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                        <span>View Attachment</span>
                      </a>
                    </div>
                  )}
                  <p className="mt-4 text-sm text-gray-500">
                    <span className="font-medium">Submitted on:</span> {s.timestamp && new Date(s.timestamp.toDate()).toLocaleString()}
                  </p>
                </div>

                <div className="mt-4 md:mt-0 flex-shrink-0">
                  <span className="font-medium text-gray-700 mr-2">Status:</span>
                  <div className={`py-1 px-3 rounded-full text-sm font-semibold inline-block ${
                    s.status === 'Accepted' ? 'bg-green-200 text-green-800' :
                    s.status === 'Rejected' ? 'bg-red-200 text-red-800' :
                    'bg-yellow-200 text-yellow-800'
                  }`}>
                    {s.status}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MySuggestions;