// src/components/SuggestionForm.jsx

import React, { useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, serverTimestamp, addDoc } from 'firebase/firestore';

import { Modal, FormInput, FormTextArea } from './SharedComponents';

// Global variables from the Canvas environment (using dummy values for local build)
const firebaseConfig = {
  apiKey: "dummy-api-key",
  authDomain: "dummy-auth-domain",
  projectId: "dummy-project-id",
  storageBucket: "dummy-storage-bucket",
  messagingSenderId: "dummy-sender-id",
  appId: "dummy-app-id",
};
const appId = "default-app-id";

function SuggestionForm({ db, userId, appId }) {
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [involvement, setInvolvement] = useState('no');

  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    employeeId: '',
    area: '',
    problem: '',
    suggestion: '',
    topics: [],
    benefits: '',
    involvementHow: '',
  });

  const topicsOptions = [
    'Improving the work environment.',
    'Higher productivity, cost reduction or improvement in products or their design.',
    'Improvement in methods, machinery, equipment, or tools and layouts, processes, or procedures.',
    'Reduction of waste or spillage.',
    'Reduction of idle time or repairs and maintenance of machinery, equipment or tools.',
    'Increase in the utility, quality, yield or output of products.',
    'Conservation of materials, energy or time in processes or their utilization for better purpose.',
    'Handling of hazardous materials, safe movement of materials, safety against fire etc.',
    'Any other Topic.',
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTopicChange = (e) => {
    const { value, checked } = e.target;
    setFormData(prev => {
      if (checked) {
        return { ...prev, topics: [...prev.topics, value] };
      } else {
        return { ...prev, topics: prev.topics.filter(topic => topic !== value) };
      }
    });
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmissionStatus('submitting');

    try {
      if (!db || !userId) {
        throw new Error("Firebase not initialized or user not authenticated.");
      }

      const MAX_FILE_SIZE_MB = 25;
      if (selectedFile && selectedFile.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        throw new Error(`File size exceeds ${MAX_FILE_SIZE_MB}MB limit.`);
      }

      let attachmentURL = null;
      if (selectedFile) {
        const storage = getStorage(initializeApp(firebaseConfig));
        const storageRef = ref(storage, `artifacts/${appId}/attachments/${userId}/${selectedFile.name}`);
        const snapshot = await uploadBytes(storageRef, selectedFile);
        attachmentURL = await getDownloadURL(snapshot.ref);
      }

      const suggestionsCollectionRef = collection(db, `artifacts/${appId}/public/data/suggestions`);

      await addDoc(suggestionsCollectionRef, {
        ...formData,
        timestamp: serverTimestamp(),
        submitterId: userId,
        status: 'In Progress',
        attachmentURL: attachmentURL,
        involvement: involvement === 'yes',
      });

      setSubmissionStatus('success');
      setIsModalOpen(true);
      setFormData({
        name: '',
        contact: '',
        employeeId: '',
        area: '',
        problem: '',
        suggestion: '',
        topics: [],
        benefits: '',
        involvementHow: '',
      });
      setSelectedFile(null);
      setInvolvement('no');

    } catch (e) {
      console.error("Error submitting suggestion:", e);
      setSubmissionStatus('error');
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSubmissionStatus(null);
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden mt-8 mb-8">
      {/* Header with Gradient */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 p-8 sm:p-10 text-white text-center">
        <h1 className="text-3xl sm:text-4xl font-extrabold leading-tight">Submit Your Idea</h1>
        <p className="mt-2 text-lg opacity-90 max-w-md mx-auto">Your insights drive our progress. Share your thoughts to make a difference!</p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-8">
        {/* Section 1: Employee Details */}
        <div className="space-y-5 border-b border-gray-200 pb-8">
          <h2 className="text-2xl font-bold text-gray-800">1. Your Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FormInput label="Full Name" name="name" value={formData.name} onChange={handleChange} required />
            <FormInput label="Employee ID" name="employeeId" value={formData.employeeId} onChange={handleChange} required />
            <FormInput label="Contact Number" name="contact" type="tel" value={formData.contact} onChange={handleChange} required />
            <FormInput label="Department/Area Name" name="area" value={formData.area} onChange={handleChange} required />
          </div>
        </div>

        {/* Section 2: Suggestion Details */}
        <div className="space-y-5 border-b border-gray-200 pb-8">
          <h2 className="text-2xl font-bold text-gray-800">2. Your Idea</h2>
          <FormTextArea label="Existing Problem (What needs improvement?)" name="problem" value={formData.problem} onChange={handleChange} required />
          <FormTextArea label="Suggestion for Solving it (How can it be better?)" name="suggestion" value={formData.suggestion} onChange={handleChange} />
        </div>
        
        {/* Section 3: Topics */}
        <div className="space-y-5 border-b border-gray-200 pb-8">
          <h2 className="text-2xl font-bold text-gray-800">3. Suggestion Topics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-base text-gray-700">
            {topicsOptions.map(topic => (
              <label key={topic} className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg shadow-sm hover:bg-gray-100 transition-colors duration-200 cursor-pointer">
                <input
                  type="checkbox"
                  name="topics"
                  value={topic}
                  onChange={handleTopicChange}
                  className="rounded text-blue-600 focus:ring-blue-500 h-5 w-5"
                />
                <span>{topic}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Section 4: Benefits & Involvement */}
        <div className="space-y-5 border-b border-gray-200 pb-8">
          <h2 className="text-2xl font-bold text-gray-800">4. Benefits & Your Involvement</h2>
          <FormTextArea
            label="What would be the benefits to the organization? (e.g., Safety, cost saving, quality improvement)"
            name="benefits"
            value={formData.benefits}
            onChange={handleChange}
            required
          />
          <div>
            <label className="block text-base font-medium text-gray-700 mb-3">Would you like to be involved in the implementation of the suggestion?</label>
            <div className="flex items-center space-x-6">
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="involvement"
                  value="yes"
                  checked={involvement === 'yes'}
                  onChange={(e) => setInvolvement(e.target.value)}
                  className="text-blue-600 focus:ring-blue-500 h-5 w-5"
                />
                <span className="ml-2 text-base text-gray-700">Yes, I'd like to help!</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="involvement"
                  value="no"
                  checked={involvement === 'no'}
                  onChange={(e) => setInvolvement(e.target.value)}
                  className="text-blue-600 focus:ring-blue-500 h-5 w-5"
                />
                <span className="ml-2 text-base text-gray-700">No, thank you.</span>
              </label>
            </div>
          </div>
          {involvement === 'yes' && (
            <FormTextArea
              label="If yes, please describe how you'd like to be involved."
              name="involvementHow"
              value={formData.involvementHow}
              onChange={handleChange}
              required
            />
          )}
        </div>

        {/* Section 5: Attachment */}
        <div className="space-y-5">
          <h2 className="text-2xl font-bold text-gray-800">5. Attachments (Optional)</h2>
          <div>
            <label htmlFor="attachment" className="block text-base font-medium text-gray-700 mb-2">Attach Image/Video (Max 25MB, e.g., a photo of the problem area)</label>
            <input
              type="file"
              name="attachment"
              id="attachment"
              onChange={handleFileChange}
              accept="image/*,video/mp4"
              className="mt-1 block w-full text-base text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-colors duration-200 cursor-pointer"
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={submissionStatus === 'submitting'}
          className="mt-8 w-full flex justify-center items-center py-4 px-6 border border-transparent rounded-full shadow-lg text-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submissionStatus === 'submitting' ? (
            <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            'Submit Your Suggestion'
          )}
        </button>
      </form>

      {isModalOpen && (
        <Modal
          status={submissionStatus}
          onClose={closeModal}
        />
      )}
    </div>
  );
}

export default SuggestionForm;