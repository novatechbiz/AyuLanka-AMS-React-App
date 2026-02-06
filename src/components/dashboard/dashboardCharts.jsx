import React, { useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import {
    LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, Legend,
    ResponsiveContainer, CartesianGrid
  } from 'recharts';  
import { fetchAllDashboardChartsDatabyDateRange, fetchDashboardSummaryByDateRange, fetchDashboardDetailsByDate  } from '../../services/appointmentSchedulerApi';
import DetailTable from './detailTable';
import SummaryTable from './summaryTable';

const Dashboard = () => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(null);

    const [summaryData, setSummaryData] = useState([]);
    const [detailData, setDetailData] = useState([]);

    const [showSummary, setShowSummary] = useState(false);
    const [showDetails, setShowDetails] = useState(false);


    const loadAppointments = async () => {
        if (!startDate || !endDate) {
        alert('Please select start and end dates');
        return;
        }

        try {
            setLoading(true);

            const appointments = await fetchAllDashboardChartsDatabyDateRange(
                new Date(startDate),
                new Date(endDate)
            );

            setData(appointments);

        } catch (err) {
            console.error("Failed to fetch dashboard data:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleChartClick = async (category) => {
        setSelectedCategory(category);
      
        const res = await fetchDashboardSummaryByDateRange(startDate, endDate, category);
        setSummaryData(res);
        setShowSummary(true);
    };

    const handleSummaryRowClick = async (row) => {
        console.log(row)
        const res = await fetchDashboardDetailsByDate(
          row.date,
          selectedCategory,
          row.type // New / Repeat / Converted
        );
      
        setDetailData(res);
        setShowDetails(true);
    };
      
    const renderLineChart = (title, data, lines, category) => (
        <div className="card p-3 mb-4 shadow-sm">
            <div className='row'>
                <div className='col-md-8'>
                    <h5 className="text-center fw-semibold">{title}</h5>
                </div>
                <div className='col-md-4'>
                <button
                    className="btn btn-warning btn-sm"
                    onClick={() => {
                        if (data.length > 0) {
                            handleChartClick(category);
                        }
                    }}
                >
                    Detail View
                </button>
                </div>
            </div>
          
          <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.4} />
                <XAxis dataKey="date" 
                        tick={{ fontSize: 12 }} 
                        tickFormatter={(date) => date.split('T')[0]}  />
                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
        
                {lines.map(line => (
                    <Line
                        key={line.dataKey}
                        type="monotone"
                        dataKey={line.dataKey}
                        name={line.name}
                        stroke={line.color}
                        strokeWidth={3}
                        dot={{ r: 4 }}
                        activeDot={{ r: 7 }}
                    />
                ))}
              </LineChart>
          </ResponsiveContainer>
        </div>
    );
    

    const renderBarChart = (title, data) => (
        <div className="card p-3 mb-4 shadow-sm">
          <div className='row'>
                <div className='col-md-8'>
                    <h5 className="text-center fw-semibold">{title}</h5>
                </div>
                <div className='col-md-4'>
                <button
                    className="btn btn-warning btn-sm"
                    onClick={() => {
                        if (data.length > 0) {
                            handleChartClick("OPD → Wellness");
                        }
                    }}
                >
                    Detail View
                </button>
                </div>
            </div>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" 
                    tickFormatter={(date) => date.split('T')[0]} />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="opdToWellnessConverted"
                name="OPD → Wellness Conversions"
                fill="#9B59B6"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
    );       

    return (
        <div className="container-fluid">
            {/* Summary Modal */}
            <Modal
            show={showSummary}
            onHide={() => setShowSummary(false)}
            size="lg"
            centered
            >
            <Modal.Header closeButton>
                <Modal.Title>Customer Summary</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <SummaryTable
                data={summaryData}
                category={selectedCategory}
                onRowClick={(row) => {
                    handleSummaryRowClick(row);
                    // Optional: Close summary modal when drilling down
                    // setShowSummary(false);
                }}
                />
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowSummary(false)}>
                Close
                </Button>
            </Modal.Footer>
            </Modal>

            {/* Detail Modal */}
            <Modal
            show={showDetails}
            onHide={() => setShowDetails(false)}
            size="lg"
            centered
            >
            <Modal.Header closeButton>
                <Modal.Title>Appointment Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <DetailTable data={detailData} />
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowDetails(false)}>
                Close
                </Button>
            </Modal.Footer>
            </Modal>


            {/* Date Filters */}
            <div className="row mb-3">
                <div className="col-md-2">
                <input
                    type="date"
                    className="form-control"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                />
                </div>

                <div className="col-md-2">
                <input
                    type="date"
                    className="form-control"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                />
                </div>

                <div className="col-md-2">
                <button
                    className="btn btn-primary w-100"
                    onClick={loadAppointments}
                    disabled={loading}
                >
                    {loading ? 'Loading...' : 'Filter'}
                </button>
                </div>
            </div>
            <br/>
            {/* Charts */}
            <h2>Treatments Analysis Charts</h2>
            <br/>
            <div className="row">
                <div className="col-md-4">
                    {renderLineChart("OPD Treatments", data, [
                        { dataKey: "opdNew", name: "New", color: "#2E86DE" },
                        { dataKey: "opdRepeat", name: "Repeat", color: "#E74C3C" }
                    ], "OPD")}
                </div>

                <div className="col-md-4">
                    {renderLineChart("Wellness Treatments", data, [
                        { dataKey: "wellnessNew", name: "New", color: "#27AE60" },
                        { dataKey: "wellnessRepeat", name: "Repeat", color: "#F39C12" }
                    ], "Wellness")}
                </div>

                <div className="col-md-4">
                    {renderLineChart("OPD + Wellness", data, [
                        { dataKey: "opdWellnessNew", name: "New", color: "#8E44AD" },
                        { dataKey: "opdWellnessRepeat", name: "Repeat", color: "#34495E" }
                    ], "OPD + Wellness")}
                </div>

            </div>
            <div className="row">
                <div className="col-md-4">
                    {renderBarChart("OPD → Wellness Conversions", data)}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
