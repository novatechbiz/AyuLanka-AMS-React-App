import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Modal, Button, Form } from "react-bootstrap";
import { fetchAllLocations, fetchIssuedTokens } from "../../services/appointmentSchedulerApi.js";
import { FiRefreshCw } from "react-icons/fi";

const TokenDashboard = () => {
    const [locations, setLocations] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [selectedAppt, setSelectedAppt] = useState(null);
    const [newLocationId, setNewLocationId] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [locRes, apptRes] = await Promise.all([
                fetchAllLocations(),
                fetchIssuedTokens()
            ]);

            setLocations(locRes);
            setAppointments(apptRes);
        } catch (err) {
            console.error("Error fetching dashboard data", err);
        }
    };

    // Split locations by type
    const primeCareLocations = locations ? locations.filter(l => l.locationTypeId === 1) : [];
    const eliteCareLocations = locations ? locations.filter(l => l.locationTypeId === 2) : [];

    const getAppointmentsByLocation = (locationId) => {
        return (appointments || []).filter(a => a.locationId === locationId);
    };

    // 🔹 Handle drag & drop
    const handleDragEnd = (result) => {
        if (!result.destination) return;

        const { destination, draggableId } = result;
        const apptId = parseInt(draggableId, 10);

        setAppointments(prev =>
            prev.map(appt =>
                appt.id === apptId ? { ...appt, locationId: parseInt(destination.droppableId, 10) } : appt
            )
        );

        // TODO: Call API here to update appointment location
    };

    // 🔹 Handle Save from modal
    const handleSaveLocation = () => {
        if (!selectedAppt || !newLocationId) return;

        setAppointments(prev =>
            prev.map(appt =>
                appt.id === selectedAppt.id ? { ...appt, locationId: parseInt(newLocationId, 10) } : appt
            )
        );

        // TODO: Call API here to update appointment location
        // await updateAppointmentLocation(selectedAppt.id, newLocationId);

        setSelectedAppt(null);
        setNewLocationId("");
    };

    const renderLocations = (locationList) => {
        return (
            <div className="row">
                {locationList.map(loc => (
                    <div key={loc.id} className="col-md-4 mb-4">
                        <div className="card h-100">
                            <div className="card-header">
                                <h5 className="mb-0">{loc.name}</h5>
                            </div>
                            <div className="card-body" style={{ minHeight: "200px" }}>
                                <Droppable droppableId={loc.id.toString()}>
                                    {(provided) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.droppableProps}
                                            className="d-flex flex-wrap gap-2"
                                        >
                                            {getAppointmentsByLocation(loc.id).map((appt, index) => (
                                                <Draggable key={appt.id} draggableId={appt.id.toString()} index={index}>
                                                    {(provided) => (
                                                        <div
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            className="card text-center"
                                                            style={{
                                                                width: "100px",
                                                                height: "80px",
                                                                background: "linear-gradient(135deg, #9b59b6, #8e44ad)",
                                                                borderRadius: "15px",
                                                                boxShadow: "0 6px 12px rgba(0,0,0,0.15)",
                                                                color: "#fff",
                                                                cursor: "pointer",
                                                                transition: "transform 0.2s ease, box-shadow 0.2s ease",
                                                                ...provided.draggableProps.style,
                                                            }}
                                                            onMouseEnter={(e) => {
                                                                e.currentTarget.style.transform = "scale(1.05)";
                                                                e.currentTarget.style.boxShadow = "0 10px 20px rgba(0,0,0,0.2)";
                                                            }}
                                                            onMouseLeave={(e) => {
                                                                e.currentTarget.style.transform = "scale(1)";
                                                                e.currentTarget.style.boxShadow = "0 6px 12px rgba(0,0,0,0.1)";
                                                            }}
                                                            onClick={() => {
                                                                setSelectedAppt(appt);
                                                                setNewLocationId(appt.locationId.toString());
                                                            }}
                                                        >
                                                            <div style={{ fontWeight: "bold", fontSize: "20px", color: "#fffbf5" }}>
                                                                {appt.tokenNo}
                                                            </div>
                                                            <div style={{ fontSize: "14px", marginTop: "5px", color: "#f7f7f7" }}>
                                                                {appt.customerName}
                                                            </div>
                                                        </div>
                                                    )}
                                                </Draggable>
                                            ))}
                                            {provided.placeholder}
                                        </div>
                                    )}
                                </Droppable>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="container mt-4">
            <div className="row">
                <div className="col-md-10">
                    <h3>Token Dashboard</h3>
                </div>
                <div className="col-md-2">
                    <button
                        onClick={fetchData}
                        className="btn btn-danger"

                    >
                        <FiRefreshCw size={18} /> Refresh
                    </button>
                </div>
            </div>
            <DragDropContext onDragEnd={handleDragEnd}>
                {/* Prime Care */}
                <div className="card mt-3">
                    <div className="card-header bg-primary text-white">
                        Prime Care
                    </div>
                    <div className="card-body">
                        {renderLocations(primeCareLocations)}
                    </div>
                </div>

                {/* Elite Care */}
                <div className="card mt-3">
                    <div className="card-header bg-success text-white">
                        Elite Care
                    </div>
                    <div className="card-body">
                        {renderLocations(eliteCareLocations)}
                    </div>
                </div>
            </DragDropContext>

            {/* 🔹 Modal for updating location */}
            <Modal show={!!selectedAppt} onHide={() => setSelectedAppt(null)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Update Location</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label>Select Location</Form.Label>
                            <Form.Control
                                as="select"
                                value={newLocationId}
                                onChange={(e) => setNewLocationId(e.target.value)}
                            >
                                <option value="">-- Select --</option>
                                {locations.map(loc => (
                                    <option key={loc.id} value={loc.id}>
                                        {loc.name}
                                    </option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setSelectedAppt(null)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleSaveLocation}>
                        Save
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default TokenDashboard;
