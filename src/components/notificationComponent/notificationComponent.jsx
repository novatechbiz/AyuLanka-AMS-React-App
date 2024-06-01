// NotificationComponent.jsx
import React from 'react';
import './notificationComponent.css'; // Make sure to create a CSS file for styles

export const NotificationComponent = ({ message, type, onClose }) => {
    if (!message) return null;

    return (
        <div className={`notification ${type}`} onClick={onClose}>
            {message}
        </div>
    );
};