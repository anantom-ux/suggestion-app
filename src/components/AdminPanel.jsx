// src/components/AdminPanel.jsx

import React, { useState, useEffect } from 'react';
import { getFirestore, collection, onSnapshot, query, orderBy, updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import { RejectionReasonModal } from './SharedComponents';

const AUTHORIZED_ADMIN_IDS = [
  'y5q2Jm3hLwF6r8eQ0n9gZcV4',
  'z1XcVbN5mKlP0o8iJ7hG6fD3',
];

function AdminPanel({ db, userId, appId }) {
  const [suggestions, setSuggestions] = useState([]);
  const [statusMessage, setStatusMessage] = useState('');
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [selectedSuggestionId, setSelectedSuggestionId] = useState(null);
  const statusOptions = ['In Progress', 'Accepted', 'Rejected'];

  useEffect(() => {
    if (!db) return;
    const suggestionsCollectionRef = collection(db, `artifacts/${appId}/public/data/suggestions`);
    const q = query(suggestionsCollectionRef, orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const suggestionsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setSuggestions(suggestionsData);
    }, (error) => {
      console.error("Error fetching suggestions:", error);
    });
    return () => unsubscribe();
  }, [db, appId]);

  const handleStatusChange = async (suggestionId, newStatus, reason = '') => {
    try {
      if (!db || !userId) {
        setStatusMessage('Authentication error. Please refresh and try again.');
        return;
      }
      if (!AUTHORIZED_ADMIN_IDS.includes(userId)) {
        setStatusMessage('Error: You are not authorized to perform this action.');
        return;
      }

      if (newStatus === 'Rejected' && !reason) {
        setSelectedSuggestionId(suggestionId);
        setShowRejectionModal(true);
        return;
      }

      const suggestionRef = doc(db, `artifacts/${appId}/public/data/suggestions`, suggestionId);
      const updateData = {
        status: newStatus,
        lastUpdatedBy: userId,
        lastUpdatedOn: serverTimestamp(),
      };
      if (newStatus === 'Rejected') {
        updateData.rejectionReason = reason;
      } else {
        updateData.rejectionReason = null;
      }

      await updateDoc(suggestionRef, updateData);
      setStatusMessage(`Status updated to '${newStatus}' for suggestion ID: ${suggestionId}`);
      setTimeout(() => setStatusMessage(''), 3000);

      setShowRejectionModal(false);
      setRejectionReason('');
      setSelectedSuggestionId(null);

    } catch (e) {
      console.error("Error updating status:", e);
      setStatusMessage(`Error updating status: ${e.message}`);
      setTimeout(() => setStatusMessage(''), 3000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 sm:p-8 bg-white rounded-2xl shadow-xl mt-8 mb-8">
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 p-8 sm:p-10 rounded-t-xl mb-8 text-white text-center">
        <h1 className="text-3xl sm:text-4xl font-extrabold leading-tight">Admin Panel</h1>
        <p className="mt-2 text-lg opacity-90 max-w-md mx-auto">Manage and assess submitted suggestions.</p>
      </div>
      {statusMessage && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg text-center font-medium shadow-sm">
          {statusMessage}
        </div>
      )}
      {suggestions.length === 0 ? (
        <div className="text-center p-10 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <p className="text-lg text-gray-500">No suggestions to display.</p>
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
                    <span className="font-medium">Submitted by:</span> {s.name} ({s.employeeId}) from {s.area}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    <span className="font-medium">Submitted on:</span> {s.timestamp && new Date(s.timestamp.toDate()).toLocaleString()}
                  </p>
                  {s.rejectionReason && (
                    <p className="mt-2 text-sm text-red-600">
                      <span className="font-medium">Rejection Reason:</span> {s.rejectionReason}
                    </p>
                  )}
                </div>

                <div className="mt-4 md:mt-0 flex-shrink-0 flex flex-col items-end">
                  <div className={`py-1 px-3 rounded-full text-sm font-semibold inline-block mb-2 ${
                    s.status === 'Accepted' ? 'bg-green-200 text-green-800' :
                    s.status === 'Rejected' ? 'bg-red-200 text-red-800' :
                    'bg-yellow-200 text-yellow-800'
                  }`}>
                    {s.status}
                  </div>
                  <div className="flex space-x-2">
                    {statusOptions.map(status => (
                      <button
                        key={status}
                        onClick={() => handleStatusChange(s.id, status)}
                        className={`py-1 px-3 rounded-full text-xs font-semibold shadow-sm transition-all duration-200 ${
                          s.status === status ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showRejectionModal && (
        <RejectionReasonModal
          onClose={() => setShowRejectionModal(false)}
          onConfirm={(reason) => handleStatusChange(selectedSuggestionId, 'Rejected', reason)}
          rejectionReason={rejectionReason}
          setRejectionReason={setRejectionReason}
        />
      )}
    </div>
  );
}

export default AdminPanel;