import React, { useState, useEffect } from 'react';
import { getPendingDayOffs, updateDayOff } from '../../services/employeeRoster';
import './approveDayOff.css';

function ApproveDayOffs() {
    const [dayOffRequests, setDayOffRequests] = useState([]);
    const [selectedRequests, setSelectedRequests] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchPendingDayOffs();
    }, []);

    const fetchPendingDayOffs = async () => {
        setLoading(true);
        try {
            const data = await getPendingDayOffs();
            setDayOffRequests(data);
            setSelectedRequests({});
        } catch (error) {
            setError('Failed to fetch day off requests');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectRequest = (id) => {
        setSelectedRequests(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const handleApproval = async (isApproved) => {
        setLoading(true);
        const userId = sessionStorage.getItem('userId'); // Assume user ID is stored in session storage
    
        // Filter and collect IDs of only the selected (ticked) requests
        const selectedIds = Object.entries(selectedRequests)
            .filter(([id, isSelected]) => isSelected)
            .map(([id]) => id);
    
        if (selectedIds.length === 0) {
            alert('No requests selected.');
            setLoading(false);
            return;
        }
    
        // Prepare the master data
        const dayOffChangeMaster = {
            StaffRosterMasterId: 0, // Placeholder, replace with actual ID as needed
            EmployeeId: 0, // Assuming the current user's ID is needed
            DayOffChangeReasonId: isApproved ? 1 : 2 // Adjust based on your reason logic
        };
    
        let dayOffChangeDetails = dayOffRequests
            .filter(request => selectedIds.includes(request.id.toString()))
            .map(request => ({
                Id: request.id,
                StaffRosterId: request.staffRosterId,
                DayOffPre: new Date(request.dayOffPre).toISOString(),
                DayOffPost: new Date(request.dayOffPost).toISOString(),
                ExchangeWithPre: null,
                ExchangeWithPost: null,
                IsApproved: isApproved,
                ApprovedBy: parseInt(userId)
            }));
    
        const dataToSend = {
            dayOffChangeMaster,
            dayOffChangeDetails
        };
    
        try {
            await updateDayOff(dataToSend); // Uncomment this to send the data to your backend API
            fetchPendingDayOffs(); // Refresh the list after updating
            alert(`Day off requests have been ${isApproved ? 'approved' : 'rejected'}!`);
        } catch (error) {
            setError('Failed to update approval status');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };
    

    if (loading) return <p className="approve-loading">Loading...</p>;
    if (error) return <p className="approve-error">Error: {error}</p>;

    return (
        <div className="approve-container">
            <h1>Approve Day Off Requests</h1>
            {dayOffRequests.length > 0 ? (
                <table className="approve-table">
                    <thead>
                        <tr>
                            <th>Select</th>
                            <th>Employee Name</th>
                            <th>Day Off Date Before</th>
                            <th>Day Off Date After</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dayOffRequests.map(request => (
                            <tr key={request.id}>
                                <td>
                                    <input
                                        type="checkbox"
                                        checked={!!selectedRequests[request.id]}
                                        onChange={() => handleSelectRequest(request.id)}
                                    />
                                </td>
                                <td>{request.dayOffChangeMaster.employee.fullName}</td>
                                <td>{new Date(request.dayOffPre).toLocaleDateString()}</td>
                                <td>{new Date(request.dayOffPost).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No pending requests.</p>
            )}
            <div className="row approve-buttons">
                <div className='col-md-8'>&nbsp;</div>
                <div className='col-md-2'>
                <button className="approve-btn approve" onClick={() => handleApproval(true)} disabled={loading || Object.values(selectedRequests).every(v => !v)}>Approve</button>
                </div>
                <div className='col-md-2'>
                <button className="approve-btn reject" onClick={() => handleApproval(false)} disabled={loading || Object.values(selectedRequests).every(v => !v)}>Reject</button>
                </div>
            </div>
        </div>
    );
}

export default ApproveDayOffs;
