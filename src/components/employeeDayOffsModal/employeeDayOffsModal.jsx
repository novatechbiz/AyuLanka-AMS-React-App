import React from 'react';
import Modal from 'react-modal';
import "./employeeDayOffsModal.css";

export const EmployeeDayOffsModal = ({ isOpen, onClose, employees }) => {
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            className="Modal appointment-refer-detail-modal"
            overlayClassName="Overlay"
        >
            <h3 className='appointment-refer-detail-header'>Employee Day Offs</h3><br/>
            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Position</th>
                    </tr>
                </thead>
                <tbody>
                    {employees.map(emp => (
                        <tr key={emp.id}>
                            <td>{emp.employee.fullName}</td>
                            <td>{emp.employee.designation.name}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button onClick={onClose} className="btn btn-secondary">Close</button>
        </Modal>
    );
};
