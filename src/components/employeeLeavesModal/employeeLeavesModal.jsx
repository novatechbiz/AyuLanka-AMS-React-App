import React from 'react';
import Modal from 'react-modal';
import "./employeeLeavesModal.css";

export const EmployeeLeavesModal = ({ isOpen, onClose, employees }) => {
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            className="Modal appointment-refer-detail-modal"
            overlayClassName="Overlay"
        >
            <h2 className='appointment-refer-detail-header'>Employee Leaves</h2>
            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Position</th>
                        <th>Leave Type</th>
                        {/* <th>From Date</th>
                        <th>To Date</th> */}
                    </tr>
                </thead>
                <tbody>
                    {employees.map(emp => (
                        <tr key={emp.id}>
                            <td>{emp.employee.fullName}</td>
                            <td>{emp.employee.designation.name}</td>
                            <td>{emp.leaveType.name}</td>
                            {/* <td>{new Date(emp.fromDate).toLocaleDateString()}</td>
                            <td>{new Date(emp.toDate).toLocaleDateString()}</td> */}
                        </tr>
                    ))}
                </tbody>
            </table>
            <button onClick={onClose} className="btn btn-secondary">Close</button>
        </Modal>
    );
};
