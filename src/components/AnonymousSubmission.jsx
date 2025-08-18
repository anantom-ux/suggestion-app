import React from 'react';

function AnonymousSubmission({ formData, handleChange }) {
  return (
    <div className="form-group">
      <label className="anonymous-label">
        <input
          type="checkbox"
          name="isAnonymous"
          checked={formData.isAnonymous}
          onChange={handleChange}
        />
        Submit this suggestion anonymously (it will not be shown on the home page)
      </label>
    </div>
  );
}

export default AnonymousSubmission;