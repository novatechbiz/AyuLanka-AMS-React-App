import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import './appointmentCompletionRateReport.css';
import {
    fetchAllPreScheduledScheduledAppointmentsByDateRange,
    fetchCompletedAppointmentsByDateRange
} from '../../../services/appointmentSchedulerApi';

const AppointmentCompletionRateReport = () => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [completionData, setCompletionData] = useState([]);

    const generateDateRange = (start, end) => {
        const dates = [];
        let currentDate = new Date(start);
        while (currentDate <= new Date(end)) {
            dates.push(new Date(currentDate).toISOString().slice(0, 10));
            currentDate.setDate(currentDate.getDate() + 1);
        }
        return dates;
    };

    const fetchAppointments = async () => {
        if (!startDate || !endDate) {
            alert('Please select both start and end dates');
            return;
        }

        try {
            const start = new Date(startDate);
            const end = new Date(endDate);
            const dateList = generateDateRange(start, end);

            const allAppointments = await fetchAllPreScheduledScheduledAppointmentsByDateRange(start, end);
            const completedAppointments = await fetchCompletedAppointmentsByDateRange(start, end);

            // Group by scheduleDate (YYYY-MM-DD)
            const groupByDate = (appointments) => {
                const grouped = {};
                appointments.forEach(a => {
                    const date = new Date(a.scheduleDate).toLocaleDateString('en-CA'); // gives 'YYYY-MM-DD'
                    if (!grouped[date]) grouped[date] = [];
                    grouped[date].push(a);
                });
                return grouped;
            };

            const allGrouped = groupByDate(allAppointments);
            const completedGrouped = groupByDate(completedAppointments);

            const dailyStats = dateList.map(date => {
                const total = allGrouped[date]?.length || 0;
                const completed = completedGrouped[date]?.length || 0;
                const percentage = total > 0 ? ((completed / total) * 100).toFixed(2) : '0.00';

                return {
                    date,
                    total,
                    completed,
                    percentage
                };
            });

            setCompletionData(dailyStats);
        } catch (error) {
            console.error('Error fetching appointment data:', error);
        }
    };

    const exportToExcel = () => {
        const data = [
            ['Date', 'Total Appointments', 'Completed Appointments', 'Completion %'],
            ...completionData.map(d => [d.date, d.total, d.completed, d.percentage + '%'])
        ];

        const ws = XLSX.utils.aoa_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Completion Rate');
        XLSX.writeFile(wb, 'AppointmentCompletionRate.xlsx');
    };

    return (
        <div style={{ marginRight: '4%' }}>
            <h2 className="report-heading">Appointment Completion Rate Report</h2>

            <div className="report-filter">
                <div className="row">
                    <div className="col-md-2">
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="report-date-input"
                        />
                    </div>
                    <div className="col-md-2">
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="report-date-input"
                        />
                    </div>
                    <div className="col-md-2">
                        <button onClick={fetchAppointments} className="report-filter-button">
                            Generate Report
                        </button>
                    </div>
                </div>
            </div>

            <div className="scrollable-table-container">
                <table className="report-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Total Appointments</th>
                            <th>Completed Appointments</th>
                            <th>Completion %</th>
                        </tr>
                    </thead>
                    <tbody>
                        {completionData.map((item, index) => (
                            <tr key={index}>
                                <td>{item.date}</td>
                                <td>{item.total}</td>
                                <td>{item.completed}</td>
                                <td>{item.percentage}%</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <br /><br />
            <div className="report-buttons">
                <button className="report-button" onClick={exportToExcel}>
                    Download as Excel
                </button>
            </div>
        </div>
    );
};

export default AppointmentCompletionRateReport;
