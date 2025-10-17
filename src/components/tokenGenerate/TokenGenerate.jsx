import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import resourceTimeGridPlugin from '@fullcalendar/resource-timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import Modal from 'react-modal';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './TokenGenerate.css'; // Ensure this file contains your custom styles
import { fetchAppointmentsByDateRange, fetchTokensByDate, deleteAppointment, fetchEmployees, fetchEmployeeSchedule, fetchPrimeCareTreatmentLocations, addAppointment, fetchAppointments, fetchTreatmentTypesByLocation, fetchAppointmentDetails, fetchLeaveData, fetchDayOffsData, fetchShiftsData } from '../../services/appointmentSchedulerApi.js';
import { ConfirmationModal } from '../confirmationModal/confirmationModal.jsx';
import { NotificationComponent } from '../notificationComponent/notificationComponent.jsx';
import AppointmentModalComponent from '../appointmentModalComponent/appointmentModalComponent.jsx';
import moment from 'moment';
import { Autocomplete, TextField } from '@mui/material';
import { ConfirmationModalForValidation } from '../confirmationModalForValidation/confirmationModalForValidation.jsx';

Modal.setAppElement('#root');

function TokenGenerate() {
    const [currentEvents, setCurrentEvents] = useState([]);
    const [dropEvent, setDropEvent] = useState([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedResource, setSelectedResource] = useState({});
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [isConfirmModalOpenForValidation, setIsConfirmModalOpenForValidation] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [modalContent, setModalContent] = useState({ type: '', message: '' });
    const [appointmentData, setAppointmentData] = useState({
        scheduleDate: new Date(),
        employeeId: '',
        secondaryEmployeeId: '',
        doctorEmployeeId: '',
        customerName: '',
        contactNo: '',
        tokenNo: '',
        tokenIssueTime: new Date(),
        resourceId: '',
        remarks: '',
        locationId: '',
        mainTreatmentArea: '',
        isTokenIssued: false,
        treatmentTypeId: [], // Store selected treatment type IDs as an array
        appoinmentTreatments: [], // Initialize appoinmentTreatments as an empty array
    });
    const [employees, setEmployees] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [treatmentTypes, setTreatmentTypes] = useState([]);
    const [resources, setResources] = useState([]);
    const [selectedEventId, setSelectedEventId] = useState(null);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [notification, setNotification] = useState({ message: '', type: '' });
    const [formErrors, setFormErrors] = useState({
        customerName: false,
        contactNo: false,
        treatmentTypeId: false,
        // employeeId: false,
        scheduleDate: false
    });
    const [startTime, setStartTime] = useState(new Date());
    const [endTime, setEndTime] = useState(new Date());
    const [actualStartTime, setActualStartTime] = useState(null);
    const [actualEndTime, setActualEndTime] = useState(null);
    const [actualSecondStartTime, setActualSecondStartTime] = useState(null);
    const [actualSecondEndTime, setActualSecondEndTime] = useState(null);
    const [isConfirmed, setIsConfirmed] = useState(false);
    const [isClickedHandleSubmit, setIsClickedHandleSubmit] = useState(false);

    const [selectedDate, setSelectedDate] = useState(moment().format("YYYY-MM-DD"));
    const [bookedTokens, setBookedTokens] = useState([]);
    const [locationType, setLocationType] = useState("1");
    const [eliteAppointments, setEliteAppointments] = useState([]);
    const [selectedEliteAppointment, setSelectedEliteAppointment] = useState(null);
    const [selectedTokenNo, setSelectedTokenNo] = useState(null);

    // Read values from env
    const rows = Number(process.env.REACT_APP_TOTAL_ROWS) || 15;
    const cols = Number(process.env.REACT_APP_TOKENS_PER_ROW) || 10;
    const startHour = Number(process.env.REACT_APP_APPOINTMENT_START_HOUR) || 7; // 7 AM
    const totalTokens = rows * cols;

    useEffect(() => {
        const loadAppointments = async () => {
            try {
                const tokens = await fetchTokensByDate(selectedDate);
                setBookedTokens(tokens)
                console.log("tokens:", tokens);
                // setState(appointments) if you want to store them
            } catch (err) {
                console.error("Failed to fetch tokens:", err);
            }
        };

        loadAppointments();
    }, [selectedDate]);

    useEffect(() => {
        if (locationType === "2") {
            const loadAppointments = async () => {
                try {
                    const appointments = await fetchAppointmentsByDateRange(selectedDate, selectedDate);
                    console.log('setEliteAppointments', appointments)
                    setEliteAppointments(appointments); // Format as needed for FullCalendar
                } catch (error) {
                    console.error('Error fetching events for date range:', error);
                }
            };

            loadAppointments();
        }
    }, [locationType]);


    // Fetch Employees and Treatment Types from API
    useEffect(() => {
        console.log('appointmentData scheduleDate', appointmentData)
        const loadData = async () => {
            try {
                const [empData, treatmentLocationData, treatmentTypesbyLocations] = await Promise.all([
                    fetchEmployees(),
                    fetchPrimeCareTreatmentLocations(),
                    fetchTreatmentTypesByLocation()
                ]);

                // Filter employees with designationCode 'MA'
                const filteredEmployees = empData.filter(employee => employee.designation?.designationCode === 'MA');
                const filteredDoctors = empData.filter(employee => employee.designation?.designationCode === 'ADT');

                setEmployees(filteredEmployees);
                setDoctors(filteredDoctors);
                setResources(treatmentLocationData);
                setTreatmentTypes(treatmentTypesbyLocations);

                setAppointmentData(prevState => ({
                    ...prevState,
                    startTime: startTime
                }));
            } catch (error) {
                console.error('Error loading data from API:', error);
            }
        };

        loadData();
    }, []);


    // 🔹 Extract booked token numbers as integers
    const addedTokens = bookedTokens
        .map((a) => parseInt(a.tokenNo, 10))
        .filter((n) => !isNaN(n));

    const renderTokens = () => {
        let tokenNumber = 1;
        const tokenLayout = [];

        for (let r = 0; r < rows; r++) {
            const rowStartHour = startHour + r;
            const rowEndHour = rowStartHour + 1;
            const timeRange = `${rowStartHour.toString().padStart(2, "0")}:00 - ${rowEndHour.toString().padStart(2, "0")}:00`;

            tokenLayout.push(
                <div className="d-flex align-items-center mb-2" key={r}>
                    {/* Time Label */}
                    <div className="me-3 text-center" style={{ width: "100px" }}>
                        <strong>{timeRange}</strong>
                    </div>

                    {/* Tokens */}
                    <div className="d-flex flex-wrap flex-grow-1">
                        {Array.from({ length: cols }, (_, c) => {
                            if (tokenNumber > totalTokens) return null;
                            const current = tokenNumber++;

                            // Find booked token object for this number
                            const booked = bookedTokens.find(bt => parseInt(bt.tokenNo, 10) === current);

                            let btnClass = "btn-warning"; // default for free
                            if (booked) {
                                btnClass = booked.chitNo ? "btn-danger" : "btn-success";
                            }

                            return (
                                <div
                                    key={current}
                                    className="p-1"
                                    style={{ flex: `0 0 ${100 / cols}%` }}
                                >
                                    <button
                                        className={`btn p-1 ${btnClass}`}
                                        style={{ width: '80px', height: '80px' }}
                                        onClick={() => handleTokenClick(current)}
                                    >
                                        {current}
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>
            );
        }

        return tokenLayout;
    };


    const handleTokenClick = (tokenNumber) => {
        setSelectedTokenNo(tokenNumber);
        // Check if this token is already booked
        const existing = bookedTokens.find(
            (a) => parseInt(a.tokenNo, 10) === tokenNumber
        );

        
        console.log('existinggggggggggg', existing)

        if (existing) {
            let startTime = null;
            if (existing.fromTime) {
                const [h, m, s] = existing.fromTime.split(":").map(Number);
                startTime = new Date(existing.scheduleDate);
                startTime.setHours(h, m, s, 0);
            }

            let endTime = null;
            if (existing.toTime) {
                const [h, m, s] = existing.toTime.split(":").map(Number);
                endTime = new Date(existing.scheduleDate);
                endTime.setHours(h, m, s, 0);
            }

            // If token is booked, populate appointmentData with existing appointment
            console.log('existing.scheduleDate', existing.scheduleDate)
            console.log('new Date(existing.scheduleDate)', new Date(existing.scheduleDate))
            setAppointmentData({
                id: existing.id,
                scheduleDate: new Date(existing.scheduleDate),
                customerName: existing.customerName || '',
                contactNo: existing.contactNo || '',
                tokenNo: tokenNumber,
                chitNo: existing.chitNo,
                startTime: startTime,
                endTime: endTime,
                actualStartTime: existing.actualFromTime,
                actualEndTime: existing.actualToTime,
                actualSecondStartTime: existing.actualFromTimeSecond,
                actualSecondEndTime: existing.actualToTimeSecond,
                locationId: existing.locationId,
                employeeId: existing.employeeId ? existing.employeeId.toString() : 0,
                secondaryEmployeeId: existing.secondaryEmployeeId ? existing.secondaryEmployeeId.toString() : 0,
                doctorEmployeeId: existing.doctorEmployeeId ? existing.doctorEmployeeId.toString() : 0,
                treatmentTypeId: existing.appointmentTreatments?.map(t => t.treatmentTypeId) || [],
                remarks: existing.remarks,
                appoinmentTreatments: existing.appointmentTreatments || [],
            });
            setStartTime(startTime)
            setEndTime(endTime)
            setSelectedEventId(existing.id)
            setLocationType(existing.mainTreatmentArea)

            if(existing.mainTreatmentArea == "2") {
                setSelectedEliteAppointment(appointmentData);
            }
        } else {
            // If token is free, populate only tokenNo and date
            setAppointmentData(prevState => ({
                ...prevState,
                tokenNo: tokenNumber,
                scheduleDate: selectedDate, // keep current selected date
            }));
        }

        setModalIsOpen(true);
    };

    const handleTimeChange = (date, name) => {
        console.log('treatmentTypes', treatmentTypes);

        if (name === 'startTime') {
            setNotification({ message: '', type: '' });

            // Check required fields and set errors
            const errors = {
                customerName: !appointmentData.customerName,
                contactNo: !appointmentData.contactNo,
                treatmentTypeId: !appointmentData.treatmentTypeId,
                // employeeId: !appointmentData.employeeId,
                scheduleDate: !appointmentData.scheduleDate
            };

            setFormErrors(errors);

            // If any field has an error, stop the form submission
            if (Object.values(errors).some(error => error)) {
                console.log('Validation errors', errors);
                return;
            }

            setStartTime(date);

            let totalDurationMilliseconds = 0; // Initialize total duration for multiple treatments

            // Iterate over the selected treatment type IDs
            appointmentData.treatmentTypeId.forEach(option => {
                // Find the treatment that matches the selected treatmentTypeId inside the treatmentType object
                const selectedTreatment = treatmentTypes.find(t => t.id == option);
                console.log(`Dropdown changed: treatmentTypeId = ${option}, selectedTreatment = `, selectedTreatment);  // Debugging line

                if (selectedTreatment) {
                    let durationMilliseconds = 0;

                    const { durationHours, durationMinutes } = selectedTreatment; // Destructure duration fields

                    if (durationHours || durationMinutes) {
                        // Calculate duration in milliseconds
                        durationMilliseconds = (durationHours * 3600 + (durationMinutes || 0) * 60) * 1000;

                        // Accumulate total duration
                        totalDurationMilliseconds += durationMilliseconds;
                    }
                }
            });

            // Calculate new end time based on the total duration
            const newEndTime = new Date(date.getTime() + totalDurationMilliseconds);
            setEndTime(newEndTime);

            // Update the appointmentData state with the new startTime and calculated endTime
            setAppointmentData(prevState => ({
                ...prevState,
                startTime: date,
                endTime: newEndTime
            }));
        }

        if (name === 'endTime') {
            setEndTime(date);
            // Update the appointmentData state with the new startTime and calculated endTime
            setAppointmentData(prevState => ({
                ...prevState,
                endTime: date
            }));
        }
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;


        setAppointmentData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleTokenNumberChange = (event) => {
        const { name, value } = event.target;


        setAppointmentData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };
    // Handler for multiple treatment type selection
    const handleMultipleTreatmentTypeChange = (event, value) => {
        // Debugging logs
        console.log('Selected Value:', value);

        // Ensure value is an array
        if (!Array.isArray(value)) {
            console.error("No selected options found");
            return;
        }

        const selectedIds = value.map(option => option.id); // Get IDs from selected options
        console.log('Selected IDs:', selectedIds); // Debugging line

        // Update appointmentData state with selected IDs
        setAppointmentData(prevState => ({
            ...prevState,
            treatmentTypeId: selectedIds
        }));

        // Proceed with the rest of your logic if needed
        if (appointmentData.startTime && selectedIds.length > 0) {
            let totalDurationMilliseconds = 0;

            selectedIds.forEach(id => {
                const selectedTreatment = treatmentTypes.find(t => t.id == id);
                if (selectedTreatment) {
                    let durationMilliseconds = (selectedTreatment.durationHours * 3600 +
                        (selectedTreatment.durationMinutes || 0) * 60) * 1000;
                    totalDurationMilliseconds += durationMilliseconds; // Accumulate total duration
                }
            });

            const newEndTime = new Date(appointmentData.startTime.getTime() + totalDurationMilliseconds);
            setEndTime(newEndTime);

            setAppointmentData(prevState => ({
                ...prevState,
                endTime: newEndTime
            }));
        }
    };

    function formatTimeForCSharp(date) {
        console.log('formatTimeForCSharp', date)
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
    }


    const handleSubmit = async (event, isTokenIssue = false) => {
        console.log('handleSubmit appointmentData', appointmentData)
        setIsClickedHandleSubmit(true)
        if (event) event.preventDefault();

        setNotification({ message: '', type: '' });

        // Check required fields and set errors
        const errors = {
            customerName: !appointmentData.customerName,
            contactNo: !appointmentData.contactNo,
            treatmentTypeId: !appointmentData.treatmentTypeId,
            // employeeId: !appointmentData.employeeId,
            scheduleDate: !appointmentData.scheduleDate
        };

        setFormErrors(errors);

        // If any field has an error, stop the form submission
        if (Object.values(errors).some(error => error)) {
            console.log('Validation errors', errors);
            return;
        }
        const userId = sessionStorage.getItem('userId');

        // Map treatment type IDs to AppoinmentTreatmentRequestModel
        const treatmentModels = appointmentData.treatmentTypeId.map(treatmentTypeId => ({
            Id: 0, // Assuming new appointment (you can set as needed)
            AppoinmentId: null, // Since it's a new appointment
            TreatmentTypeId: parseInt(treatmentTypeId, 10) // Convert to integer
        }));

        const formatDateOnly = (date) => {
            const d = (date instanceof Date) ? date : new Date(date);
            return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, "0")}-${d.getDate().toString().padStart(2, "0")}`;
        };

        const appointmentDataToSend = {
            Id: appointmentData.id != 0 ? appointmentData.id : 0,
            ScheduleDate: formatDateOnly(appointmentData.scheduleDate),
            CustomerName: appointmentData.customerName,
            ContactNo: appointmentData.contactNo,
            EmployeeId: appointmentData.employeeId != "" ? appointmentData.employeeId : null,
            SecondaryEmployeeId: appointmentData.secondaryEmployeeId != "" ? appointmentData.secondaryEmployeeId : null,
            DoctorEmployeeId: appointmentData.doctorEmployeeId != "" ? appointmentData.doctorEmployeeId : null,
            ActualFromTime: appointmentData.actualStartTime != "" ? appointmentData.actualStartTime : null,
            ActualToTime: appointmentData.actualEndTime != "" ? appointmentData.actualEndTime : null,
            ActualFromTimeSecond: appointmentData.actualSecondStartTime != "" ? appointmentData.actualSecondStartTime : null,
            ActualToTimeSecond: appointmentData.actualSecondEndTime != "" ? appointmentData.actualSecondEndTime : null,
            Remarks: appointmentData.remarks,
            FromTime: formatTimeForCSharp(appointmentData.startTime),
            ToTime: formatTimeForCSharp(appointmentData.endTime),
            EnteredBy: userId,
            EnteredDate: new Date().toISOString(),
            TokenNo: appointmentData.tokenNo,
            LocationId: appointmentData.locationId != "" ? appointmentData.locationId : null,
            IsTokenIssued: isTokenIssue ? true : false,
            MainTreatmentArea: locationType,
            appoinmentTreatments: treatmentModels
        };

        console.log('appointmentDataToSend', appointmentDataToSend);
        console.log('isConfirmModalOpenForValidation', isConfirmModalOpenForValidation)
        //if(!isConfirmModalOpenForValidation) {
        try {
            const createdAppointment = await addAppointment(appointmentDataToSend);
            console.log('Appointment created:', createdAppointment);
            if (appointmentData.id !== 0 && appointmentData.id !== undefined) {
                setModalContent({ type: 'success', message: 'Appointment updated successfully!' });
            } else {
                setModalContent({ type: 'success', message: 'Appointment created successfully!' });
            }
            setShowModal(true);
        } catch (error) {
            console.error('Failed to create appointment:', error);
            if (appointmentData.id != 0 && appointmentData.id != undefined) {
                setModalContent({ type: 'error', message: 'Failed to update appointment' });
            } else {
                setModalContent({ type: 'error', message: 'Failed to create appointment' });
            }
            setShowModal(true);
            return;
        }

        refreshAppointments();  // Fetch appointments again or adjust state directly
        setModalIsOpen(false);
        resetAppointmentForm(); // Clear or reset the form state
        setSelectedResource({});
        // }
    };


    const refreshAppointments = async () => {
        window.location.reload();
    };

    const resetAppointmentForm = () => {
        setAppointmentData({
            id: undefined,
            scheduleDate: new Date(),
            treatmentTypeId: [],
            employeeId: '',
            secondaryEmployeeId: '',
            doctorEmployeeId: '',
            customerName: '',
            contactNo: '',
            tokenNo: '',
            tokenIssueTime: new Date(),
            resourceId: '',
            remarks: '',
            locationId: '',
            appoinmentTreatments: []
        });
        setSelectedEventId(null);
        setSelectedEmployee(null);
        setNotification({ message: '', type: '' });
        setFormErrors({
            customerName: false,
            contactNo: false,
            treatmentTypeId: false,
            scheduleDate: false
        });
        setCurrentEvents([]);
        setDropEvent([]);
        setModalIsOpen(false);
        setSelectedResource({});
        setIsConfirmModalOpen(false);
        setIsConfirmModalOpenForValidation(false);
        setShowModal(false);
        setModalContent({ type: '', message: '' });
        setStartTime(new Date());
        setEndTime(new Date());
        setActualStartTime(null);
        setActualEndTime(null);
        setActualSecondStartTime(null);
        setActualSecondEndTime(null);
        setIsConfirmed(false);
        setIsClickedHandleSubmit(false);
    };


    const handleDelete = async () => {
        try {
            console.log('appointment dataaaaaaaaa', appointmentData);
            const userId = sessionStorage.getItem('userId');
            await deleteAppointment(selectedEventId, userId, appointmentData.remarks);
            const updatedEvents = currentEvents.filter(event => event.id !== selectedEventId);
            setCurrentEvents(updatedEvents);
            setSelectedEventId(null);

            refreshAppointments();  // Fetch appointments again or adjust state directly
            setModalIsOpen(false);
            resetAppointmentForm(); // Clear or reset the form state
            setSelectedResource({});
        } catch (error) {
            console.error('Failed to delete appointment:', error);
            alert('Could not delete the appointment. Please try again.');
        }
        setIsConfirmModalOpen(false);  // Close the confirmation modal
        setModalIsOpen(false);  // Close the main modal
    };

    const handleValidationConfirmation = async () => {
        console.log('handleValidationConfirmation')
        setIsConfirmModalOpenForValidation(false);  // Close the confirmation modal
        setModalIsOpen(false);  // Close the main modal
        setIsConfirmed(true);
    };

    const closeModal = () => {
        console.log("Opening confirmation modal");
        setIsConfirmModalOpen(true);  // This should trigger the modal to open
    };


    const closeModalAndReset = () => {
        refreshAppointments();  // Refresh appointments or reset state as needed
        resetAppointmentForm(); // Reset form and all necessary states
        setSelectedResource({}); // Reset selected resource
        setModalIsOpen(false);   // Close the modal
    };

    useEffect(() => {
        console.log("appointment dataaaaaaaa:", appointmentData);
        console.log("locationTypeeeeeeeeeee", locationType);

    }, [appointmentData, locationType]);

    return (
        <div className="container">
            <h2 className="token-header">
                Token Generate -{" "}
                <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => {
                        const date = e.target.value;
                        setSelectedDate(date);
                        setAppointmentData(prevState => ({
                            ...prevState,
                            scheduleDate: date
                        }));
                    }}
                    className="border rounded p-1"
                />
            </h2><br />
            <NotificationComponent
                message={notification.message}
                type={notification.type}
                onClose={() => setNotification({ message: '', type: '' })}
            />
            {renderTokens()}

            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModalAndReset}
                className="Modal custom-modal"
                closeTimeoutMS={300}
                overlayClassName="Overlay"
                contentLabel="Create Appointment"
            >
                <div className="modal-dialog modal-lg">
                    <div className="modal-content custom-modal-content">
                        <div className="modal-header custom-modal-header">
                            <div className="container-fluid">
                                <div className="row">
                                    <div className="col-4">
                                        <h5 className="modal-title-appointment custom-modal-title-appointment">Create Appointment</h5>
                                    </div>
                                    <div className="col-2">
                                        <input className="form-control"
                                            type="text"
                                            id="tokenNo"
                                            name="tokenNo"
                                            style={{ textAlign: 'center', fontSize: '20px', fontWeight: 'bold', backgroundColor: '#ffc107' }}
                                            value={appointmentData.tokenNo}
                                            onChange={handleTokenNumberChange} />
                                    </div>
                                    <div className="col-6" style={{ textAlign: 'right' }}>
                                        <button type="button" className="close custom-close" style={{ width: '50px' }} onClick={closeModalAndReset}>
                                            <span>&times;</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <NotificationComponent
                            message={notification.message}
                            type={notification.type}
                            onClose={() => setNotification({ message: '', type: '' })}
                        />
                        <div className="row">
                            <div className="col-md-6 form-group">
                                <label htmlFor="locationType">Location Type <span className="text-danger">*</span></label>
                                <select
                                    id="locationType"
                                    className="form-control"
                                    value={locationType}
                                    disabled={appointmentData.id}
                                    onChange={(e) => setLocationType(e.target.value)}
                                >
                                    <option value="1">Prime Care</option>
                                    <option value="2">Elite Care</option>
                                </select>
                            </div>
                        </div>
                        {locationType == "2" && !appointmentData.id && (
                            <div className="row">
                                <div className="col-md-12 form-group">
                                    <label htmlFor="eliteAppointments">Select Existing Appointment <span className="text-danger">*</span></label>
                                    <select
                                        id="eliteAppointments"
                                        className="form-control"
                                        value={selectedEliteAppointment?.id || ""}
                                        onChange={(e) => {
                                            const appt = eliteAppointments.find(a => a.id === parseInt(e.target.value));
                                            setSelectedEliteAppointment(appt);
                                            if (appt) {
                                                // auto-fill appointment form
                                                if (appt) {
                                                    let startTime = null;
                                                    if (appt.fromTime) {
                                                        const [h, m, s] = appt.fromTime.split(":").map(Number);
                                                        startTime = new Date(appt.scheduleDate);
                                                        startTime.setHours(h, m, s, 0);
                                                    }

                                                    let endTime = null;
                                                    if (appt.toTime) {
                                                        const [h, m, s] = appt.toTime.split(":").map(Number);
                                                        endTime = new Date(appt.scheduleDate);
                                                        endTime.setHours(h, m, s, 0);
                                                    }
                                                    setAppointmentData({
                                                        ...appointmentData,
                                                        id: appt.id,
                                                        customerName: appt.customerName,
                                                        contactNo: appt.contactNo,
                                                        scheduleDate: new Date(appt.scheduleDate),
                                                        startTime: startTime,
                                                        endTime: endTime,
                                                        locationId: appt.locationId,
                                                        actualStartTime: appt.actualFromTime,
                                                        actualEndTime: appt.actualToTime,
                                                        actualSecondStartTime: appt.actualFromTimeSecond,
                                                        actualSecondEndTime: appt.actualToTimeSecond,
                                                        employeeId: appt.employeeId ? appt.employeeId.toString() : 0,
                                                        secondaryEmployeeId: appt.secondaryEmployeeId ? appt.secondaryEmployeeId.toString() : 0,
                                                        doctorEmployeeId: appt.doctorEmployeeId ? appt.doctorEmployeeId.toString() : 0,
                                                        remarks: appt.remarks,
                                                        treatmentTypeId: appt.appointmentTreatments
                                                            ? appt.appointmentTreatments.map(t => t.treatmentTypeId)
                                                            : [],
                                                        appoinmentTreatments: appt.appointmentTreatments || [],
                                                    });
                                                    setStartTime(startTime)
                                                    setEndTime(endTime)
                                                    setSelectedEventId(appt.id)
                                                }
                                            }
                                        }}
                                    >
                                        <option value="">-- Select Appointment --</option>
                                        {eliteAppointments.map(appt => (
                                            <option key={appt.id} value={appt.id}>
                                                {appt.customerName} - {appt.scheduleDate}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        )}
                        {(locationType == "1" || (locationType == "2" && selectedEliteAppointment)) && (
                            <form onSubmit={handleSubmit} className="modal-appoinment-body modal-body custom-modal-body">
                                <div className="container-fluid">
                                    <div className="row">
                                        <div className="col-md-6 form-group">
                                            <label htmlFor="customerName">Customer Name <span className="text-danger">*</span></label>
                                            <input
                                                className={`form-control ${formErrors.customerName ? 'is-invalid' : ''}`}
                                                type="text"
                                                id="customerName"
                                                name="customerName"
                                                value={appointmentData.customerName}
                                                onChange={handleInputChange} required
                                            />
                                        </div>
                                        <div className="col-md-6 form-group">
                                            <label htmlFor="contactNo">Contact Number <span className="text-danger">*</span></label>
                                            <input className={`form-control ${formErrors.contactNo ? 'is-invalid' : ''}`} type="text" id="contactNo" name="contactNo" value={appointmentData.contactNo} onChange={handleInputChange} required />
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-12 col-sm-12 form-group">
                                            <label htmlFor="treatmentTypeId">Treatment Type(s) <span className="text-danger">*</span></label>
                                            <Autocomplete
                                                multiple
                                                options={treatmentTypes}
                                                getOptionLabel={(option) =>
                                                    option.treatmentShortCode
                                                        ? `${option.name} - ${option.treatmentShortCode}`
                                                        : option.name
                                                } // Adjust based on your data structure
                                                value={treatmentTypes.filter(type => appointmentData.treatmentTypeId.includes(type.id))} // Selected values
                                                onChange={(event, value) => handleMultipleTreatmentTypeChange(event, value)} // Pass the selected values directly
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        variant="outlined"
                                                        error={!!formErrors.treatmentTypeId}
                                                        required
                                                    />
                                                )}
                                            />
                                        </div>
                                    </div>
                                    <div className='row'>
                                        <div className="col-md-6 form-group">
                                            <label htmlFor="scheduleDate">Schedule Date <span className="text-danger">*</span></label><br />
                                            <DatePicker
                                                disabled
                                                className={`form-control ${formErrors.scheduleDate ? 'is-invalid' : ''}`}
                                                selected={appointmentData.scheduleDate}
                                                dateFormat="MMMM d, yyyy"
                                            />
                                        </div>
                                        <div className="col-md-6 form-group">
                                            <label htmlFor="startTime">Start Time <span className="text-danger">*</span></label><br />
                                            <DatePicker
                                                onChange={(date) => handleTimeChange(date, 'startTime')}
                                                className="form-control"
                                                selected={startTime}
                                                showTimeSelect
                                                showTimeSelectOnly
                                                timeIntervals={15}
                                                timeCaption="Time"
                                                dateFormat="h:mm aa"
                                            />
                                        </div>
                                    </div>
                                    <div className="custom-modal-footer row">
                                        <div className="col-6 p-2">
                                            <button
                                                onClick={closeModal}
                                                className="btn btn-danger w-100"
                                                disabled={!appointmentData.id || appointmentData.chitNo != null}
                                            >
                                                Delete
                                            </button>
                                        </div>

                                        <div className="col-6 p-2">
                                            <button
                                                onClick={(e) => handleSubmit(e, false)}
                                                className="btn btn-success w-100"
                                            >
                                                {!appointmentData.id ? "Create" : "Update"}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="custom-modal-footer row">
                                        <div className="col-4 p-2">
                                            { appointmentData.chitNo != null && (
                                                <label style={{fontSize: '18px', fontWeight: 'bold', color: 'red'}}>Chit No: {appointmentData.chitNo}</label>
                                            )}
                                        </div>
                                        <div className="col-4 p-2">&nbsp;</div>
                                        <div className="col-4 p-2">
                                            <button
                                                onClick={(e) => handleSubmit(e, true)}
                                                className="btn btn-warning w-100"
                                                disabled={!appointmentData.id || appointmentData.chitNo != null}
                                            >
                                                Issue Token
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </Modal >
            <ConfirmationModal
                isOpen={isConfirmModalOpen}
                onClose={() => setIsConfirmModalOpen(false)}
                onConfirm={handleDelete}
            />

            <ConfirmationModalForValidation
                isOpen={isConfirmModalOpenForValidation}
                onClose={() => setIsConfirmModalOpenForValidation(false)}
                onConfirm={handleValidationConfirmation}
            />

            <AppointmentModalComponent
                show={showModal}
                onClose={closeModal}
                type={modalContent.type}
                message={modalContent.message}
            />
        </div >
    );
}

export default TokenGenerate;
