import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import resourceTimeGridPlugin from '@fullcalendar/resource-timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import Modal from 'react-modal';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './appointmentScheduler.css'; // Ensure this file contains your custom styles
import { deleteAppointment, fetchEmployees, fetchEmployeeSchedule, fetchTreatmentLocations, addAppointment, fetchAppointments, fetchTreatmentTypesByLocation, fetchAppointmentDetails, fetchLeaveData, fetchDayOffsData, fetchShiftsData } from '../../services/appointmentSchedulerApi.js';
import { ConfirmationModal } from '../confirmationModal/confirmationModal.jsx';
import { NotificationComponent } from '../notificationComponent/notificationComponent.jsx';
import AppointmentModalComponent from '../appointmentModalComponent/appointmentModalComponent.jsx';
import moment from 'moment';
import { EmployeeDayOffsModal } from '../employeeDayOffsModal/employeeDayOffsModal.jsx';
import { EmployeeLeavesModal } from '../employeeLeavesModal/employeeLeavesModal.jsx';
import { EmployeeShiftsModal } from '../employeeShiftsModal/employeeShiftsModal.jsx';

Modal.setAppElement('#root');

function AppointmentScheduler() {
    const [currentEvents, setCurrentEvents] = useState([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedResource, setSelectedResource] = useState({});
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [modalContent, setModalContent] = useState({type: '', message: ''});
    const [appointmentData, setAppointmentData] = useState({
        scheduleDate: new Date(),
        treatmentTypeId: '',
        employeeId: '',
        customerName: '',
        contactNo: '',
        tokenNo: '',
        tokenIssueTime: new Date(),
        resourceId: ''
    });
    const [employees, setEmployees] = useState([]);
    const [treatmentTypes, setTreatmentTypes] = useState([]);
    const [resources, setResources] = useState([]);
    const [selectedEventId, setSelectedEventId] = useState(null);
    const [notification, setNotification] = useState({ message: '', type: '' });
    const [formErrors, setFormErrors] = useState({
        customerName: false,
        contactNo: false,
        treatmentTypeId: false,
        employeeId: false,
        scheduleDate: false
    });

    const [isDayOffModalOpen, setIsDayOffModalOpen] = useState(false);
    const [isLeavesModalOpen, setIsLeavesModalOpen] = useState(false);
    const [isShiftsModalOpen, setIsShiftsModalOpen] = useState(false);
    const [dayOffsData, setDayOffsData] = useState([]);
    const [leavesData, setLeavesData] = useState([]);
    const [shiftsData, setShiftsData] = useState([]);

    // Fetch Employees and Treatment Types from API
    useEffect(() => {
        const loadData = async () => {
            try {
                const [empData, treatmentLocationData, appointments] = await Promise.all([
                    fetchEmployees(),
                    // fetchTreatmentTypes(),
                    fetchTreatmentLocations(),
                    fetchAppointments()  // Fetch appointments
                ]);
                setEmployees(empData);
                setResources(treatmentLocationData);
                setCurrentEvents(formatAppointments(appointments)); 
            } catch (error) {
                console.error('Error loading data from API:', error);
            }
        };

        loadData();
    }, []);

    // Function to fetch and set Day Offs data
    const openDayOffsModal = async () => {
        const date = moment(startTime).format('YYYY-MM-DD');
        console.log(date)
        try {
            const data = await fetchDayOffsData(date);
            setDayOffsData(data);
            setIsDayOffModalOpen(true);
        } catch (error) {
            console.error('Error fetching day offs data:', error);
        }
    };

    // Function to fetch and set Leaves data
    const openShiftsModal = async () => {
        const date = moment(startTime).format('YYYY-MM-DD');
        try {
            const data = await fetchShiftsData(date);
            setShiftsData(data);
            setIsShiftsModalOpen(true);
        } catch (error) {
            console.error('Error fetching shifts data:', error);
        }
    };

        // Function to fetch and set Shifts data
        const openLeavesModal = async () => {
            const date = moment(startTime).format('YYYY-MM-DD');
            try {
                const data = await fetchLeaveData(date);
                setLeavesData(data);
                setIsLeavesModalOpen(true);
            } catch (error) {
                console.error('Error fetching leaves data:', error);
            }
        };


    const formatAppointments = (appointments) => {
        return appointments.map(appointment => {
            const datePart = appointment.scheduleDate.split('T')[0]; // Get only the date part
            const startDateTime = `${datePart}T${appointment.fromTime}`; // Correctly format start datetime
            const endDateTime = `${datePart}T${appointment.toTime}`; // Correctly format end datetime
    
            const start = new Date(startDateTime);
            const end = new Date(endDateTime);
    
            console.log("appointment.treatmentTypeId", appointment);      // Log the parsed end date
    
            return {
                id: appointment.id,
                title: `${appointment.customerName} - ${appointment.treatmentLocation.treatmentType.name}`,
                start: start,
                end: end,
                resourceId: appointment.treatmentLocation.location.id.toString(),
                employeeId: appointment.employeeId,
                backgroundColor: getBackgroundColor(appointment.treatmentLocation.treatmentType.id.toString()),
                extendedProps: {
                    contactNo: appointment.contactNo,
                    tokenNo: appointment.tokenNo,
                    employeeName: appointment.employee.fullName,
                }
            };
        });
    };
    
    


    const handleInputChange = (event) => {
        const { name, value } = event.target;
        
    
        setAppointmentData(prevState => ({
            ...prevState,
            [name]: value
        }));
    
        // Check if the treatment type has changed and there's already a start time set
        if (name === 'treatmentTypeId' && appointmentData.startTime) {
            const selectedTreatment = treatmentTypes.find(t => t.id.toString() === value);
            console.log(`Dropdown changed: ${name} = ${value}`);  // Debugging line
            if (selectedTreatment && selectedTreatment.treatmentType.durationHours) {
                // Calculate new end time based on the duration of the new treatment type
                const durationMilliseconds = selectedTreatment.treatmentType.durationHours * 3600000;
                const newEndTime = new Date(appointmentData.startTime.getTime() + durationMilliseconds);
                setEndTime(newEndTime);
    
                // Update endTime in appointmentData state
                setAppointmentData(prevState => ({
                    ...prevState,
                    endTime: newEndTime
                }));
            }
        }
    };
    

    const handleDateChange = (name, date) => {
        setAppointmentData({ ...appointmentData, [name]: date });
        setFormErrors(prevErrors => ({ ...prevErrors, scheduleDate: !date }));
    };

    const getBackgroundColor = (treatmentTypeId) => {
        switch(treatmentTypeId) {
            case '1': return '#e63168'; // Full Body
            case '2': return '#53c669'; // Hair
            case '4': return '#007bff'; // Treatment 03
            default: return '#d743de';
        }
    }

    function formatTimeForCSharp(date) {
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
    }

    function parseTime(timeStr) {
        // Check if time is in standard 12-hour format and convert to 24-hour format
        let [hours, minutes, seconds] = timeStr.split(':');
        const period = seconds.slice(-2);
        seconds = seconds.slice(0, 2);
    
        if (period.toLowerCase() === 'pm' && hours !== '12') {
            hours = parseInt(hours, 10) + 12;
        } else if (period.toLowerCase() === 'am' && hours === '12') {
            hours = '00';
        }
    
        hours = parseInt(hours, 10);
        minutes = parseInt(minutes, 10);
        seconds = parseInt(seconds, 10);
    
        // Special case for midnight to be represented as end of the day
        if (hours === 0 && minutes === 0 && seconds === 0) {
            hours = 24;
        }
    
        return new Date(1970, 0, 1, hours, minutes, seconds);
    }
    
    function isWithinWorkHours(appStart, appEnd, workStart, workEnd) {
        console.log('App Start:', appStart.toISOString());
        console.log('App End:', appEnd.toISOString());
        console.log('Work Start:', workStart.toISOString());
        console.log('Work End:', workEnd.toISOString());

        return appStart >= workStart && appEnd <= workEnd;
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        setNotification({ message: '', type: '' });

        // Check required fields and set errors
        const errors = {
            customerName: !appointmentData.customerName,
            contactNo: !appointmentData.contactNo,
            treatmentTypeId: !appointmentData.treatmentTypeId,
            employeeId: !appointmentData.employeeId,
            scheduleDate: !appointmentData.scheduleDate
        };

        setFormErrors(errors);

        // If any field has an error, stop the form submission
        if (Object.values(errors).some(error => error)) {
            console.log('Validation errors', errors);
            return;
        }

        // Find the selected treatment type and employee
        const selectedTreatment = treatmentTypes.find(type => type.id.toString() === appointmentData.treatmentTypeId);
        const selectedEmployee = employees.find(emp => emp.id.toString() === appointmentData.employeeId);

        if (!selectedTreatment || !selectedEmployee) {
            setNotification({ message: "Selected treatment type or employee is invalid.", type: 'error' });
            return;
        }

        const startTime = moment(appointmentData.startTime).toDate();
        const endTime = moment(appointmentData.endTime).toDate();

        const isOverlap = currentEvents.some(event => {
            if (appointmentData.id && (event.id.toString() === appointmentData.id.toString())) return false;
            console.log('current event: ', appointmentData.id, 'checking event: ', event.id);
            const eventEmployeeId = event.employeeId;
            const eventStart = moment(event.start).toDate();
            const eventEnd = moment(event.end).toDate();
            const isStartWithinEvent = startTime >= eventStart && startTime < eventEnd;
            const isEndWithinEvent = endTime > eventStart && endTime <= eventEnd;
            const isEventWithinNew = eventStart >= startTime && eventEnd <= endTime;

            return eventEmployeeId === selectedEmployee.id && (isStartWithinEvent || isEndWithinEvent || isEventWithinNew);
        });

        if (isOverlap) {
            setNotification({ message: `The employee ${selectedEmployee.fullName} is already assigned to another appointment during this time.`, type: 'error' });
            return;
        }

        const scheduleDate = moment(appointmentData.scheduleDate).toDate();
        const employeeSchedule = await fetchEmployeeSchedule(selectedEmployee.id, scheduleDate);

        if (!employeeSchedule) {
            setNotification({ message: `The selected employee is on leave or has a day off on the selected date.`, type: 'error' });
            return;
        }

        const startTimeFormatted = startTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        const endTimeFormatted = endTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

        const appStartTime = parseTime(startTimeFormatted);
        const appEndTime = parseTime(endTimeFormatted);
        const workStartTime = parseTime(employeeSchedule.shiftMaster.fromTime);
        const workEndTime = parseTime(employeeSchedule.shiftMaster.toTime);

        const isValid = isWithinWorkHours(appStartTime, appEndTime, workStartTime, workEndTime);

        if (!isValid) {
            setNotification({ message: `The appointment time does not align with the ${selectedEmployee.fullName}'s working hours. Shift of the selected employee is ${employeeSchedule.shiftMaster.fromTime} - ${employeeSchedule.shiftMaster.toTime}`, type: 'error' });
            return;
        }

        const userId = sessionStorage.getItem('userId');

        const appointmentDataToSend = {
            Id: appointmentData.id != 0 ? appointmentData.id : 0,
            ScheduleDate: appointmentData.scheduleDate,
            TreatmentTypeId: appointmentData.treatmentTypeId,
            EmployeeId: appointmentData.employeeId,
            CustomerName: appointmentData.customerName,
            ContactNo: appointmentData.contactNo,
            FromTime: formatTimeForCSharp(appointmentData.startTime),
            ToTime: formatTimeForCSharp(appointmentData.endTime),
            EnteredBy: userId,
            EnteredDate: new Date().toISOString(),
            TokenNo: appointmentData.tokenNo
        };

        console.log('appointmentDataToSend', appointmentDataToSend);
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
    };


    const refreshAppointments = async () => {
        const updatedAppointments = await fetchAppointments();
        setCurrentEvents(formatAppointments(updatedAppointments));
    };
    
    const resetAppointmentForm = () => {
        setAppointmentData({
            id: undefined,
            scheduleDate: new Date(),
            treatmentTypeId: '',
            employeeId: '',
            customerName: '',
            contactNo: '',
            tokenNo: '',
            tokenIssueTime: new Date(),
            resourceId: ''
        });
        setFormErrors({});
    };
    
    const handleEventDrop = async (info) => {
        const { event } = info;
        const newStart = moment(event.start).toDate();
        const newEnd = moment(event.end).toDate();
        
        console.log('New Start:', newStart);
        console.log('New End:', newEnd);
    
        try {
            const appointmentDetails = await fetchAppointmentDetails(event.id);
    
            const treatmentTypesbyLocations = await fetchTreatmentTypesByLocation();
    
            const filteredTreatmentType = treatmentTypesbyLocations.find(item => {
                return item.locationId === parseInt(event._def.resourceIds[0], 10) &&
                    item.treatmentTypeId === parseInt(appointmentDetails.treatmentLocation.treatmentTypeId, 10);
            });
    
            const treatmentTypesNew = treatmentTypesbyLocations.filter(item => item.locationId === parseInt(event._def.resourceIds[0]));
            const selectedTreatment = treatmentTypesNew.find(type => type.treatmentTypeId.toString() === appointmentDetails.treatmentLocation.treatmentTypeId.toString());
            const selectedEmployee = employees.find(emp => emp.id.toString() === appointmentDetails.employeeId.toString());
    
            if (!selectedTreatment || !selectedEmployee) {
                setNotification({ message: "Selected treatment type or employee is invalid.", type: 'error' });
                return;
            }
    
            const isOverlap = currentEvents.some(event => {
                if (event.id.toString() === appointmentDetails.id.toString()) return false;
                const eventEmployeeId = event.employeeId;
                const eventStart = moment(event.start).toDate();
                const eventEnd = moment(event.end).toDate();
                const isStartWithinEvent = newStart >= eventStart && newStart < eventEnd;
                const isEndWithinEvent = newEnd > eventStart && newEnd <= eventEnd;
                const isEventWithinNew = eventStart >= newStart && eventEnd <= newEnd;
    
                return eventEmployeeId === selectedEmployee.id && (isStartWithinEvent || isEndWithinEvent || isEventWithinNew);
            });
    
            if (isOverlap) {
                setNotification({ message: `The employee ${selectedEmployee.fullName} is already assigned to another appointment during this time.`, type: 'error' });
                return;
            }
    
            const scheduleDate = moment(newStart).toDate();
            console.log('Schedule Date:', scheduleDate);
            const employeeSchedule = await fetchEmployeeSchedule(selectedEmployee.id, scheduleDate);
    
            if (!employeeSchedule) {
                setNotification({ message: `The selected employee is on leave or has a day off on the selected date.`, type: 'error' });
                return;
            }
    
            const convertedFromShift = convertTimeToDateTime(employeeSchedule.shiftMaster.fromTime, newStart);
            const convertedToShift = convertTimeToDateTime(employeeSchedule.shiftMaster.toTime, newStart);
    
            console.log('Converted From Shift:', convertedFromShift);
            console.log('Converted To Shift:', convertedToShift);
    
            const isValid = isWithinWorkHours(newStart, newEnd, convertedFromShift, convertedToShift);
            if (!isValid) {
                setNotification({ message: `The appointment time does not align with the ${selectedEmployee.fullName}'s working hours. Shift of the selected employee is ${employeeSchedule.shiftMaster.fromTime} - ${employeeSchedule.shiftMaster.toTime}`, type: 'error' });
                return;
            }
    
            const userId = sessionStorage.getItem('userId');
    
            const updatedEvents = currentEvents.map(ev => {
                if (ev.id === event.id) {
                    return { ...ev, start: newStart, end: newEnd };
                }
                return ev;
            });
    
            setCurrentEvents(updatedEvents);
    
            setAppointmentData({
                id: event.id,
                scheduleDate: scheduleDate,
                startTime: newStart,
                endTime: newEnd,
                treatmentTypeId: appointmentDetails.treatmentTypeId.toString(),
                employeeId: appointmentDetails.employeeId.toString(),
                customerName: appointmentDetails.customerName,
                contactNo: appointmentDetails.contactNo,
                tokenNo: appointmentDetails.tokenNo,
                resourceId: event._def.resourceIds[0]
            });
    
            const appointmentDataToSend = {
                Id: event.id,
                ScheduleDate: moment(scheduleDate).toISOString(),
                TreatmentTypeId: filteredTreatmentType.id,
                EmployeeId: appointmentDetails.employeeId,
                CustomerName: appointmentDetails.customerName,
                ContactNo: appointmentDetails.contactNo,
                FromTime: moment(newStart).format('HH:mm:ss'),
                ToTime: moment(newEnd).format('HH:mm:ss'),
                EnteredBy: userId,
                EnteredDate: moment().toISOString(),
                TokenNo: appointmentDetails.tokenNo,
            };
    
            console.log('appointmentDataToSend', appointmentDataToSend);
            const createdAppointment = await addAppointment(appointmentDataToSend);
            setModalContent({ type: 'success', message: 'Appointment updated successfully!' });
            setShowModal(true);
            console.log('Appointment created:', createdAppointment);
        } catch (error) {
            console.error('Failed to update appointment:', error);
            setModalContent({ type: 'error', message: 'Failed to update appointment' });
            setShowModal(true);
        }
    };
    
    

    function convertTimeToDateTime(timeStr, baseDate) {
        const [hours, minutes, seconds] = timeStr.split(':').map(Number);

        // Create a new Date object based on the baseDate to avoid mutating it
        let dateTime = new Date(baseDate);
        dateTime.setHours(hours, minutes, seconds, 0);

        // Adjust the date object if the time indicates "00:00:00" which means midnight, i.e., start of the next day
        if (timeStr === "00:00:00") {
            dateTime.setDate(dateTime.getDate() + 1);
            dateTime.setHours(0, 0, 0, 0);
        }

        return dateTime;
    }

    useEffect(() => {
        console.log("Current events updated:", currentEvents);
    }, [currentEvents]);

    
    const handleDelete = async () => {
        try {
            await deleteAppointment(selectedEventId);
            const updatedEvents = currentEvents.filter(event => event.id !== selectedEventId);
            setCurrentEvents(updatedEvents);
            setSelectedEventId(null);
            window.location.reload();
            console.log('Appointment deleted successfully');
        } catch (error) {
            console.error('Failed to delete appointment:', error);
            alert('Could not delete the appointment. Please try again.');
        }
        setIsConfirmModalOpen(false);  // Close the confirmation modal
        setModalIsOpen(false);  // Close the main modal
    };

    const closeModal = () => {
        console.log("Opening confirmation modal");
        setIsConfirmModalOpen(true);  // This should trigger the modal to open
    };

    const closeModalByIcon = () => {
        setModalIsOpen(false);
    };
    
    // Add useEffect to monitor the state of isConfirmModalOpen
    useEffect(() => {
        console.log("isConfirmModalOpen changed to: ", isConfirmModalOpen);
    }, [isConfirmModalOpen]);

    function renderEventContent(eventInfo) {
        return (
            <>
                <div>
                    <strong>{eventInfo.event.title}</strong> {/* Main title */}
                </div>
                <div style={{fontSize: '1.00em', opacity: 1}}>
                    {eventInfo.event.extendedProps.employeeName} {/* Employee name */}
                </div>
            </>
        );
    }

    const [startTime, setStartTime] = useState(new Date());
    const [endTime, setEndTime] = useState(new Date());

    const handleTimeChange = (date, name) => {
        console.log(appointmentData.treatmentTypeId)
        if (name === 'startTime') {
            setStartTime(date);
            if (appointmentData.treatmentTypeId) {
                const selectedTreatment = treatmentTypes.find(t => t.id.toString() === appointmentData.treatmentTypeId);
                console.log(selectedTreatment)
                if (selectedTreatment && selectedTreatment.treatmentType.durationHours) {
                    const durationMilliseconds = selectedTreatment.treatmentType.durationHours * 3600000; // Convert hours to milliseconds
                    const newEndTime = new Date(date.getTime() + durationMilliseconds);
                    setEndTime(newEndTime);
                    console.log('newEndTime', newEndTime)

                    setAppointmentData(prevState => ({
                        ...prevState,
                        startTime: date, // Assuming you have startTime in your state
                        endTime: newEndTime // Assuming you have endTime in your state
                    }));
                }
            }
        }
    };
    

    const handleEventClick = async (clickInfo) => {
        console.log(clickInfo);
        const { event } = clickInfo;
    
        try {
            console.log("Event ID:", event.id);
            setSelectedEventId(event.id);
    
            // Simulate fetching details, replace this with your actual fetch call
            const appointmentDetails = await fetchAppointmentDetails(event.id);
            console.log("Fetched Appointment Details:", appointmentDetails);
    
            if (!appointmentDetails.scheduleDate) {
                setNotification({ message: `Schedule date is missing in the appointment details.`, type: 'error' });           
                console.error("Schedule date is missing in the appointment details.");
                return;
            }
    
            const startTime = new Date(`${appointmentDetails.scheduleDate.split('T')[0]}T${appointmentDetails.fromTime}`);
            const endTime = new Date(`${appointmentDetails.scheduleDate.split('T')[0]}T${appointmentDetails.toTime}`);
    
            // Make sure the selected resource exists in your state before setting it
            const foundResource = resources.find(r => r.id === appointmentDetails.treatmentLocation.locationId);
            if (!foundResource) {
                setNotification({ message: `Selected resource not found.`, type: 'error' });
                console.error("Selected resource not found.");
                return;
            }
    
            setSelectedResource(foundResource);

            const treatmentTypesbyLocations = await fetchTreatmentTypesByLocation();
    
            const treatmentTypes = treatmentTypesbyLocations.filter(item => item.locationId === foundResource.id);
            setTreatmentTypes(treatmentTypes);
    
            setAppointmentData({
                id: event.id,
                scheduleDate: appointmentDetails.scheduleDate,
                startTime: startTime,
                endTime: endTime,
                treatmentTypeId: appointmentDetails.treatmentTypeId.toString(),
                employeeId: appointmentDetails.employeeId.toString(),
                customerName: appointmentDetails.customerName,
                contactNo: appointmentDetails.contactNo,
                tokenNo: appointmentDetails.tokenNo,
                resourceId: foundResource.id.toString()
            });
    
            setStartTime(startTime);
            setEndTime(endTime);
            setModalIsOpen(true);
        } catch (error) {
            console.error('Error fetching appointment details:', error);
        }
    };

    return (
        <div>
            <NotificationComponent
                message={notification.message}
                type={notification.type}
                onClose={() => setNotification({ message: '', type: '' })}
            />
            <FullCalendar
                className={'fc'}
                plugins={[timeGridPlugin, resourceTimeGridPlugin, interactionPlugin]}
                initialView="resourceTimeGridDay"
                resources={resources.map(location => ({
                    id: location.id.toString(),
                    title: location.name
                }))}
                selectable={true}
                select={async (selectInfo) => {
                    setStartTime(selectInfo.start);
                    setEndTime(selectInfo.start);
                    const locationId = parseInt(selectInfo.resource.id); // Get the selected location ID
                    setSelectedResource(resources.find(r => r.id === locationId));
                    setAppointmentData(prevState => ({
                        ...prevState,
                        scheduleDate: selectInfo.start,
                        resourceId: selectInfo.resource.id,
                        treatmentTypeId: '',
                        employeeId: '',
                        startTime: selectInfo.start,
                        customerName: '',
                        contactNo: ''
                    }));
                    setModalIsOpen(true);
                
                    try {
                        const treatmentTypesbyLocations = await fetchTreatmentTypesByLocation();
                        console.log('treatmentTypesbyLocations', treatmentTypesbyLocations);
                
                        const treatmentTypes = treatmentTypesbyLocations.filter(item => item.locationId === locationId);
                
                        console.log('Filtered treatment types for location:', treatmentTypes);
                        setTreatmentTypes(treatmentTypes);
                    } catch (error) {
                        console.error('Error loading treatment types for selected location:', error);
                    }
                }}
                events={currentEvents}
                eventContent={renderEventContent}
                allDaySlot={false}
                slotMinTime="07:00:00" // Start displaying times from 7 AM
                eventDrop={handleEventDrop}
                eventClick={handleEventClick}
                editable={true}
            />

<Modal
    isOpen={modalIsOpen}
    onRequestClose={() => setIsConfirmModalOpen(false)}
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
                        <div className="col-10">
                            <h5 className="modal-title-appointment custom-modal-title-appointment">Create Appointment at <span style={{color:'green', fontWeight:'bold'}}>{selectedResource.name || ''}</span></h5>
                        </div>
                        <div className="col-2 text-right">
                            <button type="button" className="close custom-close" onClick={closeModalByIcon}>
                                <span>&times;</span>
                            </button>
                        </div>
                    </div>
                    <div className='row'>
                        <div className='col-md-4 col-sm-4'>
                            <button onClick={openDayOffsModal} className="btn btn-warning">Day Offs</button>
                        </div>
                        <div className='col-md-4 col-sm-4'>
                            <button onClick={openLeavesModal} className="btn btn-warning">Leaves</button>
                        </div>
                        <div className='col-md-4 col-sm-4'>
                            <button onClick={openShiftsModal} className="btn btn-warning">Shifts</button>
                        </div>
                    </div>
                </div>
            </div>
            
            <NotificationComponent
                message={notification.message}
                type={notification.type}
                onClose={() => setNotification({ message: '', type: '' })}
            />
            <form onSubmit={handleSubmit} className="modal-appoinment-body modal-body custom-modal-body">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-12 form-group">
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
                    </div>
                    <div className="row">
                        <div className="col-md-12 form-group">
                            <label htmlFor="contactNo">Contact Number <span className="text-danger">*</span></label>
                            <input className={`form-control ${formErrors.contactNo ? 'is-invalid' : ''}`} type="text" id="contactNo" name="contactNo" value={appointmentData.contactNo} onChange={handleInputChange} required />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6 col-sm-6 form-group">
                            <label htmlFor="treatmentTypeId">Treatment Type <span className="text-danger">*</span></label>
                            <select className={`form-control ${formErrors.treatmentTypeId ? 'is-invalid' : ''}`} id="treatmentTypeId" name="treatmentTypeId" value={appointmentData.treatmentTypeId} onChange={handleInputChange} required>
                                <option value="" disabled>Select a Treatment Type</option>
                                {treatmentTypes.map(type => <option key={type.id} value={type.id}>{type.treatmentType.name}</option>)}
                            </select>
                        </div>
                        <div className="col-md-6 col-sm-6 form-group">
                            <label htmlFor="scheduleDate">Schedule Date <span className="text-danger">*</span></label><br/>
                            <DatePicker className={`form-control ${formErrors.scheduleDate ? 'is-invalid' : ''}`} selected={appointmentData.scheduleDate} onChange={(date) => handleDateChange('scheduleDate', date)} dateFormat="MMMM d, yyyy" />
                        </div>
                    </div>
                    <div className='row'>
                        <div className="col-md-6 col-sm-6 form-group">
                            <label htmlFor="startTime">Start Time <span className="text-danger">*</span></label><br/>
                            <DatePicker
                                className="form-control"
                                selected={startTime}
                                onChange={(date) => handleTimeChange(date, 'startTime')}
                                showTimeSelect
                                showTimeSelectOnly
                                timeIntervals={15}
                                timeCaption="Time"
                                dateFormat="h:mm aa"
                            />
                        </div>
                        <div className="col-md-6 col-sm-6 form-group">
                            <label htmlFor="endTime">End Time <span className="text-danger">*</span></label><br/>
                            <DatePicker
                                className="form-control"
                                selected={endTime}
                                showTimeSelect
                                showTimeSelectOnly
                                timeIntervals={15}
                                timeCaption="Time"
                                dateFormat="h:mm aa"
                                disabled
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6 form-group">
                            <label htmlFor="employeeId">Employee <span className="text-danger">*</span></label>
                            <select className={`form-control ${formErrors.employeeId ? 'is-invalid' : ''}`} id="employeeId" name="employeeId" value={appointmentData.employeeId} onChange={handleInputChange} required>
                                <option value="" disabled>Select an Employee</option>
                                {employees.map(emp => <option key={emp.id} value={emp.id}>{emp.fullName}</option>)}
                            </select>
                        </div>
                        <div className="col-md-6 form-group">
                            <label htmlFor="tokenNo">Token Number</label>
                            <input className="form-control" type="text" id="tokenNo" name="tokenNo" value={appointmentData.tokenNo} onChange={handleInputChange} />
                        </div>
                    </div>
                </div>
            </form>
            <div className="modal-footer custom-modal-footer row">
                <div className="col-6 p-2">
                    <button type="button" className="btn btn-danger custom-button" onClick={closeModal}>Delete</button>
                </div>
                <div className="col-6 p-2">
                    <button onClick={handleSubmit} className="btn btn-primary custom-button">Save</button>
                </div>
            </div>
        </div>
    </div>
</Modal>

            <ConfirmationModal
                isOpen={isConfirmModalOpen}
                onClose={() => setIsConfirmModalOpen(false)}
                onConfirm={handleDelete}
            />
            <AppointmentModalComponent
                show={showModal}
                onClose={closeModal}
                type={modalContent.type}
                message={modalContent.message}
            />

            {/* New Modals for Employee Day Offs and Employee Leaves */}
            <EmployeeDayOffsModal
                isOpen={isDayOffModalOpen}
                onClose={() => setIsDayOffModalOpen(false)}
                employees={dayOffsData}
            />
            <EmployeeLeavesModal
                isOpen={isLeavesModalOpen}
                onClose={() => setIsLeavesModalOpen(false)}
                employees={leavesData}
            />
            <EmployeeShiftsModal
                isOpen={isShiftsModalOpen}
                onClose={() => setIsShiftsModalOpen(false)}
                employees={shiftsData}
            />
        </div>
    );
}

export default AppointmentScheduler;
