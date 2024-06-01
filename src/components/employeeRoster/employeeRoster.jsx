import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import './employeeRoster.css';
import { fetchEmployees, fetchShifts, fetchLeaves, saveRoster, fetchRosterDates } from '../../services/employeeRoster.js';
import ModalComponent from '../modalComponent/modalComponent.jsx';

function EmployeeRoster() {
    const [employees, setEmployees] = useState([]);
    const [shifts, setShifts] = useState([]);
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [days, setDays] = useState([]);
    const [checkboxStates, setCheckboxStates] = useState({});
    const [leaveData, setLeaveData] = useState({});
    const [showRoster, setShowRoster] = useState(false);
    const [loading, setLoading] = useState(false); // Loading state for Generate Roster
    const [saving, setSaving] = useState(false); // Loading state for Save
    const [successModalOpen, setSuccessModalOpen] = useState(false);
    const [errorModalOpen, setErrorModalOpen] = useState(false);
    const [rosterDates, setRosterDates] = useState([]);

    const handleSuccessClose = () => {
        setSuccessModalOpen(false);
    };

    const handleErrorClose = () => {
        setErrorModalOpen(false);
    };

    const fetchAllData = async () => {
        try {
            const fetchedEmployees = await fetchEmployees();
            const fetchedShifts = await fetchShifts();
            const fetchedLeaves = await fetchLeaves(startDate, endDate);
            const formattedLeaveData = processLeaveData(fetchedLeaves); 
            setEmployees(fetchedEmployees);
            setShifts(fetchedShifts);
            setLeaveData(formattedLeaveData);
        } catch (error) {
            console.error("Failed to fetch data:", error);
        }
    };

    const processLeaveData = (leaveArray) => {
        const leaveDates = {};
        leaveArray.forEach(leave => {
            let start = new Date(leave.fromDate);
            let end = new Date(leave.toDate);
    
            if (!leaveDates[leave.employeeId]) {
                leaveDates[leave.employeeId] = {};
            }
    
            start = new Date(start.setHours(0, 0, 0, 0));
            end = new Date(end.setHours(0, 0, 0, 0));
            for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
                const year = date.getFullYear();
                const month = (date.getMonth() + 1).toString().padStart(2, '0');
                const day = date.getDate().toString().padStart(2, '0');
                const dateString = `${year}-${month}-${day}`;
                leaveDates[leave.employeeId][dateString] = true;
            }
        });
        return leaveDates;
    };
    

    useEffect(() => {
        if (startDate && endDate) {
            fetchAllData();
            fetchRosterDates().then(dates => {
                const formattedDates = dates.map(date => ({
                    start: new Date(date.startDate),
                    end: new Date(date.endDate)
                }));
                setRosterDates(formattedDates);
            });
        }
    }, [startDate, endDate]);

    const generateDaysAndWeeks = () => {
        setLoading(true); // Set loading state to true
        let tempDays = [];
        // Set start date at beginning of the day in local time, not UTC
        let localStartDate = new Date(startDate.setHours(0, 0, 0, 0));
        let localEndDate = new Date(endDate.setHours(23, 59, 59, 999));
    
        // If you need to work in UTC for consistency across time zones when sending to backend
        let currentDate = new Date(Date.UTC(localStartDate.getFullYear(), localStartDate.getMonth(), localStartDate.getDate()));
        let inclusiveEndDate = new Date(Date.UTC(localEndDate.getFullYear(), localEndDate.getMonth(), localEndDate.getDate()));
    
        while (currentDate <= inclusiveEndDate) {
            const localDate = new Date(currentDate); // Convert UTC date back to local date for display
            const dayOfWeek = localDate.toLocaleString('en-us', { weekday: 'short' });
            const formattedDate = localDate.toISOString().split('T')[0]; // YYYY-MM-DD format
            
            let dayClass = '';
            if (dayOfWeek === 'Sat') {
                dayClass = 'saturday';
            } else if (dayOfWeek === 'Sun') {
                dayClass = 'sunday';
            }
            tempDays.push({ dayOfWeek, formattedDate, dayClass });
            currentDate.setUTCDate(currentDate.getUTCDate() + 1); // Increment day in UTC
        }
        setDays(tempDays);
        setShowRoster(true);
        setLoading(false); // Set loading state to false
    };
    

    const handleCancel = () => {
        // Reset all changes or navigate away
        setShowRoster(false);
        setCheckboxStates({});
        window.location.reload();
    };
    
    const handleSubmit = async () => {
        setSaving(true); // Set saving state to true
        const formatLocalDate = (date) => {
            const d = new Date(date);
            return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`;
        };
    
        const rosterMasterData = {
            Id: 0,
            FromDate: formatLocalDate(startDate), // Format date manually
            Todate: formatLocalDate(endDate)      // Format date manually
        };
    
        console.log("Formatted Start Date:", rosterMasterData.FromDate);
        console.log("Formatted End Date:", rosterMasterData.Todate);
    
        // Collect data for each employee and each day where IsDayOff is true
        const staffRosterData = employees.flatMap(employee =>
            days.map(day => {
                const isDayOff = checkboxStates[`${employee.id}-${day.formattedDate}`];
                    return {
                        EmployeeId: employee.id,
                        ShiftMasterId: employee.shiftMasterId,
                        IsDayOff: isDayOff,
                        DayOffDate: day.formattedDate
                    };
            }).filter(entry => entry !== null)
        );
    
        const dataToSend = {
            rosterMaster: rosterMasterData,
            staffRosters: staffRosterData
        };
    
        try {
            const createdRoster = await saveRoster(dataToSend);
            console.log('Roster saved successfully:', createdRoster);
            setSaving(false); // Set saving state to false
            setSuccessModalOpen(true);
        } catch (error) {
            console.error('Failed to save roster:', error);
            setSaving(false); // Set saving state to false
            setErrorModalOpen(true)
        }
    };

    const getAllDatesInRange = (ranges) => {
        const dates = [];
        ranges.forEach(range => {
            let currentDate = new Date(range.start);
            const endDate = new Date(range.end);
            while (currentDate <= endDate) {
                dates.push(new Date(currentDate));
                currentDate.setDate(currentDate.getDate() + 1);
            }
        });
        return dates;
    };
    

    return (
        <div>
            <div className="employee-roster">
                <h1 className='roster-header'>Create Roster</h1><br/>
                <div className="date-picker-container">
                    <DatePicker
                        selectsRange={true}
                        startDate={startDate}
                        endDate={endDate}
                        onChange={(update) => {
                            setStartDate(update[0]);
                            setEndDate(update[1]);
                        }}
                        highlightDates={{
                            'highlighted-dates': getAllDatesInRange(rosterDates) // Use a custom class for highlighting
                        }}
                        excludeDates={getAllDatesInRange(rosterDates)}
                        dateFormat="yyyy-MM-dd"
                    />
                    <button onClick={generateDaysAndWeeks} disabled={loading || saving}>{loading ? 'Loading...' : 'Generate Roster'}</button>
                </div>
                {showRoster && (
                    <table>
                        <thead>
                            <tr>
                                <th>Employee Name</th>
                                <th>Shift</th>
                                {days.map((day, index) => (
                                    <th key={index} className={day.dayClass}>
                                        {day.dayOfWeek}<br/>{day.formattedDate}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {employees.map(employee => (
                                <tr key={employee.id}>
                                    <td>{employee.fullName}</td>
                                    <td>
                                        <select className='form-control' style={{width:'fit-content'}} value={employee.shiftMasterId || ''} onChange={(e) => {/* handle shift change */}}>
                                            {shifts.map(shift => (
                                                <option key={shift.id} value={shift.id}>
                                                    {shift.id} ({shift.fromTime} - {shift.toTime})
                                                </option>
                                            ))}
                                        </select>
                                    </td>
                                    {days.map((day, index) => {
                                        const key = `${employee.id}-${day.formattedDate}`;
                                        const employeeLeaveData = leaveData[employee.id] || {};
                                        const isOnLeave = employeeLeaveData[day.formattedDate];
                                        const cellClass = `${day.dayClass} ${checkboxStates[key] ? 'checked-day' : ''} ${isOnLeave ? 'on-leave' : ''}`;
                                        return (
                                            <td key={index} className={cellClass}>
                                                <input
                                                    type="checkbox"
                                                    checked={checkboxStates[key] || false}
                                                    onChange={e => setCheckboxStates({ ...checkboxStates, [key]: e.target.checked })}
                                                />
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>

                    </table>
                )}
            </div>
            {showRoster && (
                <div className="row roster-actions">
                    <div className='col-md-8'></div>
                    <div className='col-md-2'>
                        <button className='btn-cancel' onClick={handleCancel}>Cancel</button>
                    </div>
                    <div className='col-md-2'>
                    <button onClick={handleSubmit} disabled={loading || saving}>{saving ? 'Saving...' : 'Save'}</button>
                    </div>
                </div>
            )}
            {/* Success modal */}
            <ModalComponent show={successModalOpen} onClose={handleSuccessClose} type="success" />

            {/* Error modal */}
            <ModalComponent show={errorModalOpen} onClose={handleErrorClose} type="error" />
        </div>
    );
}

export default EmployeeRoster;
