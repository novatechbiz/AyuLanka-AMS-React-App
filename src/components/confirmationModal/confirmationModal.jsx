import './confirmationModal.css';
import React from 'react';

export function ConfirmationModal({ isOpen, onClose, onConfirm }) {
    if (!isOpen) return null;

    return (
        <div className="confirmation-modal">
            <div className="modal-content">
                <h4>
                    <span className="icon" style={{color: '#dc3545', marginRight: '10px'}}>&#9888;</span> {/* Unicode for warning sign */}
                    Confirm Deletion
                </h4>
                <p>Are you sure you want to delete this appointment?</p>
                <div style={{display: 'flex'}}>
                    <button onClick={onClose} className="cancel">Cancel</button>
                    <button onClick={onConfirm} className="confirm">Confirm</button>
                </div>
            </div>
        </div>
    );
}