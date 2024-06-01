import React, { useState, useEffect } from 'react';
import { fetchEmployees, fetchEmployeeShifts, updateShift, fetchRosterDates, fetchShifts } from '../../services/employeeRoster.js';
import './changeShift.css';

function ChangeShift() {
    const [selectedRosterId, setSelectedRosterId] = useState('');
    const [employees, setEmployees] = useState([]);
    const [shifts, setShifts] = useState([]);
    const [employeeShifts, setEmployeeShifts] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [rosters, setRosters] = useState([]);
    const [reason, setReason] = useState('');

    useEffect(() => {
        fetchRosterDates()
            .then(data => setRosters(data.filter(roster => roster.isApproved)))
            .catch(setError);
        fetchEmployees().then(setEmployees).catch(setError);
        fetchShifts().then(setShifts).catch(setError);
    }, []);

    useEffect(() => {
        if (selectedEmployee && selectedRosterId) {
            fetchEmployeeShifts(selectedEmployee, selectedRosterId)
                .then(data => {
                    const activeShifts = data.filter(shift => !shift.isDayOff).map(shift => ({
                        ...shift,
                        newShiftId: shift.shiftMasterId // Initialize newShiftId
                    }));
                    setEmployeeShifts(activeShifts);
                })
                .catch(setError);
        }
    }, [selectedEmployee, selectedRosterId]);

    const handleRosterSelect = (e) => setSelectedRosterId(e.target.value);
    const handleEmployeeChange = (e) => setSelectedEmployee(e.target.value);
    const handleReasonChange = (e) => setReason(e.target.value);

    const handleShiftChange = (index, newShiftId) => {
        const updatedShifts = [...employeeShifts];
        updatedShifts[index].newShiftId = parseInt(newShiftId);
        setEmployeeShifts(updatedShifts);
    };

    const toLocalISOString = (date) => {
        const tzOffset = new Date().getTimezoneOffset() * 60000; // offset in milliseconds
        const adjustedDate = new Date(date - tzOffset);
        return adjustedDate.toISOString().split('T')[0];
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            let shiftChangeDetails = [];
    
            // Handle the change only if the reason is management_request
            if (reason === 'management_request') {
                // Collect details for management request
                shiftChangeDetails = employeeShifts.filter(shift =>
                    shift.newShiftId && // Check if there's a new shift ID assigned
                    shift.newShiftId !== shift.shiftMasterId // Ensure the shift has been changed
                ).map(shift => ({
                    StaffRosterId: shift.id,
                    ShiftPre: shift.shiftMasterId, // Existing shift ID
                    ShiftPost: shift.newShiftId, // New shift ID
                    ExchangeWithPre: null,
                    ExchangeWithPost: null,
                    IsApproved: false
                }));
            }
    
            const shiftChangeMasterRequest = {
                StaffRosterMasterId: parseInt(selectedRosterId),
                EmployeeId: parseInt(selectedEmployee),
                ShiftChangeReasonId: reason === 'management_request' ? 1 : 0 // Only proceed if reason is management_request
            };
    
            const dataToSend = {
                shiftChangeMasterRequest,
                shiftChangeDetails
            };
    
            console.log('Sending Data:', dataToSend);
            await updateShift(dataToSend);  // Assuming updateShift sends the data to your backend correctly
            alert('Shift change request submitted successfully!');
        } catch (error) {
            setError(error.toString());
            console.error('Error submitting shift changes:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="shift-change-container">
            <h1 className='shift-change-header'>Change Employee Shift</h1>
            <div className="shift-change-field row">
                <div className='col-md-4'>
                    <label>Roster</label>
                    <select className='shift-change-dropdown' value={selectedRosterId} onChange={handleRosterSelect}>
                        <option value="">Select a Roster</option>
                        {rosters.map(roster => (
                            <option key={roster.id} value={roster.id}>{new Date(roster.startDate).toLocaleDateString()} - {new Date(roster.endDate).toLocaleDateString()}</option>
                        ))}
                    </select>
                </div>
            </div><br/>
            <div className="row">
                <div className="col-md-4">
                    <label>Reason for changing day off</label>
                    <select className="form-control" value={reason} onChange={handleReasonChange}>
                        <option value="">Select a reason</option>
                        <option value="management_request">On Management Request</option>
                        {/* <option value="exchange_request">Exchange Request</option> */}
                    </select><br/>
                </div>
                <div className="col-md-4">&nbsp;</div>
            </div>
            <div className="shift-change-field row">
                <div className='col-md-4'>
                    <label>Select Employee</label>
                    <select className="form-control" value={selectedEmployee} onChange={handleEmployeeChange}>
                        <option value="">Select an Employee</option>
                        {employees.map(employee => (
                            <option key={employee.id} value={employee.id}>{employee.fullName}</option>
                        ))}
                    </select>
                </div>
            </div>
            <br/>
            <div className="shift-entry">
                <div className='row'>
                    <div className='col-md-4'>
                            <label>Change From</label><br />
                    </div>
                    <div className='col-md-3'>
                        <label>Change To</label><br />
                    </div>
                </div>
                <div className="shifts-container">
                    {employeeShifts.map((shift, index) => (
                        <div key={index} className="row">
                            <div className='col-md-4' style={{ marginTop: '10px' }}>
                                {new Date(shift.shiftDate).toLocaleDateString()}: {shift.shiftMaster.fromTime} - {shift.shiftMaster.toTime}
                            </div>
                            <div className='col-md-3'>
                                <select className="shift-change-dropdown" value={shift.newShiftId} onChange={e => handleShiftChange(index, e.target.value)}>
                                    {shifts.map(s => (
                                        <option key={s.id} value={s.id}>{s.fromTime} - {s.toTime}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    ))}
                </div>
            </div><br/>
            <div className='row'>
                <div className='col-md-4'>
                    <button className="shift-change-button" onClick={handleSubmit} disabled={loading}>Submit Changes</button>
                    {error && <p className="shift-change-error">{error}</p>}
                </div>
            </div>
        </div>
    );
}

export default ChangeShift;
