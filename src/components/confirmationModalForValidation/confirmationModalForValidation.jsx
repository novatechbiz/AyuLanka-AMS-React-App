import './confirmationModalForValidation.css';
import React from 'react';

export function ConfirmationModalForValidation({ isOpen, onClose, onConfirm, headerMessage, bodyMessage }) {
    if (!isOpen) return null;

    return (
        <div className="confirmation-modal" style={{
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        }}>
            <div className="modal-content" style={{
                backgroundColor: 'white',
                borderRadius: '8px',
                padding: '40px',
                width: '500px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                textAlign: 'center',
            }}>
                <h4 style={{
                    fontSize: '1.25em',
                    color: '#333',
                    marginBottom: '15px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    <span className="icon" style={{
                        color: '#dc3545',
                        fontSize: '1.5em',
                        marginRight: '10px'}}>&#9888;</span> {/* Unicode for warning sign */}
                    {headerMessage || 'Confirm Appointment Creation'}
                </h4>
                <p style={{
                    fontSize: '1em',
                    color: '#555',
                    lineHeight: '1.5',
                    marginBottom: '20px'
                }}>{bodyMessage || 'Some validation warnings are present. Do you still want to proceed with creating this appointment?'}</p>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '10px',
                }}>
                    <button onClick={onClose} className="cancel" style={{
                        backgroundColor: '#ccc',
                        color: '#333',
                        padding: '10px 20px',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        flex: '1',
                        fontSize: '0.9em',
                    }}>Cancel</button>
                    <button onClick={onConfirm} className="confirm" style={{
                        backgroundColor: '#007BFF',
                        color: 'white',
                        padding: '10px 20px',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        flex: '1',
                        fontSize: '0.9em',
                    }}>Confirm</button>
                </div>
            </div>
        </div>
    );
}