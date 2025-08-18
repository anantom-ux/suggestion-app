import React from 'react';

function BenefitsInvolvement({ formData, handleChange }) {
  return (
    <div className="form-section">
      <h3>4. Benefits & Your Involvement</h3>
      <div className="form-group">
        <label>What would be the benefits to the organization? (e.g., Safety, cost saving, quality improvement)</label>
        <textarea
          name="benefits"
          value={formData.benefits}
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <label>
          Would you like to be involved in the implementation of the suggestion?
        </label>
        <textarea
          name="involvement"
          value={formData.involvement}
          onChange={handleChange}
        />
      </div>
    </div>
  );
}

export default BenefitsInvolvement;