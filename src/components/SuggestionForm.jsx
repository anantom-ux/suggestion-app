import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import './SuggestionForm.css';

function SuggestionForm() {
  const [formData, setFormData] = useState({
    suggestedBy: '',
    empCode: '',
    department: 'HR',
    idea: '',
    currentStatus: '',
    suggestedChange: '',
    topics: [],
    benefits: '',
    involvement: '',
    isAnonymous: false,
    contactEmail: '',
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "topics") {
      setFormData(prevState => ({
        ...prevState,
        topics: checked
          ? [...prevState.topics, value]
          : prevState.topics.filter(topic => topic !== value)
      }));
    } else {
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
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.contactEmail && !emailRegex.test(formData.contactEmail)) {
      alert("Please enter a valid email address.");
      return;
    }
    try {
      await addDoc(collection(db, 'suggestions'), {
        ...formData,
        createdAt: serverTimestamp()
      });
      alert('Suggestion submitted successfully!');
    } catch (error) {
      console.error("Error submitting suggestion: ", error);
      alert('Error submitting suggestion.');
    }
  };

  return (
    <form className="suggestion-form" onSubmit={handleSubmit}>
      {/* The <h1> was for testing, you can remove it if you like */}
      {/* <h1>TESTING</h1> */} 
      <h2>Submit Your Idea</h2>
      <p>Your insights drive our progress. Share your thoughts to make a difference!</p>


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

      <div className="form-group">
          <label className="anonymous-label">
            <input type="checkbox" name="isAnonymous" checked={formData.isAnonymous} onChange={handleChange} />
            Submit this suggestion anonymously (it will not be shown on the home page)
          </label>
      </div>
      <div className="form-group">
        <label>Contact Email</label>
        <input type="text" name="contactEmail" value={formData.contactEmail} onChange={handleChange} />
      </div>

      <button type="submit" className="submit-button">Submit My Suggestion</button>
    </form>
  );
}

export default SuggestionForm;