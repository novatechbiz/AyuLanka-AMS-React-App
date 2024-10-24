import React from 'react';
import Modal from 'react-modal';
import "./employeeShiftsModal.css";

export const EmployeeShiftsModal = ({ isOpen, onClose, employees }) => {
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            className="Modal appointment-refer-detail-modal"
            overlayClassName="Overlay"
        >
            <h2 className='appointment-refer-detail-header'>Employee Shifts</h2>
            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Position</th>
                        <th>Shift</th>
                    </tr>
                </thead>
                <tbody>
                    {employees.map(emp => (
                        <tr key={emp.id}>
                            <td>{emp.employee.employeeNumber} - {emp.employee.callingName}</td>
                            <td>{emp.employee.designation.name}</td>
                            <td>{emp.shiftMaster.fromTime} - {emp.shiftMaster.toTime}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button onClick={onClose} className="btn btn-secondary">Close</button>
        </Modal>
    );
};
