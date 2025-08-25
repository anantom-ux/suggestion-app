import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../firebase';
// Import the deleteDoc function
import { collection, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import './AdminPanel.css';

function AdminPanel() {
  const [allSuggestions, setAllSuggestions] = useState([]);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    status: 'All',
    department: '',
    searchTerm: ''
  });

  // ... (your existing stats, useEffects, and handleFilterChange functions remain the same)
  const stats = useMemo(() => {
    return {
      new: allSuggestions.filter(s => s.status === 'New' || !s.status).length,
      rejected: allSuggestions.filter(s => s.status === 'Rejected').length,
      completed: allSuggestions.filter(s => s.status === 'Completed').length,
      underProgress: allSuggestions.filter(s => s.status === 'Under Review' || s.status === 'Approved').length,
      total: allSuggestions.length
    };
  }, [allSuggestions]);

  useEffect(() => {
    const suggestionsRef = collection(db, 'suggestions');
    const q = query(suggestionsRef, orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const suggestionsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAllSuggestions(suggestionsData);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    let result = allSuggestions;
    if (filters.status !== 'All') {
      if (filters.status === 'New') {
        result = result.filter(s => !s.status || s.status === 'New');
      } else {
        result = result.filter(s => s.status === filters.status);
      }
    }
    if (filters.department) {
      result = result.filter(s => s.department && s.department.toLowerCase().includes(filters.department.toLowerCase()));
    }
    if (filters.searchTerm) {
        result = result.filter(s => 
            (s.idea && s.idea.toLowerCase().includes(filters.searchTerm.toLowerCase())) ||
            (s.suggestedBy && s.suggestedBy.toLowerCase().includes(filters.searchTerm.toLowerCase()))
        );
    }
    setFilteredSuggestions(result);
  }, [filters, allSuggestions]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prevFilters => ({ ...prevFilters, [name]: value }));
  };
  
  const handleStatusChange = async (id, newStatus) => {
    const suggestionRef = doc(db, 'suggestions', id);
    try {
        await updateDoc(suggestionRef, { status: newStatus });
    } catch (error) {
        console.error("Error updating status: ", error);
    }
  };

  // --- NEW: Function to handle deleting a suggestion ---
  const handleDelete = async (id) => {
    // Show a confirmation dialog before deleting
    if (window.confirm("Are you sure you want to permanently delete this suggestion?")) {
        const suggestionRef = doc(db, 'suggestions', id);
        try {
            await deleteDoc(suggestionRef);
            // The real-time listener will automatically update the UI
        } catch (error) {
            console.error("Error deleting suggestion: ", error);
            alert("There was an error deleting the suggestion.");
        }
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/admin');
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  if (loading) {
    return <div>Loading all suggestions...</div>;
  }

  return (
    <div className="admin-panel-container">
      <div className="admin-header">
        <h2>Admin Dashboard</h2>
        <button onClick={handleLogout} className="logout-button">Logout</button>
      </div>

      {/* ... (your stats and filters containers remain the same) ... */}
      <div className="stats-container">
        <div className="stat-card"><h4>New</h4><p>{stats.new}</p></div>
        <div className="stat-card"><h4>Under Progress</h4><p>{stats.underProgress}</p></div>
        <div className="stat-card"><h4>Completed</h4><p>{stats.completed}</p></div>
        <div className="stat-card"><h4>Rejected</h4><p>{stats.rejected}</p></div>
        <div className="stat-card total"><h4>Total</h4><p>{stats.total}</p></div>
      </div>
      <div className="filters-container">
        <input type="text" name="searchTerm" placeholder="Search by idea or name..." value={filters.searchTerm} onChange={handleFilterChange} />
        <input type="text" name="department" placeholder="Filter by department..." value={filters.department} onChange={handleFilterChange} />
        <select name="status" value={filters.status} onChange={handleFilterChange}>
            <option value="All">All Statuses</option>
            <option value="New">New</option>
            <option value="Under Review">Under Review</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
            <option value="Completed">Completed</option>
        </select>
      </div>
      
      <div className="suggestions-grid">
        {filteredSuggestions.map(suggestion => (
          <div key={suggestion.id} className="suggestion-admin-card">
            {/* --- NEW: Delete button added here --- */}
            <button onClick={() => handleDelete(suggestion.id)} className="delete-button">×</button>
            
            <h4>Suggestion by: {suggestion.suggestedBy || 'N/A'} ({suggestion.empCode || 'N/A'})</h4>
            <p><strong>Department:</strong> {suggestion.department}</p>
            <hr />
            <p><strong>Problem:</strong> {suggestion.currentStatus}</p>
            <p><strong>Suggestion:</strong> {suggestion.idea}</p>
            {suggestion.fileUrl && (
              <p><strong>Attachment:</strong> <a href={suggestion.fileUrl} target="_blank" rel="noopener noreferrer">View File</a></p>
            )}
            <div className="card-footer">
              <select 
                className="status-dropdown" 
                value={suggestion.status || 'New'} 
                onChange={(e) => handleStatusChange(suggestion.id, e.target.value)}
              >
                <option value="New">New</option>
                <option value="Under Review">Under Review</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
                <option value="Completed">Completed</option>
              </select>
              <span>{suggestion.isAnonymous ? 'Anonymous' : 'Public'}</span>
              <span>{suggestion.createdAt && new Date(suggestion.createdAt.toDate()).toLocaleString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminPanel;