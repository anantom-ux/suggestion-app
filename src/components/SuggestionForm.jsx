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

  // Your form's JSX will be long, here's a shortened example
  return (
    <form className="suggestion-form" onSubmit={handleSubmit}>
      <h2>Submit a Suggestion</h2>

      <div className="form-row">
        <div className="form-group">
          <label>Suggested by</label>
          <input type="text" name="suggestedBy" value={formData.suggestedBy} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Employee Code</label>
          <input type="text" name="empCode" value={formData.empCode} onChange={handleChange} />
        </div>
      </div>
      
      <div className="form-group">
        <label>Idea/Suggestion</label>
        <textarea name="idea" value={formData.idea} onChange={handleChange} required></textarea>
      </div>

      <div className="form-group">
        <label>Topics (Please tick all that apply)</label>
        <div className="checkbox-group">
            <label><input type="checkbox" name="topics" value="Work Environment" onChange={handleChange} /> Improving the work environment.</label>
            <label><input type="checkbox" name="topics" value="Productivity" onChange={handleChange} /> Higher productivity, cost reduction...</label>
            {/* ... Add all other topic checkboxes here ... */}
        </div>
      </div>
      
      <div className="form-group">
        <label>
          <input type="checkbox" name="isAnonymous" checked={formData.isAnonymous} onChange={handleChange} />
          Submit this suggestion anonymously (it will not appear on the home page)
        </label>
      </div>

      <button type="submit">Submit</button>
    </form>
  );
}

export default SuggestionForm;