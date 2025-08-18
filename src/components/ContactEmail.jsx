import React from 'react';

function ContactEmail({ formData, handleChange }) {
  return (
    <div className="form-group">
      <label>Contact Email</label>
      <input
        type="text"
        name="contactEmail"
        value={formData.contactEmail}
        onChange={handleChange}
      />
    </div>
  );
}

export default ContactEmail;