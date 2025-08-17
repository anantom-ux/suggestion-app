import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import './SuggestionForm.css'; // New CSS file for the form

function SuggestionForm() {
  const [formData, setFormData] = useState({
    suggestedBy: '',
    empCode: '',
    department: 'HR',
    idea: '',
    currentStatus: '',
    suggestedChange: '',
    topics: [], // To store multiple checkbox values
    benefits: '',
    involvement: '',
    isAnonymous: false, // For the anonymity checkbox
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Handle checkboxes for 'topics'
    if (name === "topics") {
      setFormData(prevState => ({
        ...prevState,
        topics: checked
          ? [...prevState.topics, value] // Add topic if checked
          : prevState.topics.filter(topic => topic !== value) // Remove if unchecked
      }));
    } else {
      // Handle all other inputs
      setFormData(prevState => ({
        ...prevState,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.idea) {
      alert("Please fill out the idea/suggestion field.");
      return;
    }
    try {
      await addDoc(collection(db, 'suggestions'), {
        ...formData,
        createdAt: serverTimestamp() // Adds a server-side timestamp
      });
      alert('Suggestion submitted successfully!');
      // Optionally, clear the form here
    } catch (error) {
      console.error("Error submitting suggestion: ", error);
      alert('Error submitting suggestion.');
    }
  };

// In src/components/SuggestionForm.jsx

return (
  <form className="suggestion-form" onSubmit={handleSubmit}>
    <h2>Submit Your Idea</h2>
    <p>Your insights drive our progress. Share your thoughts to make a difference!</p>

    <div className="form-section">
      <h3>1. Your Details</h3>
      <div className="form-row">
        <div className="form-group">
          <label>Full Name</label>
          <input type="text" name="suggestedBy" value={formData.suggestedBy} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Employee ID</label>
          <input type="text" name="empCode" value={formData.empCode} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Department/Area Name</label>
          <input type="text" name="department" value={formData.department} onChange={handleChange} />
        </div>
      </div>
    </div>

    <div className="form-section">
      <h3>2. Your Idea</h3>
      <div className="form-group">
        <label>Existing Problem (What needs improvement?)</label>
        <textarea name="currentStatus" value={formData.currentStatus} onChange={handleChange}></textarea>
      </div>
      <div className="form-group">
        <label>Suggestion for Solving it (How can it be better?)</label>
        <textarea name="idea" value={formData.idea} onChange={handleChange} required></textarea>
      </div>
    </div>

    <div className="form-section">
      <h3>3. Suggestion Topics</h3>
      <div className="checkbox-grid"> {/* Use the new grid class */}
        <label><input type="checkbox" name="topics" value="Work Environment" onChange={handleChange} /> Improving the work environment.</label>
        <label><input type="checkbox" name="topics" value="Productivity" onChange={handleChange} /> Higher productivity, cost reduction or improvement.</label>
        <label><input type="checkbox" name="topics" value="Process Improvement" onChange={handleChange} /> Improvement in methods, machinery, or procedures.</label>
        <label><input type="checkbox" name="topics" value="Waste Reduction" onChange={handleChange} /> Reduction of waste or spillage.</label>
        <label><input type="checkbox" name="topics" value="Idle Time Reduction" onChange={handleChange} /> Reduction of idle time or repairs.</label>
        <label><input type="checkbox" name="topics" value="Quality/Output" onChange={handleChange} /> Increase in the utility, quality, yield or output.</label>
        <label><input type="checkbox" name="topics" value="Conservation" onChange={handleChange} /> Conservation of materials, energy or time.</label>
        <label><input type="checkbox" name="topics" value="Safety" onChange={handleChange} /> Handling of hazardous materials, safety against fire etc.</label>
        <label><input type="checkbox" name="topics" value="Other" onChange={handleChange} /> Any other Topic.</label>
      </div>
    </div>

    <div className="form-section">
        <h3>4. Benefits & Your Involvement</h3>
        <div className="form-group">
            <label>What would be the benefits to the organization? (e.g., Safety, cost saving, quality improvement)</label>
            <textarea name="benefits" value={formData.benefits} onChange={handleChange}></textarea>
        </div>
        <div className="form-group">
            <label>Would you like to be involved in the implementation of the suggestion?</label>
            <textarea name="involvement" value={formData.involvement} onChange={handleChange}></textarea>
        </div>
    </div>

    {/* --- KEY CHANGE: Add the anonymous checkbox here --- */}
    <div className="form-group">
        <label className="anonymous-label">
          <input type="checkbox" name="isAnonymous" checked={formData.isAnonymous} onChange={handleChange} />
          Submit this suggestion anonymously (it will not be shown on the home page)
        </label>
    </div>

    <button type="submit" className="submit-button">Submit My Suggestion</button>
  </form>
);

export default SuggestionForm;