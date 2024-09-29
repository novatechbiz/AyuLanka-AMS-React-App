// Logout.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear session storage or perform any additional logout cleanup here
    sessionStorage.clear();



    // Redirect to the login page after clearing session data
    navigate('/');
  }, [navigate]);

  return (
    <div className="logout-page">
      <h2>Logging out...</h2>
    </div>
  );
};

export default Logout;
